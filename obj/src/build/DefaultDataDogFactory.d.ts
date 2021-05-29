/** @module build */
import { Factory } from 'pip-services3-components-nodex';
/**
 * Creates DataDog components by their descriptors.
 *
 * @see [[DataDogLogger]]
 */
export declare class DefaultDataDogFactory extends Factory {
    private static readonly DataDogLoggerDescriptor;
    private static readonly DataDogCountersDescriptor;
    /**
     * Create a new instance of the factory.
     */
    constructor();
}
