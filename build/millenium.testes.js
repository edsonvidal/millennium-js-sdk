"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.atualizacao = void 0;
async function atualizacao(input, output, data) {
    const acoes = await data.create([{ name: "nome", format: "A", size: 200 }]);
    const resultData = await data.execute("select first 10 produto,descricao1 as name from produtos");
    const resultData2 = await data.execute("select:main gerador,cliente as produto,nome as name,#rowset({select:contatos nome as item from geradores_contatos gc where gerador=:main.gerador}) from clientes where gerador=:gerador", { gerador: input.params["GERADOR"] });
    await resultData2.each((row) => {
        output.push(row);
    });
    await resultData.each((row) => {
        output.push(row);
    });
    await acoes.push([
        { nome: "ação1" },
        { nome: "ação2" }
    ]);
    //await acoes.each(row => {
    //  if (row.nome === "ação2")
    //    return { nome: "ação3" }
    //})
    //const resultData3 = await data.execute<{ produto: number, name: string }>("#each() acoes; insert into acoes(descricao) values(:acoes.nome) #return(acao)", { acoes });
}
exports.atualizacao = atualizacao;
//# sourceMappingURL=millenium.testes.js.map