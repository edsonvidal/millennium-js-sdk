export declare type DynamicStruct = {
    name: string;
    format: string;
    size: number;
    decimals?: number;
    fieldStruct?: DynamicStruct[];
};
export declare type HostBridge = (command: string, headers: {
    [index: string]: any;
} | undefined, args?: Object) => Promise<any>;
export declare class HostedObject {
    protected hostCall: HostBridge;
    constructor(hostCall: HostBridge);
}
export declare class WritableDataSet<T = Object> extends HostedObject {
    protected _requestId?: number | undefined;
    private _bufferArray;
    private _hasFinished;
    flush(): Promise<void>;
    push(value: T | T[]): Promise<void>;
    end(): Promise<void>;
    constructor(hostBridge: HostBridge, _requestId?: number | undefined);
}
export declare class Output<T = any> extends WritableDataSet<T> {
    constructor(hostBridge: HostBridge);
}
export declare class DataSet<T> extends WritableDataSet<T> {
    private _rows;
    private _eof;
    private _dynamic;
    _cmd(name: string, body?: any): Promise<any>;
    private _fetch;
    each(callback: (row: T) => void | Promise<any>): Promise<void>;
    open(command: DynamicStruct[]): Promise<void>;
    open(command: string, params?: Object): Promise<void>;
    constructor(hostBridge: HostBridge);
}
export declare type Input = {
    params: {
        [index: string]: any;
    };
};
export declare class DataPool extends HostedObject {
    execute<T>(command: string, params?: any): Promise<DataSet<T>>;
    create<T>(struct: DynamicStruct[]): Promise<DataSet<T>>;
}
