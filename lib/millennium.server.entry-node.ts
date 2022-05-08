import { processRequest } from './millennium.server';
import * as readline from 'readline';

process.on('uncaughtException', (err: any) => {
    console.error('There was an uncaught error', err)
    process.exit(1) //mandatory (as per the Node docs)
})

let _intf = readline.createInterface({ input: process.stdin });

function read(): Promise<any> {
    return new Promise((resolve) => {
        _intf.once("line", resolve);
    })
}
function write(message: any) {
    process.stdout.write(message + "\n");
}
function command(message: any) {
    process.stdout.write(message + "\n");
    return read()
}

async function processRequests() {
    do {
        const request = await read();
        try {
            const result = await processRequest(request, command);
            write(result)
        } catch (e) {
        }
    } while (process.stdin.readable)
}

processRequests();

console.log('[millennium:Listening]');
