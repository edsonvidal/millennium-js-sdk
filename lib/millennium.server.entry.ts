import { processRequest } from './millennium.server';

declare var hostCallback: any;

export async function main(input: string): Promise<string> {
    return (await processRequest(input, hostCallback) || "");
}