import "./createPost.js";
import { getBoard } from "../server/get-board.js";

import { Devvit, useState, RedisClient, useAsync } from "@devvit/public-api";
import { cacheWords } from "../server/cache-words.ts";
import { createWebViewMessageDispatcher } from "./web-view-messages/web-view-message-dispatcher.js";
import { WebViewMessage } from "./web-view-messages/web-view-message.type.js";
import { Message } from "./web-view-messages/message-handler.ts";

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
    const { data, loading, error } = useAsync(async () => {
      await cacheWords(context.redis);

      return true;
    });

    const webViewMessageDispatcher = createWebViewMessageDispatcher(
      context.redis,
      context.ui.webView
    );

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
    const onMessage = async (msg: Message<any>) => {
      await webViewMessageDispatcher.dispatchMessage(msg);
    };

    // When the button is clicked, send initial data to web view and show it
    const onShowWebviewClick = async (redis: RedisClient, postId: string) => {
      setWebviewVisible(true);

      const board = await getBoard(redis, postId, { x: 7, y: 8 });

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
          alignment="top center"
        >
          <image
            url="images/Logo.png"
            imageWidth={250}
            imageHeight={250}
            description="Lexicon Logo"
          />
          <vstack alignment="top center">
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
          </vstack>
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
        <vstack height={webviewVisible ? "100%" : "0%"} grow>
          <webview
            id="myWebView"
            url="dist/index.html"
            onMessage={(msg) => onMessage(msg as unknown as Message<any>)}
            grow
            height={webviewVisible ? "100%" : "0%"}
          />
        </vstack>
      </vstack>
    );
  },
});

export default Devvit;
