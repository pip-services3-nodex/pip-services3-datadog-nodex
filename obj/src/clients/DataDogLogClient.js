"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataDogLogClient = void 0;
/** @module clients */
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_3 = require("pip-services3-commons-nodex");
const pip_services3_components_nodex_1 = require("pip-services3-components-nodex");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
class DataDogLogClient extends pip_services3_rpc_nodex_1.RestClient {
    constructor(config) {
        super();
        this._defaultConfig = pip_services3_commons_nodex_1.ConfigParams.fromTuples("connection.protocol", "https", "connection.host", "http-intake.logs.datadoghq.com", "connection.port", 443, "credential.internal_network", "true");
        this._credentialResolver = new pip_services3_components_nodex_1.CredentialResolver();
        if (config)
            this.configure(config);
        this._baseRoute = "v1";
    }
    configure(config) {
        config = this._defaultConfig.override(config);
        super.configure(config);
        this._credentialResolver.configure(config);
    }
    setReferences(refs) {
        super.setReferences(refs);
        this._credentialResolver.setReferences(refs);
    }
    open(correlationId) {
        const _super = Object.create(null, {
            open: { get: () => super.open }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let credential = yield this._credentialResolver.lookup(correlationId);
            if (credential == null || credential.getAccessKey() == null) {
                throw new pip_services3_commons_nodex_2.ConfigException(correlationId, "NO_ACCESS_KEY", "Missing access key in credentials");
            }
            this._headers = this._headers || {};
            this._headers['DD-API-KEY'] = credential.getAccessKey();
            yield _super.open.call(this, correlationId);
        });
    }
    convertTags(tags) {
        if (tags == null)
            return null;
        let builder = "";
        for (let key in tags) {
            if (builder != "")
                builder += ",";
            builder += key + ":" + tags[key];
        }
        return builder;
    }
    convertMessage(message) {
        let result = {
            "timestamp": pip_services3_commons_nodex_3.StringConverter.toString(message.time || new Date()),
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
    convertMessages(messages) {
        return messages.map((m) => { return this.convertMessage(m); });
    }
    sendLogs(correlationId, messages) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = this.convertMessages(messages);
            // Commented instrumentation because otherwise it will never stop sending logs...
            //let timing = this.instrument(correlationId, "datadog.send_logs");
            try {
                yield this.call("post", "input", null, null, data);
            }
            finally {
                //timing.endTiming();
            }
        });
    }
}
exports.DataDogLogClient = DataDogLogClient;
//# sourceMappingURL=DataDogLogClient.js.map