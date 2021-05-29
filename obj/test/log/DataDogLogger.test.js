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
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const DataDogLogger_1 = require("../../src/log/DataDogLogger");
const LoggerFixture_1 = require("../fixtures/LoggerFixture");
suite('DataDogLogger', () => {
    let _logger;
    let _fixture;
    setup(() => __awaiter(void 0, void 0, void 0, function* () {
        let apiKey = process.env['DATADOG_API_KEY'] || '3eb3355caf628d4689a72084425177ac';
        _logger = new DataDogLogger_1.DataDogLogger();
        _fixture = new LoggerFixture_1.LoggerFixture(_logger);
        let config = pip_services3_commons_nodex_1.ConfigParams.fromTuples('source', 'test', 'credential.access_key', apiKey);
        _logger.configure(config);
        yield _logger.open(null);
    }));
    teardown(() => __awaiter(void 0, void 0, void 0, function* () {
        yield _logger.close(null);
    }));
    test('Log Level', () => {
        _fixture.testLogLevel();
    });
    test('Simple Logging', () => __awaiter(void 0, void 0, void 0, function* () {
        yield _fixture.testSimpleLogging();
    }));
    test('Error Logging', () => __awaiter(void 0, void 0, void 0, function* () {
        yield _fixture.testErrorLogging();
    }));
});
//# sourceMappingURL=DataDogLogger.test.js.map