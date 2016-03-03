/* @flow */
import type { IncomingMessage, ServerResponse } from "isotropy-interfaces/node/http";
import Response from "./response";

export type RenderArgsType = {
  req: IncomingMessage,
  res: ServerResponse,
  args: Object,
  handler: (req: IncomingMessage, res: ServerResponse, args: Object) => Promise,
  toHtml?: (html: string, props: Object) => string
}

const render = async function(params: RenderArgsType) : Promise {
  const { req, res, args, handler, toHtml } = params;
  const dummyResponse = new Response({ res, args, toHtml });
  return handler(req, dummyResponse, args);
};

export default {
  render
};
