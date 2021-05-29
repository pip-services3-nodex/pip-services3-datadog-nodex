/** @module clients */
export declare class DataDogLogMessage {
    time?: Date;
    tags?: any;
    status: string;
    source?: string;
    service: string;
    host: string;
    message: string;
    logger_name?: string;
    thread_name?: string;
    error_message?: string;
    error_kind?: string;
    error_stack?: string;
}
