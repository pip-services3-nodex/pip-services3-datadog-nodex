/** @module clients */

export class DataDogLogMessage {
    public time?: Date;
    public tags?: any;
    public status: string;
    public source?: string;
    public service: string;
    public host: string;
    public message: string;
    public logger_name?: string;
    public thread_name?: string;
    public error_message?: string;
    public error_kind?: string;
    public error_stack?: string;
}