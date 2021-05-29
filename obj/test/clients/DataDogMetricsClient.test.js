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
const assert = require('chai').assert;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const DataDogMetricsClient_1 = require("../../src/clients/DataDogMetricsClient");
const DataDogMetricType_1 = require("../../src/clients/DataDogMetricType");
suite('DataDogMetricClient', () => {
    let _client;
    setup(() => __awaiter(void 0, void 0, void 0, function* () {
        let apiKey = process.env['DATADOG_API_KEY'] || '3eb3355caf628d4689a72084425177ac';
        _client = new DataDogMetricsClient_1.DataDogMetricsClient();
        let config = pip_services3_commons_nodex_1.ConfigParams.fromTuples('source', 'test', 'credential.access_key', apiKey);
        _client.configure(config);
        yield _client.open(null);
    }));
    teardown(() => __awaiter(void 0, void 0, void 0, function* () {
        yield _client.close(null);
    }));
    test('Send Metrics', () => __awaiter(void 0, void 0, void 0, function* () {
        let metrics = [
            {
                metric: 'test.metric.1',
                service: 'TestService',
                host: 'TestHost',
                type: DataDogMetricType_1.DataDogMetricType.Gauge,
                points: [{
                        time: new Date(),
                        value: pip_services3_commons_nodex_2.RandomDouble.nextDouble(0, 100)
                    }]
            },
            {
                metric: 'test.metric.2',
                service: 'TestService',
                host: 'TestHost',
                type: DataDogMetricType_1.DataDogMetricType.Rate,
                interval: 100,
                points: [{
                        time: new Date(),
                        value: pip_services3_commons_nodex_2.RandomDouble.nextDouble(0, 100)
                    }]
            },
            {
                metric: 'test.metric.3',
                service: 'TestService',
                host: 'TestHost',
                type: DataDogMetricType_1.DataDogMetricType.Count,
                interval: 100,
                points: [{
                        time: new Date(),
                        value: pip_services3_commons_nodex_2.RandomDouble.nextDouble(0, 100)
                    }]
            }
        ];
        yield _client.sendMetrics(null, metrics);
    }));
});
//# sourceMappingURL=DataDogMetricsClient.test.js.map