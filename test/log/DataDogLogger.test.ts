import { ConfigParams } from 'pip-services3-commons-nodex';

import { DataDogLogger } from '../../src/log/DataDogLogger';
import { LoggerFixture } from '../fixtures/LoggerFixture';

suite('DataDogLogger', () => {
    let _logger: DataDogLogger;
    let _fixture: LoggerFixture;

    setup(async () => {
        let apiKey = process.env['DATADOG_API_KEY'] || '3eb3355caf628d4689a72084425177ac';

        _logger = new DataDogLogger();
        _fixture = new LoggerFixture(_logger);

        let config = ConfigParams.fromTuples(
            'source', 'test',
            'credential.access_key', apiKey
        );
        _logger.configure(config);

        await _logger.open(null);
    });

    teardown(async () => {
        await _logger.close(null);
    });

    test('Log Level', () => {
        _fixture.testLogLevel();
    });

    test('Simple Logging', async () => {
        await _fixture.testSimpleLogging();
    });

    test('Error Logging', async () => {
        await _fixture.testErrorLogging();
    });

});