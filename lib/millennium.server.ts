
import { Output, Input, DataPool } from "./millennium.server.core"


type HostOutput = (command: string) => Promise<string>;

let _hostOutput: HostOutput | undefined;
export async function hostCall(command: string, headers?: { [index: string]: any }, args?: Object) {
    if (_hostOutput) {
        return checkError(getResponse(await _hostOutput(command + (!!headers ? ("-" + JSON.stringify(headers)) : "") + ":" + (!!args ? JSON.stringify(args) : ""))));
    }
};

const invocationPrefix = 'invoke:';
export async function processRequest(message: string, hostOutput: HostOutput) {
    if (message && message.substring(0, invocationPrefix.length) === invocationPrefix) {
        _hostOutput = hostOutput;
        try {
            const invocation = JSON.parse(message.substring(invocationPrefix.length));
            const invokedModule = await import(invocation.moduleName);
            const func = (invocation.exportedFunctionName ? invokedModule[invocation.exportedFunctionName] : invokedModule) as (input: Input, output: Output, dataPool: DataPool) => Promise<any>;
            const output = new Output(hostCall);
            const dataPool = new DataPool(hostCall);
            const input = { params: {} };
            const result = [];
            for (const params of invocation.args || [{}]) {
                input.params = params;
                const response = await func.apply(null, [input, output, dataPool]);
                if (response) result.push(response);
            }
            await output.end();

            return "response:" + ((result && result.length && JSON.stringify(result)) || "");
        } catch (error) {
            return ("error:" + ((error.message) ? JSON.stringify({ message: error.message }) : JSON.stringify(error)))
        }
    }
}

type Response = { headers?: { [index: string]: any }, command: string, body: any }

function getResponse(message?: string): Response | undefined {
    if (!message) return;

    let headers = {};
    let body = "";
    let command = "";

    let inBracket = 0;
    let headerPos = -1;
    for (let x = 0; x < message.length - 1; x++) {

        if (message.charAt(x) === '{') {
            inBracket++;
            headerPos = x;
        }
        else if (message.charAt(x) === '}') {
            inBracket--;
            headers = JSON.parse(message.slice(headerPos, x + 1));
        }

        if (inBracket === 0) {
            if (message.charAt(x) === '-')
                command = message.slice(0, x)
            else if (message.charAt(x) === ':') {
                if (!command) command = message.slice(0, x - 1)
                body = JSON.parse(message.slice(x + 1));
                break;
            }
        }
    }
    if (!command) command = message;
    return { headers, command, body };
}

async function checkError(promise: Promise<string> | undefined): Promise<any>
async function checkError(promise: Response | undefined): Promise<any>
async function checkError(promiseOrResult: Promise<string> | Response | undefined): Promise<any> {
    if (promiseOrResult)
        if (promiseOrResult instanceof Promise) {
            const result = getResponse(await promiseOrResult);
            if (result?.command === "error")
                throw Error(result.body.message ?? "Error")
            else
                return result;
        } else {
            if (promiseOrResult.command === "error")
                new Error(promiseOrResult.body.message ?? "Error")
            else
                return promiseOrResult.body
        }
}
