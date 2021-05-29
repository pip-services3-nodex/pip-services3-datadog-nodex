"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultDataDogFactory = void 0;
/** @module build */
const pip_services3_components_nodex_1 = require("pip-services3-components-nodex");
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const DataDogLogger_1 = require("../log/DataDogLogger");
const DataDogCounters_1 = require("../count/DataDogCounters");
/**
 * Creates DataDog components by their descriptors.
 *
 * @see [[DataDogLogger]]
 */
class DefaultDataDogFactory extends pip_services3_components_nodex_1.Factory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.registerAsType(DefaultDataDogFactory.DataDogLoggerDescriptor, DataDogLogger_1.DataDogLogger);
        this.registerAsType(DefaultDataDogFactory.DataDogCountersDescriptor, DataDogCounters_1.DataDogCounters);
    }
}
exports.DefaultDataDogFactory = DefaultDataDogFactory;
DefaultDataDogFactory.DataDogLoggerDescriptor = new pip_services3_commons_nodex_1.Descriptor("pip-services", "logger", "datadog", "*", "1.0");
DefaultDataDogFactory.DataDogCountersDescriptor = new pip_services3_commons_nodex_1.Descriptor("pip-services", "counters", "datadog", "*", "1.0");
//# sourceMappingURL=DefaultDataDogFactory.js.map