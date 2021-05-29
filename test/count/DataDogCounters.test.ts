import { ConfigParams } from 'pip-services3-commons-nodex';
import { References } from 'pip-services3-commons-nodex';

import { DataDogCounters } from '../../src/count/DataDogCounters';
import { CountersFixture } from '../fixtures/CountersFixture';

suite('DataDogCounters', ()=> {
    let _counters: DataDogCounters;
    let _fixture: CountersFixture;

    setup(async () => {
        let apiKey = process.env['DATADOG_API_KEY'] || '3eb3355caf628d4689a72084425177ac';

        _counters = new DataDogCounters();
        _fixture = new CountersFixture(_counters);

        let config = ConfigParams.fromTuples(
            'source', 'test',
            'credential.access_key', apiKey
        );
        _counters.configure(config);

        await _counters.open(null);
    });

    teardown(async () => {
        await _counters.close(null);
    });

    test('Simple Counters', async () => {
        await _fixture.testSimpleCounters();
    });

    test('Measure Elapsed Time', async () => {
        await _fixture.testMeasureElapsedTime();
    });

});