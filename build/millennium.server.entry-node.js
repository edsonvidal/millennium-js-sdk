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
const millennium_server_1 = require("./millennium.server");
const readline = __importStar(require("readline"));
process.on('uncaughtException', (err) => {
    console.error('There was an uncaught error', err);
    process.exit(1); //mandatory (as per the Node docs)
});
let _intf = readline.createInterface({ input: process.stdin });
function read() {
    return new Promise((resolve) => {
        _intf.once("line", resolve);
    });
}
function write(message) {
    process.stdout.write(message + "\n");
}
function command(message) {
    process.stdout.write(message + "\n");
    return read();
}
async function processRequests() {
    do {
        const request = await read();
        try {
            const result = await (0, millennium_server_1.processRequest)(request, command);
            write(result);
        }
        catch (e) {
        }
    } while (process.stdin.readable);
}
processRequests();
console.log('[millennium:Listening]');
//# sourceMappingURL=millennium.server.entry-node.js.map