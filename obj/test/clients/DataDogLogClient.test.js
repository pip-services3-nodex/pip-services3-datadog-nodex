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
const DataDogLogClient_1 = require("../../src/clients/DataDogLogClient");
const DataDogStatus_1 = require("../../src/clients/DataDogStatus");
suite('DataDogLogClient', () => {
    let _client;
    setup(() => __awaiter(void 0, void 0, void 0, function* () {
        let apiKey = process.env['DATADOG_API_KEY'] || '3eb3355caf628d4689a72084425177ac';
        _client = new DataDogLogClient_1.DataDogLogClient();
        let config = pip_services3_commons_nodex_1.ConfigParams.fromTuples('source', 'test', 'credential.access_key', apiKey);
        _client.configure(config);
        yield _client.open(null);
    }));
    teardown(() => __awaiter(void 0, void 0, void 0, function* () {
        yield _client.close(null);
    }));
    test('Send Logs', () => __awaiter(void 0, void 0, void 0, function* () {
        let messages = [
            {
                time: new Date(),
                service: 'TestService',
                host: 'TestHost',
                status: DataDogStatus_1.DataDogStatus.Debug,
                message: 'Test trace message'
            },
            {
                time: new Date(),
                service: 'TestService',
                host: 'TestHost',
                status: DataDogStatus_1.DataDogStatus.Info,
                message: 'Test info message'
            },
            {
                time: new Date(),
                service: 'TestService',
                host: 'TestHost',
                status: DataDogStatus_1.DataDogStatus.Error,
                message: 'Test error message',
                error_kind: 'Exception',
                error_stack: 'Stack trace...'
            },
            {
                time: new Date(),
                service: 'TestService',
                host: 'TestHost',
                status: DataDogStatus_1.DataDogStatus.Emergency,
                message: 'Test fatal message',
                error_kind: 'Exception',
                error_stack: 'Stack trace...'
            },
        ];
        yield _client.sendLogs(null, messages);
    }));
});
//# sourceMappingURL=DataDogLogClient.test.js.map