import { DataPool, Input, Output } from "./lib/millennium.server.core";

export async function Validar_Local_Estoque(input: Input, output: Output, data: DataPool) {
 
  /*
    Objetivo: Validar o local de estoque e ID de filial, se já existe no sistema
    Caso não encontre, devolver uma mensagem ao usuário com o local e filial informado não existe
  */
  
  console.log("Entrou na function Validar_Local_Estoque");

  let nFilial:number = input.params["FILIAL"];
  let sLocal:string = input.params["LOCAL"];

  let resultLocal = await data.execute<{ idlocal: number, filial: number }>
    ("select idlocal, filial from locais_estoque where filial = :filial and local = :local ;", { filial: nFilial, local: sLocal });

  console.log("Executou a query para variável: result");

  let nContadorLocal:number = 0;
  
  await resultLocal.each(row => {
    output.push(row);
    nContadorLocal++;
  })

  if (nContadorLocal===0) {
    const message = `Validação PMZ - Local de estoque ${sLocal} não foi encontrado !`;
    throw new Error(message); 
  }

  console.log(`O valor da variavel nContadorLocal é: ${nContadorLocal}`);

  output.push(resultLocal);

}


export async function Validar_Barra_ID(input: Input, output: Output, data: DataPool) {

  /*
    Objetivo: Validar o código de barras e barra existem no sistema
    Caso não encontre, devolver uma mensagem ao usuário, informando que a barra não existe
  */
  
 console.log("Entrou na function Validar_Barra_ID");

 let sBarra:string = input.params["BARRA"];
 let nTipoBarra:number = input.params["TIPO_BARRA"];

 let resultBarra = await data.execute<{ tipo_barra: number, barra: string, produto:number, cor: number, estampa:number, tamanho:string }>
   ("select tipo_barra, barra, produto, cor, estampa, tamanho from codigo_barras where tipo_barra = :tipo_barra and barra = :barra;", { barra: sBarra, tipo_barra: nTipoBarra });

 console.log("Executou a query para variável: resultBarra");

 let nContadorBarra:number = 0;
 
 await resultBarra.each(row => {
   output.push(row);
   nContadorBarra++;
 })

 if (nContadorBarra===0) {
   const message = `Validação PMZ - Código de barras:  ${sBarra} não foi encontrado !`;
   throw new Error(message); 
 }

 console.log(`O valor da variavel nContadorBarra é: ${nContadorBarra}`);

 output.push(resultBarra);

}
