"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processRequest = exports.hostCall = void 0;
const millennium_server_core_1 = require("./millennium.server.core");
let _hostOutput;
async function hostCall(command, headers, args) {
    if (_hostOutput) {
        return checkError(getResponse(await _hostOutput(command + (!!headers ? ("-" + JSON.stringify(headers)) : "") + ":" + (!!args ? JSON.stringify(args) : ""))));
    }
}
exports.hostCall = hostCall;
;
const invocationPrefix = 'invoke:';
async function processRequest(message, hostOutput) {
    if (message && message.substring(0, invocationPrefix.length) === invocationPrefix) {
        _hostOutput = hostOutput;
        try {
            const invocation = JSON.parse(message.substring(invocationPrefix.length));
            const invokedModule = await Promise.resolve().then(() => __importStar(require(invocation.moduleName)));
            const func = (invocation.exportedFunctionName ? invokedModule[invocation.exportedFunctionName] : invokedModule);
            const output = new millennium_server_core_1.Output(hostCall);
            const dataPool = new millennium_server_core_1.DataPool(hostCall);
            const input = { params: {} };
            const result = [];
            for (const params of invocation.args || [{}]) {
                input.params = params;
                const response = await func.apply(null, [input, output, dataPool]);
                if (response)
                    result.push(response);
            }
            await output.end();
            return "response:" + ((result && result.length && JSON.stringify(result)) || "");
        }
        catch (error) {
            return ("error:" + ((error.message) ? JSON.stringify({ message: error.message }) : JSON.stringify(error)));
        }
    }
}
exports.processRequest = processRequest;
function getResponse(message) {
    if (!message)
        return;
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
                command = message.slice(0, x);
            else if (message.charAt(x) === ':') {
                if (!command)
                    command = message.slice(0, x - 1);
                body = JSON.parse(message.slice(x + 1));
                break;
            }
        }
    }
    if (!command)
        command = message;
    return { headers, command, body };
}
async function checkError(promiseOrResult) {
    var _a, _b;
    if (promiseOrResult)
        if (promiseOrResult instanceof Promise) {
            const result = getResponse(await promiseOrResult);
            if ((result === null || result === void 0 ? void 0 : result.command) === "error")
                throw Error((_a = result.body.message) !== null && _a !== void 0 ? _a : "Error");
            else
                return result;
        }
        else {
            if (promiseOrResult.command === "error")
                new Error((_b = promiseOrResult.body.message) !== null && _b !== void 0 ? _b : "Error");
            else
                return promiseOrResult.body;
        }
}
//# sourceMappingURL=millennium.server.js.map