declare type HostOutput = (command: string) => Promise<string>;
export declare function hostCall(command: string, headers?: {
    [index: string]: any;
}, args?: Object): Promise<any>;
export declare function processRequest(message: string, hostOutput: HostOutput): Promise<string | undefined>;
export {};
