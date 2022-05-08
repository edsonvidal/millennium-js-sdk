"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const millennium_server_1 = require("./millennium.server");
async function main(input) {
    return (await (0, millennium_server_1.processRequest)(input, hostCallback) || "");
}
exports.main = main;
//# sourceMappingURL=millennium.server.entry.js.map