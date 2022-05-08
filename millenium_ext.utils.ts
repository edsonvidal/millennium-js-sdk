import { DataPool, Input, Output } from "./lib/millennium.server.core";

export async function ToBase64(input: Input, output: Output, data: DataPool) {


  console.log(input.params["DATA"]);
  const ToBaseData = input.params["DATA"];
  let buff = new Buffer(ToBaseData);
  let base64data = buff.toString('base64');
  console.log('"' + ToBaseData + '" converted to Base64 is "' + base64data + '"');
  output.push(base64data);

}

export async function FromBase64(input: Input, output: Output, data: DataPool) {

  console.log(input.params["DATA"]);
  const ToBaseData = input.params["DATA"];
  let buff = new Buffer(ToBaseData, 'base64');
  let text = buff.toString('ascii');
  console.log('"' + data + '" converted from Base64 to ASCII is "' + text + '"');
  output.push(text);

}

