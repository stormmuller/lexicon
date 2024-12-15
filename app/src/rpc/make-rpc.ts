import { v4 as generateUuid } from 'uuid';

const pendingRequests = new Map<string, any>();

type RpcCallback<TRes> = (response: TRes) => Promise<void> | void;

export async function makeRpc<TReq, TRes>(type: string, data: TReq, responseHandler: RpcCallback<TRes>) {
  const messageId = generateUuid();

  pendingRequests.set(messageId, responseHandler);

  try {
    window.parent.postMessage({
      type,
      messageId,
      data
    }, '*');
  } catch (error) {
    pendingRequests.delete(messageId);
  }
}

window.addEventListener('message', async (event) => {
  if (event.data.type !== 'devvit-message') {
    return;
  }

  const { data, type } = event.data.data.message;

  if (type === 'rpc-response') {
    const { messageId, response } = data;
    const responseHandler = pendingRequests.get(messageId);

    if (responseHandler) {
      await responseHandler(response);
      pendingRequests.delete(messageId);
    }
  }
});
