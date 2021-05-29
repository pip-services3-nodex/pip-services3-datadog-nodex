/** @module clients */
import { DataDogMetricPoint } from './DataDogMetricPoint';
export declare class DataDogMetric {
    metric: string;
    service?: string;
    host?: string;
    tags?: any;
    type: string;
    interval?: number;
    points: DataDogMetricPoint[];
}
