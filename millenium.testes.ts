import { DataPool, Input, Output } from "./lib/millennium.server.core";

export async function atualizacao(input: Input, output: Output, data: DataPool) {

  const acoes = await data.create<{ nome: string }>([{ name: "nome", format: "A", size: 200 }]);

  const resultData = await data.execute<{ produto: number, name: string }>("select first 10 produto,descricao1 as name from produtos");

  const resultData2 = await data.execute<{ produto: number, name: string }>("select:main gerador,cliente as produto,nome as name,#rowset({select:contatos nome as item from geradores_contatos gc where gerador=:main.gerador}) from clientes where gerador=:gerador", { gerador: input.params["GERADOR"] });

  await resultData2.each((row) => {
    output.push(row);
  })

  await resultData.each((row) => {
    output.push(row);
  })

  await acoes.push([
    { nome: "ação1" },
    { nome: "ação2" }
  ])

  //await acoes.each(row => {
  //  if (row.nome === "ação2")
  //    return { nome: "ação3" }
  //})

  //const resultData3 = await data.execute<{ produto: number, name: string }>("#each() acoes; insert into acoes(descricao) values(:acoes.nome) #return(acao)", { acoes });

}
