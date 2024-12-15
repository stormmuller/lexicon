import "./createPost.js";
import { getOrCreateBoard } from "../server/get-board.js";

import {
  Devvit,
  useState,
  RedisClient,
  useAsync,
  useChannel,
} from "@devvit/public-api";
import { cacheWords } from "../server/cache-words.ts";
import { createWebViewMessageDispatcher } from "./rpc/rpc-dispatcher.ts";
import { Rpc } from "./rpc/rpc-handler.ts";
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

    const [snoovatar] = useState(async () => {
      const currUser = await context.reddit.getCurrentUser();
      return (await currUser?.getSnoovatarUrl()) ?? "anon";
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

    // When the button is clicked, send initial data to web view and show it
    const onShowWebviewClick = async (redis: RedisClient, postId: string) => {
      setWebviewVisible(true);

      const board = await getOrCreateBoard(
        redis,
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
    };

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
        <vstack
          grow={!webviewVisible}
          height={webviewVisible ? "0%" : "100%"}
          alignment="center middle"
        >
          <image
            url="images/lexicon-logo.png"
            imageWidth={200}
            imageHeight={200}
            description="Lexicon Logo"
          />
          <vstack alignment="center bottom">
            <image
              url={snoovatar}
              imageWidth={100}
              imageHeight={100}
              description="snoovatar"
            />{" "}
            <text size="medium" weight="bold">
              {username ?? ""}
            </text>
            <text size="medium">Current score: {counter ?? ""}</text>
            <spacer />
            <button
              onPress={() =>
                onShowWebviewClick(context.redis, context.postId ?? "anon")
              }
              appearance="success"
              icon="topic-videogaming-fill"
              size="large"
              minWidth="300px"
            >
              Play!
            </button>
          </vstack>
        </vstack>
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
