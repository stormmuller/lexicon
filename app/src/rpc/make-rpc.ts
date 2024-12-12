import { v4 as generateUuid } from 'uuid';

const pendingRequests = new Map<string, any>();

export async function makeRpc<TRes>(type: string, data: any): Promise<TRes> {
  const messageId = generateUuid();

  return new Promise<TRes>((resolve, reject) => {
    pendingRequests.set(messageId, resolve);

    // Send the message to the parent
    try {
      window.parent.postMessage({
        type,
        messageId,
        data
      }, '*');
    } catch (error) {
      pendingRequests.delete(messageId);
      reject(error);
    }
  });
}

window.addEventListener('message', (event) => {
  if (event.data.type !== 'devvit-message') {
    return;
  }

  const { data, type } = event.data.data.message;

  console.log({ data, type });

  if (type === 'rpc-response') {
    const { messageId, response } = data;
    const request = pendingRequests.get(messageId);

    if (request) {
      request(response);
      pendingRequests.delete(messageId);
    }
  }
});
