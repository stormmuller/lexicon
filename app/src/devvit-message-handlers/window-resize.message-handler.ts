export type WindowResizeMessage = {
  width: number;
  height: number;
};

export function windowResizeMessageHandler(message: WindowResizeMessage) {
  console.log(message)
}
