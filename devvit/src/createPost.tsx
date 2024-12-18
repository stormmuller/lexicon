import { Devvit } from "@devvit/public-api";

// Configure Devvit's plugins
Devvit.configure({
  redditAPI: true,
});

// Adds a new menu item to the subreddit allowing to create a new post
Devvit.addMenuItem({
  label: "Start a game of Lexicon! 🚀",
  location: "subreddit",
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    const subreddit = await reddit.getCurrentSubreddit();
    const post = await reddit.submitPost({
      title: "Lexicon",
      subredditName: subreddit.name,
      // The preview appears while the post loads
      preview: (
        <vstack height="100%" width="100%" alignment="middle center">
          <image
            url="images/lexicon-logo-small.png"
            imageWidth={250}
            imageHeight={250}
            description="Lexicon Logo"
          />
          <text size="large">Loading...🧑‍🚀</text>
        </vstack>
      ),
    });
    ui.showToast({ text: "Created post!" });
    ui.navigateTo(post);
  },
});
