"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validar_Barra_ID = exports.Validar_Local_Estoque = void 0;
async function Validar_Local_Estoque(input, output, data) {
    /*
      Objetivo: Validar o local de estoque e ID de filial, se já existe no sistema
      Caso não encontre, devolver uma mensagem ao usuário com o local e filial informado não existe
    */
    console.log("Entrou na function Validar_Local_Estoque");
    let nFilial = input.params["FILIAL"];
    let sLocal = input.params["LOCAL"];
    let resultLocal = await data.execute("select idlocal, filial from locais_estoque where filial = :filial and local = :local ;", { filial: nFilial, local: sLocal });
    console.log("Executou a query para variável: result");
    let nContadorLocal = 0;
    await resultLocal.each(row => {
        output.push(row);
        nContadorLocal++;
    });
    if (nContadorLocal === 0) {
        const message = `Validação PMZ - Local de estoque ${sLocal} não foi encontrado !`;
        throw new Error(message);
    }
    console.log(`O valor da variavel nContadorLocal é: ${nContadorLocal}`);
    output.push(resultLocal);
}
exports.Validar_Local_Estoque = Validar_Local_Estoque;
async function Validar_Barra_ID(input, output, data) {
    /*
      Objetivo: Validar o código de barras e barra existem no sistema
      Caso não encontre, devolver uma mensagem ao usuário, informando que a barra não existe
    */
    console.log("Entrou na function Validar_Barra_ID");
    let sBarra = input.params["BARRA"];
    let nTipoBarra = input.params["TIPO_BARRA"];
    let resultBarra = await data.execute("select tipo_barra, barra, produto, cor, estampa, tamanho from codigo_barras where tipo_barra = :tipo_barra and barra = :barra;", { barra: sBarra, tipo_barra: nTipoBarra });
    console.log("Executou a query para variável: resultBarra");
    let nContadorBarra = 0;
    await resultBarra.each(row => {
        output.push(row);
        nContadorBarra++;
    });
    if (nContadorBarra === 0) {
        const message = `Validação PMZ - Código de barras:  ${sBarra} não foi encontrado !`;
        throw new Error(message);
    }
    console.log(`O valor da variavel nContadorBarra é: ${nContadorBarra}`);
    output.push(resultBarra);
}
exports.Validar_Barra_ID = Validar_Barra_ID;
//# sourceMappingURL=millenium_ext.pmz.js.map