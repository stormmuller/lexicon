import { Devvit } from "@devvit/public-api";
import { WebViewUIClient } from "@devvit/public-api/types/web-view-ui-client.js";
import {
  ChainCompleteMessageHandler,
  GetLeaderboardMessageHandler,
} from "./rpc-handlers/index.ts";
import { Rpc, RpcHandler } from "./rpc-handler.ts";

export class RpcDispatcher {
  private _messageHandlers: Map<string, RpcHandler<any, any>>;
  private _webView: WebViewUIClient;

  constructor(webView: WebViewUIClient) {
    this._messageHandlers = new Map();
    this._webView = webView;
  }

  public registerHandler<TMessage extends Rpc<any>, TRes>(
    handler: RpcHandler<TMessage, TRes>
  ) {
    this._messageHandlers.set(handler.type, handler);
    return this;
  }

  public async dispatchMessage<TMessage extends Rpc<any>>(message: TMessage) {
    const handler = this._messageHandlers.get(message.type);

    if (!handler) {
      throw new Error(`No handler found for message type: ${message.type}`);
    }

    const response = await handler.handle(message);

    this._webView.postMessage("myWebView", {
      type: "rpc-response",
      data: { messageId: message.messageId, response },
    });
  }
}

export function createWebViewMessageDispatcher(context: Devvit.Context) {
  return new RpcDispatcher(context.ui.webView)
    .registerHandler(new ChainCompleteMessageHandler(context.redis))
    .registerHandler(new GetLeaderboardMessageHandler(context.redis));
}
