export interface Message<TData> {
  type: string,
  messageId: string,
  postId: string,
  userId: string,
  data: TData
}


export abstract class MessageHandler<TMessage extends Message<any>, TRes> {
  private _type: string;

  constructor(type: string) {
    this._type = type;
  }

  public get type() {
    return this._type;
  }

  public abstract handle(message: TMessage): Promise<TRes>;
}
