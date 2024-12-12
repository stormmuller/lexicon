import { ChainCompleteMessageHandler } from "./handlers/index.ts";
import { MessageHandler } from "./message-handler.ts";

export class WebViewMessageDispatcher {
  private _messageHandlers: Map<string, MessageHandler<any>>;

  constructor() {
    this._messageHandlers = new Map();
  }

  public registerHandler<T>(
    handler: MessageHandler<T>
  ) {
    this._messageHandlers.set(handler.type, handler);
    return this;
  }

  public async dispatchMessage<T>(type: string, message: T) {
    const handler = this._messageHandlers.get(type);

    if (!handler) {
      throw new Error(`No handler found for message type: ${type}`);
    }

    await handler.handle(message);
  }
} 

export const webViewMessageDispatcher =
  new WebViewMessageDispatcher().registerHandler(
    new ChainCompleteMessageHandler()
  );
