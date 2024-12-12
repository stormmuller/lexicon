export abstract class MessageHandler<TMessage> {
  private _type: string;

  constructor(type: string) {
    this._type = type;
  }

  public get type() {
    return this._type;
  }

  public abstract handle(message: TMessage): Promise<void>;
}
