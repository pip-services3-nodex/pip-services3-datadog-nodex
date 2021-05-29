/** @module log */
/** @hidden */
const os = require('os');

import { ConfigParams } from 'pip-services3-commons-nodex';
import { IReferences } from 'pip-services3-commons-nodex';
import { IReferenceable } from 'pip-services3-commons-nodex';
import { IOpenable } from 'pip-services3-commons-nodex';
import { CachedLogger } from 'pip-services3-components-nodex';
import { LogMessage } from 'pip-services3-components-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';
import { ContextInfo } from 'pip-services3-components-nodex';

import { DataDogLogMessage } from '../clients/DataDogLogMessage';
import { DataDogLogClient } from '../clients/DataDogLogClient';

/**
 * Logger that dumps execution logs to DataDog service.
 * 
 * DataDog is a popular monitoring SaaS service. It collects logs, metrics, events
 * from infrastructure and applications and analyze them in a single place.
 * 
 * ### Configuration parameters ###
 * 
 * - level:             maximum log level to capture
 * - source:            source (context) name
 * - connection:
 *     - discovery_key:         (optional) a key to retrieve the connection from [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/connect.idiscovery.html IDiscovery]]
 *     - protocol:              (optional) connection protocol: http or https (default: https)
 *     - host:                  (optional) host name or IP address (default: http-intake.logs.datadoghq.com)
 *     - port:                  (optional) port number (default: 443)
 *     - uri:                   (optional) resource URI or connection string with all parameters in it
 * - credential:
 *     - access_key:      DataDog client api key
 * - options:
 *     - interval:        interval in milliseconds to save log messages (default: 10 seconds)
 *     - max_cache_size:  maximum number of messages stored in this cache (default: 100)
 *     - reconnect:       reconnect timeout in milliseconds (default: 60 sec)
 *     - timeout:         invocation timeout in milliseconds (default: 30 sec)
 *     - max_retries:     maximum number of retries (default: 3)
 * 
 * ### References ###
 * 
 * - <code>\*:context-info:\*:\*:1.0</code>      (optional) [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/classes/info.contextinfo.html ContextInfo]] to detect the context id and specify counters source
 * - <code>\*:discovery:\*:\*:1.0</code>         (optional) [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
 * 
 * ### Example ###
 * 
 *     let logger = new DataDogLogger();
 *     logger.configure(ConfigParams.fromTuples(
 *         "credential.access_key", "827349874395872349875493"
 *     ));
 *     
 *     await logger.open("123");
 *     
 *     logger.error("123", ex, "Error occured: %s", ex.message);
 *     logger.debug("123", "Everything is OK.");
 */
export class DataDogLogger extends CachedLogger implements IReferenceable, IOpenable {
    private _client: DataDogLogClient = new DataDogLogClient();
    private _timer: any;
    private _instance: string = os.hostname();

    /**
     * Creates a new instance of the logger.
     */
    public constructor() {
        super();
    }

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
        super.configure(config);
        this._client.configure(config);

        this._instance = config.getAsStringWithDefault("instance", this._instance);
    }

    /**
	 * Sets references to dependent components.
	 * 
	 * @param references 	references to locate the component dependencies. 
     */
    public setReferences(references: IReferences): void {
        super.setReferences(references);
        this._client.setReferences(references);

        let contextInfo = references.getOneOptional<ContextInfo>(
            new Descriptor("pip-services", "context-info", "default", "*", "1.0"));
        if (contextInfo != null && this._source == null)
            this._source = contextInfo.name;
        if (contextInfo != null && this._instance == null)
            this._instance = contextInfo.contextId;
    }

    /**
	 * Checks if the component is opened.
	 * 
	 * @returns true if the component has been opened and false otherwise.
     */
    public isOpen(): boolean {
        return this._timer != null;
    }

    /**
	 * Opens the component.
	 * 
	 * @param correlationId 	(optional) transaction id to trace execution through call chain.
     */
    public async open(correlationId: string): Promise<void> {
        if (this.isOpen()) {
            return;
        }

        await this._client.open(correlationId);

        this._timer = setInterval(() => { this.dump() }, this._interval);
    }

    /**
	 * Closes component and frees used resources.
	 * 
	 * @param correlationId 	(optional) transaction id to trace execution through call chain.
     */
    public async close(correlationId: string): Promise<void> {
        await this.save(this._cache);

        if (this._timer) {
            clearInterval(this._timer);
        }

        this._cache = [];
        this._timer = null;

        await this._client.close(correlationId);
    }

    // private convertStatus(level: number): string {
    //     switch (level) {
    //         case LogLevel.Fatal:
    //             return DataDogStatus.Emergency;
    //         case LogLevel.Error:
    //             return DataDogStatus.Error;
    //         case LogLevel.Warn:
    //             return DataDogStatus.Warn;
    //         case LogLevel.Info:
    //             return DataDogStatus.Info;
    //         case LogLevel.Debug:
    //             return DataDogStatus.Debug;
    //         case LogLevel.Trace:
    //             return DataDogStatus.Debug;
    //         default:
    //             return DataDogStatus.Info;
    //     }
    // }

    private convertMessage(message: LogMessage): DataDogLogMessage {
        let result: DataDogLogMessage = {
            time: message.time || new Date(),
            tags: {
                correlation_id: message.correlation_id
            },
            host: this._instance,
            service: message.source || this._source,
            status: message.level,
            message: message.message
        };

        if (message.error) {
            result.error_kind = message.error.type;
            result.error_message = message.error.message;
            result.error_stack = message.error.stack_trace
        }

        return result;
    }

    /**
     * Saves log messages from the cache.
     * 
     * @param messages  a list with log messages
     */
    protected async save(messages: LogMessage[]): Promise<void> {
        if (!this.isOpen() || messages.length == 0) {
            return;
        }

        let data = messages.map((m) => { return this.convertMessage(m); });

        await this._client.sendLogs("datadog-logger", data);
    }
}