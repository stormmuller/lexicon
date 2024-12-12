import { RedisClient } from "@devvit/public-api";
import { WebViewUIClient } from "@devvit/public-api/types/web-view-ui-client.js";
import { ChainCompleteMessageHandler } from "./handlers/index.ts";
import { Message, MessageHandler } from "./message-handler.ts";

export class WebViewMessageDispatcher {
  private _messageHandlers: Map<string, MessageHandler<any, any>>;
  private _webView: WebViewUIClient;

  constructor(webView: WebViewUIClient) {
    this._messageHandlers = new Map();
    this._webView = webView;
  }

  public registerHandler<TMessage extends Message<any>, TRes>(
    handler: MessageHandler<TMessage, TRes>
  ) {
    this._messageHandlers.set(handler.type, handler);
    return this;
  }

  public async dispatchMessage<TMessage extends Message<any>>(message: TMessage) {
    const handler = this._messageHandlers.get(message.type);

    if (!handler) {
      throw new Error(`No handler found for message type: ${message.type}`);
    }

    const response = await handler.handle(message);

    this._webView.postMessage('myWebView', {
      type: 'rpc-response',
      data: { messageId: message.messageId, response },
    });
  }
}

export function createWebViewMessageDispatcher(redis: RedisClient, webview: WebViewUIClient) {
  return new WebViewMessageDispatcher(webview).registerHandler(
    new ChainCompleteMessageHandler(redis)
  );
}
