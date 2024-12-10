import "./createPost.js";
import { getBoard } from "../server/get-board.js";

import { Devvit, useState, RedisClient } from "@devvit/public-api";

// Defines the messages that are exchanged between Devvit and Web View
type WebViewMessage =
  | {
      type: "initialData";
      data: {
        username: string;
        currentCounter: number;
        dimentions: {
          width: number;
          height: number;
        };
      };
    }
  | {
      type: "setCounter";
      data: { newCounter: number };
    }
  | {
      type: "updateCounter";
      data: { currentCounter: number };
    };

Devvit.configure({
  redditAPI: true,
  redis: true,
});

// Add a custom post type to Devvit
Devvit.addCustomPostType({
  name: "Lexicon",
  height: "tall",
  render: (context) => {
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
    const onMessage = async (msg: WebViewMessage) => {
      switch (msg.type) {
        case "setCounter":
          await context.redis.set(
            `counter_${context.postId}`,
            msg.data.newCounter.toString()
          );
          context.ui.webView.postMessage("myWebView", {
            type: "updateCounter",
            data: {
              currentCounter: msg.data.newCounter,
            },
          });
          setCounter(msg.data.newCounter);
          break;
        case "initialData":
        case "updateCounter":
          break;

        default:
          throw new Error(`Unknown message type: ${msg satisfies never}`);
      }
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
          board
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
      <vstack grow padding="xsmall">
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
        <vstack grow={webviewVisible} height={webviewVisible ? "100%" : "0%"}>
          <vstack
            border="thick"
            borderColor="black"
            height={webviewVisible ? "100%" : "0%"}
          >
            <webview
              id="myWebView"
              url="dist/index.html"
              onMessage={(msg) => onMessage(msg as WebViewMessage)}
              grow
              height={webviewVisible ? "100%" : "0%"}
            />
          </vstack>
        </vstack>
      </vstack>
    );
  },
});

export default Devvit;
