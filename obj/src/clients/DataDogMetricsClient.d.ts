/** @module clients */
import { ConfigParams } from 'pip-services3-commons-nodex';
import { IReferences } from 'pip-services3-commons-nodex';
import { RestClient } from 'pip-services3-rpc-nodex';
import { DataDogMetric } from './DataDogMetric';
export declare class DataDogMetricsClient extends RestClient {
    private _defaultConfig;
    private _credentialResolver;
    constructor(config?: ConfigParams);
    configure(config: ConfigParams): void;
    setReferences(refs: IReferences): void;
    open(correlationId: any): Promise<void>;
    private convertTags;
    private convertPoints;
    private convertMetric;
    private convertMetrics;
    sendMetrics(correlationId: string, metrics: DataDogMetric[]): Promise<void>;
}
