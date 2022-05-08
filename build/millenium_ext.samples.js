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
exports.ConsultaCepService = exports.ConsultaCepServiceDB = void 0;
const https = __importStar(require("https"));
class Utils {
    async consultaCep(cep) {
        let dataResponse = '';
        return new Promise(async (resolve) => {
            await https.get('https://viacep.com.br/ws/' + cep + '/json/unicode/', async (res) => {
                if (res.statusCode !== 200) {
                    console.error(`Did not get an OK from the server. Code: ${res.statusCode}`);
                    res.resume();
                    return;
                }
                res.on('data', (chunk) => {
                    dataResponse += chunk;
                    console.log("DATA");
                });
                res.on('end', () => {
                    console.log(JSON.parse(dataResponse));
                    resolve(dataResponse);
                    let resultData = JSON.parse(dataResponse);
                    //output.push([endereco]);
                    console.log("FIM 4");
                });
            });
        });
    }
}
async function ConsultaCepServiceDB(input, output, data) {
    console.log(input.params["CEP"]);
    const resultData = await data.execute("SELECT FIRST 1 CEP, LOGRADOURO FROM ENDERECOS_CADASTRO EC WHERE CEP = :CEP GROUP BY CEP, LOGRADOURO", { cep: input.params["CEP"] });
    await resultData.each((row) => {
        console.log(row);
        output.push(row);
    });
}
exports.ConsultaCepServiceDB = ConsultaCepServiceDB;
async function ConsultaCepService(input, output, data) {
    console.log("Consultando viaCEP");
    var utils = new Utils();
    var response = await utils.consultaCep(input.params["CEP"]);
    var cep = JSON.parse(response);
    console.log(cep.logradouro);
    console.log(cep);
    //endereco.push({cep:resultData.cep});
    output.push(cep);
}
exports.ConsultaCepService = ConsultaCepService;
//# sourceMappingURL=millenium_ext.samples.js.map