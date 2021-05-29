/** @module clients */
import { ConfigParams } from 'pip-services3-commons-nodex';
import { ConfigException } from 'pip-services3-commons-nodex';
import { IReferences } from 'pip-services3-commons-nodex';
import { StringConverter } from 'pip-services3-commons-nodex';
import { CredentialResolver } from 'pip-services3-components-nodex';
import { RestClient, } from 'pip-services3-rpc-nodex';

import { DataDogLogMessage } from './DataDogLogMessage';

export class DataDogLogClient extends RestClient {
    private _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        "connection.protocol", "https",
        "connection.host", "http-intake.logs.datadoghq.com",
        "connection.port", 443,
        "credential.internal_network", "true"
    );
    private _credentialResolver: CredentialResolver = new CredentialResolver();

    public constructor(config?: ConfigParams) {
        super();

        if (config) this.configure(config);
        this._baseRoute = "v1";
    }   

    public configure(config: ConfigParams): void {
        config = this._defaultConfig.override(config);
        super.configure(config);
        this._credentialResolver.configure(config);
    }

    public setReferences(refs: IReferences): void {
        super.setReferences(refs);
        this._credentialResolver.setReferences(refs);
    }

    public async open(correlationId: string): Promise<void> {
        let credential = await this._credentialResolver.lookup(correlationId);

        if (credential == null || credential.getAccessKey() == null) {
            throw new ConfigException(
                correlationId,
                "NO_ACCESS_KEY",
                "Missing access key in credentials"
            );
        }

        this._headers = this._headers || {};
        this._headers['DD-API-KEY'] = credential.getAccessKey();

        await super.open(correlationId);
    }

    private convertTags(tags: any[]): string {
        if (tags == null) return null;

        let builder: string = "";

        for (let key in tags) {
            if (builder != "")
                builder += ",";
            builder += key + ":" + tags[key];
        }
        return builder;
    }

    private convertMessage(message: DataDogLogMessage): any {
        let result = {
            "timestamp": StringConverter.toString(message.time || new Date()),
            "status": message.status || "INFO",
            "ddsource": message.source || 'pip-services',
//            "source": message.source || 'pip-services',
            "service": message.service,
            "message": message.message,
        };

        if (message.tags)
            result['ddtags'] = this.convertTags(message.tags);
        if (message.host)
            result['host'] = message.host;
        if (message.logger_name)
            result['logger.name'] = message.logger_name;
        if (message.thread_name)
            result['logger.thread_name'] = message.thread_name;
        if (message.error_message)
            result['error.message'] = message.error_message;
        if (message.error_kind)
            result['error.kind'] = message.error_kind;
        if (message.error_stack)
            result['error.stack'] = message.error_stack;

        return result;
    }

    private convertMessages(messages: DataDogLogMessage[]): any[] {
        return messages.map((m) => { return this.convertMessage(m); });
    }

    public async sendLogs(correlationId: string, messages: DataDogLogMessage[]): Promise<void> {
        let data = this.convertMessages(messages);

        // Commented instrumentation because otherwise it will never stop sending logs...
        //let timing = this.instrument(correlationId, "datadog.send_logs");
        try {
            await this.call("post", "input", null, null, data);
        } finally {
            //timing.endTiming();
        }
    }
}