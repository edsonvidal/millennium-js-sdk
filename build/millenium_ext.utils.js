"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FromBase64 = exports.ToBase64 = void 0;
async function ToBase64(input, output, data) {
    console.log(input.params["DATA"]);
    const ToBaseData = input.params["DATA"];
    let buff = new Buffer(ToBaseData);
    let base64data = buff.toString('base64');
    console.log('"' + ToBaseData + '" converted to Base64 is "' + base64data + '"');
    output.push(base64data);
}
exports.ToBase64 = ToBase64;
async function FromBase64(input, output, data) {
    console.log(input.params["DATA"]);
    const ToBaseData = input.params["DATA"];
    let buff = new Buffer(ToBaseData, 'base64');
    let text = buff.toString('ascii');
    console.log('"' + data + '" converted from Base64 to ASCII is "' + text + '"');
    output.push(text);
}
exports.FromBase64 = FromBase64;
//# sourceMappingURL=millenium_ext.utils.js.map