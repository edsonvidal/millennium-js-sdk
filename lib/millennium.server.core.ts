

const queryPrefix = 'query';
const fetchPrefix = "fetch";

export type DynamicStruct = {
  name: string;
  format: string;
  size: number;
  decimals?: number;
  fieldStruct?: DynamicStruct[];
}

export type HostBridge = (command: string, headers: { [index: string]: any } | undefined, args?: Object) => Promise<any>;

export class HostedObject {
  constructor(protected hostCall: HostBridge) {

  }
}

export class WritableDataSet<T = Object> extends HostedObject {
  private _bufferArray: any[] = [];
  private _hasFinished = false;
  async flush() {
    if (this._bufferArray.length)
      this.hostCall("output", { requestId: this._requestId?.toString() }, this._bufferArray);
    this._bufferArray = [];
  }
  async push(value: T | T[]) {
    if (this._hasFinished) throw Error("Dataset has already being ended");

    if (value instanceof Array)
      this._bufferArray = this._bufferArray.concat(value);
    else
      this._bufferArray.push(value);
    if (this._bufferArray.length > 250)
      await this.flush();
  }
  async end() {
    if (this._hasFinished) return;

    await this.flush();
    await this.hostCall("output_confirm", { requestId: this._requestId?.toString() });
    this._hasFinished = true;
  }
  constructor(hostBridge: HostBridge, protected _requestId?: number) {
    super(hostBridge);
  }
}

export class Output<T = any> extends WritableDataSet<T>{
  constructor(hostBridge: HostBridge) {
    super(hostBridge)
  }
}

function isPromise(value: any): value is Promise<any> {
  return value && !!value.then;
}

let requestIdCnt = 0;
const createDataPrefix = "create_data";
export class DataSet<T> extends WritableDataSet<T>{
  private _rows: T[] = [];
  private _eof = false;
  private _dynamic = false;
  async _cmd(name: string, body: any = {}) {
    return await this.hostCall(name, { requestId: this._requestId?.toString() }, body);
  }

  private async _fetch() {
    return this._cmd(fetchPrefix, { requestId: this._requestId });
  }

  async each(callback: (row: T) => void | Promise<any>) {
    await this.flush();

    if (this._dynamic) {
      let response = await this._cmd("fetch_first");
      this._rows = response.rows;
      this._eof = response.eof;
    }

    do {
      for (let current of this._rows) {
        const result = callback(current);
        if (isPromise(result)) await result;
      }

      //if we have more data, let´s fetch it
      if (!this._eof) {
        let response = await this._fetch();
        this._rows = response.rows;
        this._eof = response.eof;
      } else
        break;

    } while (this._rows.length)
  }

  async open(command: DynamicStruct[]): Promise<void>
  async open(command: string, params?: Object): Promise<void>
  async open(command: string | DynamicStruct[], params?: { [index: string]: any }): Promise<void> {
    this._dynamic = false;
    if (typeof command === "string") {
      for (let k in params) {
        if (typeof params[k] === "object" && params[k] !== null && params[k] !== undefined) {
          if (params[k] instanceof DataSet) {
            await params[k].end();
            params[k] = { requestId: params[k]._requestId }
          }
          else
            throw Error("Invalid parameter")
        }
      }

      let message = await this._cmd(queryPrefix, { command, params: params || {} });

      this._rows = message.rows;
      this._eof = message.eof;
    } else {
      this._dynamic = true;
      await this._cmd(createDataPrefix, command);
    }
  }

  constructor(hostBridge: HostBridge) {
    super(hostBridge, requestIdCnt++);
  }
}

export type Input = { params: { [index: string]: any } };

export class DataPool extends HostedObject {
  async execute<T>(command: string, params?: any): Promise<DataSet<T>> {
    let ds = new DataSet<T>(this.hostCall);
    await ds.open(command, params);
    return ds;
  }
  async create<T>(struct: DynamicStruct[]) {
    let ds = new DataSet<T>(this.hostCall);
    await ds.open(struct);
    return ds;
  }
}
