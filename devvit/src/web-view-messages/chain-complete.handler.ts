import { MessageHandler } from "./message-handler.js";

export type ChainCompleteMessage = { word: string };
export const chainCompleteMessageType = "chain-complete";

export class ChainCompleteMessageHandler extends MessageHandler<ChainCompleteMessage> {
  constructor() {
    super(chainCompleteMessageType);
  }

  public override async handle(message: ChainCompleteMessage): Promise<void> {
    // check if word in words db
    //  true:
    //    check if in defintions db:
    //      true:
    //        return success result + definitions
    //      false:
    //        look up word via definition api
    //        save in defintion db
    //        return success result + definitions
    //  false:
    //    return failure
    console.log(message);
  }
}
