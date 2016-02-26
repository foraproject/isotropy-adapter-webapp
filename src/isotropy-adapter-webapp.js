/* @flow */
import type { IncomingMessage, ServerResponse } from "./flow/http";;
import Response from "./response";

export type RenderArgsType = {
  req: IncomingMessage,
  res: ServerResponse,
  args: Object,
  handler: (req: IncomingMessage, res: ServerResponse, args: Object) => void,
  toHtml?: (html: string, props: Object) => string
}

const render = function(params: RenderArgsType) : void {
  const { req, res, args, handler, toHtml } = params;
  const dummyResponse = new Response({ res, args, toHtml });
  handler(req, dummyResponse, args);
};

export default {
  render
};
