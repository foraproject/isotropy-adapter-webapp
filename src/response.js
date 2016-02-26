/* @flow */
import { EventEmitter } from "events";
import type { IncomingMessage, ServerResponse, Server } from "./flow/http";

export type ResponseCtorArgsType = {
  res: ServerResponse,
  toHtml?: (html: string, props: Object) => string,
  args: Object
}

class Response extends EventEmitter {
  res: ServerResponse;
  finished: boolean;
  body: string;
  _toHtml: ?((html: string, props: Object) => string);
  _args: Object;

  constructor(params: ResponseCtorArgsType) {
    super();
    this.res = params.res;
    this._toHtml = params.toHtml;
    this._args = params.args;
    this.finished = false;
    this.body = "";
  }

  get statusCode() : number {
    return this.res.statusCode;
  }

  set statusCode(code: number) : void {
    this.res.statusCode = code;
  }

  removeHeader(name: string) {
    this.res.removeHeader(name);
  }

  getHeader(field: string) : string {
    return this.res.getHeader(field);
  }

  setHeader(field: string, val: string) {
    this.res.setHeader(field, val);
  }

  setTimeout(cb: Function, msecs: number) : void {
    this.res.setTimeout(cb, msecs);
  }

  write(data: string) {
    //If toHtml() is provided, we need to buffer and render at the end
    if (this._toHtml) {
      this.body += data;
    } else {
      this.res.write(data);
    }
  }

  writeHead(code: number, headers: Object) {
    this.res.writeHead(code, headers);
  }

  end(body: string, encoding?: string, cb?: Function) {
    if (this._toHtml) {
      this.body += body;
      const html = this._toHtml(this.body, this._args);
      this.res.end(html, encoding, cb);
      this.emit("end", html);
    } else {
      this.res.end(body, encoding, cb);
      this.emit("end", body);
    }
    this.finished = true;
  }
}

export default Response;
