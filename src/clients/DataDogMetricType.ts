/** @module clients */

export class DataDogMetricType {
    public static readonly Gauge: string = "gauge";
    public static readonly Count: string = "count";
    public static readonly Rate: string = "rate";
    public static readonly Set: string = "set";
    public static readonly Histogram: string = "histogram";
    public static readonly Distribution: string = "distribution";
}