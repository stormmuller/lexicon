import "./createPost.js";
import { getOrCreateBoard } from "./server/get-board.ts";

import {
  Devvit,
  useState,
  RedisClient,
  useAsync,
  useChannel,
} from "@devvit/public-api";
import { cacheWords } from "./server/cache-words.ts";
import { createWebViewMessageDispatcher } from "./server/rpc/rpc-dispatcher.ts";
import { Rpc } from "./server/rpc/rpc-handler.ts";
import { configuration } from "./configuration.ts";

Devvit.configure({
  redditAPI: true,
  redis: true,
  http: true,
});

// Add a custom post type to Devvit
Devvit.addCustomPostType({
  name: "Lexicon",
  height: "tall",
  render: (context) => {
    useAsync(async () => {
      await cacheWords(context.redis);

      return true;
    });

    const webViewMessageDispatcher = createWebViewMessageDispatcher(context);

    // Load username with `useAsync` hook
    const [username] = useState(async () => {
      const currUser = await context.reddit.getCurrentUser();
      return currUser?.username ?? "anon";
    });

    const [postId] = useState(async () => {
      return context.postId ?? "unknown";
    });

    // Load latest counter from redis with `useAsync` hook
    const [counter, setCounter] = useState(async () => {
      const redisCount = await context.redis.get(`counter_${context.postId}`);
      return Number(redisCount ?? 0);
    });

    // Create a reactive state for web view visibility
    const [webviewVisible, setWebviewVisible] = useState(false);

    // When the web view invokes `window.parent.postMessage` this function is called
    const onMessage = async (msg: Rpc<any>) => {
      // TODO: Validate that all messages are in a decent format (i.e. has a messageId, type and data payload)

      await webViewMessageDispatcher.dispatchMessage({
        ...msg,
        postId: context.postId ?? "unknown",
        userId: context.userId ?? "anon",
        username,
      });
    };

    useAsync(async () => {
      setWebviewVisible(true);

      const board = await getOrCreateBoard(
        context.redis,
        postId,
        configuration.boardDimentions
      );

      context.ui.webView.postMessage("myWebView", {
        type: "initial-data",
        data: {
          username: username,
          score: counter,
          board,
        },
      });

      return true;
    });

    context.ui.webView.postMessage("myWebView", {
      type: "window-resize",
      data: {
        width: context.dimensions?.width || 0,
        height: context.dimensions?.height || 0,
      },
    });

    // Render the custom post type
    return (
      <vstack grow>
        <vstack height={webviewVisible ? "100%" : "0%"} grow>
          <webview
            id="myWebView"
            url="dist/index.html"
            onMessage={(msg) => onMessage(msg as unknown as Rpc<any>)}
            grow
            height={webviewVisible ? "100%" : "0%"}
          />
        </vstack>
      </vstack>
    );
  },
});

export default Devvit;
