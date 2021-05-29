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
exports.DataDogMetricsClient = void 0;
/** @module clients */
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_3 = require("pip-services3-commons-nodex");
const pip_services3_components_nodex_1 = require("pip-services3-components-nodex");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
class DataDogMetricsClient extends pip_services3_rpc_nodex_1.RestClient {
    constructor(config) {
        super();
        this._defaultConfig = pip_services3_commons_nodex_1.ConfigParams.fromTuples("connection.protocol", "https", "connection.host", "api.datadoghq.com", "connection.port", 443, "credential.internal_network", "true");
        this._credentialResolver = new pip_services3_components_nodex_1.CredentialResolver();
        if (config)
            this.configure(config);
        this._baseRoute = "api/v1";
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
    convertPoints(points) {
        let result = points.map((p) => {
            let time = (p.time || new Date()).getTime() / 1000;
            return [
                pip_services3_commons_nodex_3.StringConverter.toString(time),
                pip_services3_commons_nodex_3.StringConverter.toString(p.value)
            ];
        });
        return result;
    }
    convertMetric(metric) {
        let tags = metric.tags;
        if (metric.service) {
            tags = tags || {};
            tags.service = metric.service;
        }
        let result = {
            "metric": metric.metric,
            "type": metric.type || 'gauge',
            "points": this.convertPoints(metric.points),
        };
        if (tags)
            result['tags'] = this.convertTags(tags);
        if (metric.host)
            result['host'] = metric.host;
        if (metric.interval)
            result['interval'] = metric.interval;
        return result;
    }
    convertMetrics(metrics) {
        let series = metrics.map((m) => { return this.convertMetric(m); });
        return {
            series: series
        };
    }
    sendMetrics(correlationId, metrics) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = this.convertMetrics(metrics);
            // Commented instrumentation because otherwise it will never stop sending logs...
            //let timing = this.instrument(correlationId, "datadog.send_metrics");
            try {
                yield this.call("post", "series", null, null, data);
            }
            finally {
                //timing.endTiming();
            }
        });
    }
}
exports.DataDogMetricsClient = DataDogMetricsClient;
//# sourceMappingURL=DataDogMetricsClient.js.map