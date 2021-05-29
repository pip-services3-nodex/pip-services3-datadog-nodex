const assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-nodex';

import { DataDogLogClient } from '../../src/clients/DataDogLogClient';
import { DataDogLogMessage } from '../../src/clients/DataDogLogMessage';
import { DataDogStatus } from '../../src/clients/DataDogStatus';

suite('DataDogLogClient', () => {
    let _client: DataDogLogClient;

    setup(async () => {
        let apiKey = process.env['DATADOG_API_KEY'] || '3eb3355caf628d4689a72084425177ac';

        _client = new DataDogLogClient();

        let config = ConfigParams.fromTuples(
            'source', 'test',
            'credential.access_key', apiKey
        );
        _client.configure(config);

        await _client.open(null);
    });

    teardown(async () => {
        await _client.close(null);
    });

    test('Send Logs', async () => {
        let messages: DataDogLogMessage[] = [
            {
                time: new Date(),
                service: 'TestService',
                host: 'TestHost',
                status: DataDogStatus.Debug,
                message: 'Test trace message'
            },
            {
                time: new Date(),
                service: 'TestService',
                host: 'TestHost',
                status: DataDogStatus.Info,
                message: 'Test info message'
            },
            {
                time: new Date(),
                service: 'TestService',
                host: 'TestHost',
                status: DataDogStatus.Error,
                message: 'Test error message',
                error_kind: 'Exception',
                error_stack: 'Stack trace...'
            },
            {
                time: new Date(),
                service: 'TestService',
                host: 'TestHost',
                status: DataDogStatus.Emergency,
                message: 'Test fatal message',
                error_kind: 'Exception',
                error_stack: 'Stack trace...'
            },
        ];

        await _client.sendLogs(null, messages);
    });

});