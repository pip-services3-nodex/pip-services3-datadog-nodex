/** @module build */
import { Factory } from 'pip-services3-components-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';

import { DataDogLogger } from '../log/DataDogLogger';
import { DataDogCounters } from '../count/DataDogCounters';

/**
 * Creates DataDog components by their descriptors.
 * 
 * @see [[DataDogLogger]]
 */
export class DefaultDataDogFactory extends Factory {
	private static readonly DataDogLoggerDescriptor = new Descriptor("pip-services", "logger", "datadog", "*", "1.0");
	private static readonly DataDogCountersDescriptor = new Descriptor("pip-services", "counters", "datadog", "*", "1.0");

	/**
	 * Create a new instance of the factory.
	 */
	public constructor() {
        super();
		this.registerAsType(DefaultDataDogFactory.DataDogLoggerDescriptor, DataDogLogger);
		this.registerAsType(DefaultDataDogFactory.DataDogCountersDescriptor, DataDogCounters);
	}
}