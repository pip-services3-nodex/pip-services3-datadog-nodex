/** @module clients */

import { DataDogMetricPoint } from './DataDogMetricPoint';

export class DataDogMetric {
    public metric: string;
    public service?: string;
    public host?: string;
    public tags?: any;
    public type: string;
    public interval?: number;
    public points: DataDogMetricPoint[];
}