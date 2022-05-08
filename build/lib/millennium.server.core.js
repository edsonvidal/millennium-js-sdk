"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataPool = exports.DataSet = exports.Output = exports.WritableDataSet = exports.HostedObject = void 0;
const queryPrefix = 'query';
const fetchPrefix = "fetch";
class HostedObject {
    constructor(hostCall) {
        this.hostCall = hostCall;
    }
}
exports.HostedObject = HostedObject;
class WritableDataSet extends HostedObject {
    constructor(hostBridge, _requestId) {
        super(hostBridge);
        this._requestId = _requestId;
        this._bufferArray = [];
        this._hasFinished = false;
    }
    async flush() {
        var _a;
        if (this._bufferArray.length)
            this.hostCall("output", { requestId: (_a = this._requestId) === null || _a === void 0 ? void 0 : _a.toString() }, this._bufferArray);
        this._bufferArray = [];
    }
    async push(value) {
        if (this._hasFinished)
            throw Error("Dataset has already being ended");
        if (value instanceof Array)
            this._bufferArray = this._bufferArray.concat(value);
        else
            this._bufferArray.push(value);
        if (this._bufferArray.length > 250)
            await this.flush();
    }
    async end() {
        var _a;
        if (this._hasFinished)
            return;
        await this.flush();
        await this.hostCall("output_confirm", { requestId: (_a = this._requestId) === null || _a === void 0 ? void 0 : _a.toString() });
        this._hasFinished = true;
    }
}
exports.WritableDataSet = WritableDataSet;
class Output extends WritableDataSet {
    constructor(hostBridge) {
        super(hostBridge);
    }
}
exports.Output = Output;
function isPromise(value) {
    return value && !!value.then;
}
let requestIdCnt = 0;
const createDataPrefix = "create_data";
class DataSet extends WritableDataSet {
    constructor(hostBridge) {
        super(hostBridge, requestIdCnt++);
        this._rows = [];
        this._eof = false;
        this._dynamic = false;
    }
    async _cmd(name, body = {}) {
        var _a;
        return await this.hostCall(name, { requestId: (_a = this._requestId) === null || _a === void 0 ? void 0 : _a.toString() }, body);
    }
    async _fetch() {
        return this._cmd(fetchPrefix, { requestId: this._requestId });
    }
    async each(callback) {
        await this.flush();
        if (this._dynamic) {
            let response = await this._cmd("fetch_first");
            this._rows = response.rows;
            this._eof = response.eof;
        }
        do {
            for (let current of this._rows) {
                const result = callback(current);
                if (isPromise(result))
                    await result;
            }
            //if we have more data, let´s fetch it
            if (!this._eof) {
                let response = await this._fetch();
                this._rows = response.rows;
                this._eof = response.eof;
            }
            else
                break;
        } while (this._rows.length);
    }
    async open(command, params) {
        this._dynamic = false;
        if (typeof command === "string") {
            for (let k in params) {
                if (typeof params[k] === "object" && params[k] !== null && params[k] !== undefined) {
                    if (params[k] instanceof DataSet) {
                        await params[k].end();
                        params[k] = { requestId: params[k]._requestId };
                    }
                    else
                        throw Error("Invalid parameter");
                }
            }
            let message = await this._cmd(queryPrefix, { command, params: params || {} });
            this._rows = message.rows;
            this._eof = message.eof;
        }
        else {
            this._dynamic = true;
            await this._cmd(createDataPrefix, command);
        }
    }
}
exports.DataSet = DataSet;
class DataPool extends HostedObject {
    async execute(command, params) {
        let ds = new DataSet(this.hostCall);
        await ds.open(command, params);
        return ds;
    }
    async create(struct) {
        let ds = new DataSet(this.hostCall);
        await ds.open(struct);
        return ds;
    }
}
exports.DataPool = DataPool;
//# sourceMappingURL=millennium.server.core.js.map