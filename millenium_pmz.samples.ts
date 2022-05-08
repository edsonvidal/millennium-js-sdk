import { DataPool, Input, Output } from "./lib/millennium.server.core";
import * as https from "https";

class Utils {

  async consultaCep(cep: string): Promise<string> {
    let dataResponse = '';
    
    
    return new Promise<string>(async (resolve) => { 
      
      await https.get('https://viacep.com.br/ws/'+cep+'/json/unicode/', async  (res) => {
    
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
              resolve(dataResponse)  
              let resultData = JSON.parse(dataResponse);
          
              //output.push([endereco]);
          
              console.log("FIM 4");
            
            });
        });     
    });
  }
}


export async function ConsultaCepServiceDB(input: Input, output: Output, data: DataPool) {


  console.log(input.params["CEP"]);
  
  const resultData = await data.execute<{ logradouro: string }>("SELECT FIRST 1 CEP, LOGRADOURO FROM ENDERECOS_CADASTRO EC WHERE CEP = :CEP GROUP BY CEP, LOGRADOURO", { cep: input.params["CEP"] });


await resultData.each((row) => {
    console.log(row);
    output.push(row);
});

}

export async function ConsultaCepService(input: Input, output: Output, data: DataPool) {
  console.log("Consultando viaCEP");

  var utils = new Utils();

  var response = await utils.consultaCep(input.params["CEP"]);

  var cep = JSON.parse(response);

  console.log(cep.logradouro);
  
  console.log(cep);

  //endereco.push({cep:resultData.cep});
  
  output.push(cep);

}
