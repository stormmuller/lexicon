export interface Rpc<TData> {
  type: string,
  messageId: string,
  postId: string,
  userId: string,
  username: string;
  data: TData
}


export abstract class RpcHandler<TMessage extends Rpc<any>, TRes> {
  private _type: string;

  constructor(type: string) {
    this._type = type;
  }

  public get type() {
    return this._type;
  }

  public abstract handle(message: TMessage): Promise<TRes>;
}
