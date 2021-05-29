const assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-nodex';
import { RandomDouble } from 'pip-services3-commons-nodex';

import { DataDogMetricsClient } from '../../src/clients/DataDogMetricsClient';
import { DataDogMetric } from '../../src/clients/DataDogMetric';
import { DataDogMetricType } from '../../src/clients/DataDogMetricType';

suite('DataDogMetricClient', () => {
    let _client: DataDogMetricsClient;

    setup(async () => {
        let apiKey = process.env['DATADOG_API_KEY'] || '3eb3355caf628d4689a72084425177ac';

        _client = new DataDogMetricsClient();

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

    test('Send Metrics', async () => {
        let metrics: DataDogMetric[] = [
            {
                metric: 'test.metric.1',
                service: 'TestService',
                host: 'TestHost',
                type: DataDogMetricType.Gauge,
                points: [{
                    time: new Date(),
                    value: RandomDouble.nextDouble(0, 100)
                }]
            },
            {
                metric: 'test.metric.2',
                service: 'TestService',
                host: 'TestHost',
                type: DataDogMetricType.Rate,
                interval: 100,
                points: [{
                    time: new Date(),
                    value: RandomDouble.nextDouble(0, 100)
                }]
            },
            {
                metric: 'test.metric.3',
                service: 'TestService',
                host: 'TestHost',
                type: DataDogMetricType.Count,
                interval: 100,
                points: [{
                    time: new Date(),
                    value: RandomDouble.nextDouble(0, 100)
                }]
            }
        ];

        await _client.sendMetrics(null, metrics);
    });

});