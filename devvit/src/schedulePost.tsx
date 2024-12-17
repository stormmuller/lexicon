import { Devvit } from "@devvit/public-api";
import { getFormattedDate } from "./get-formatted-date.ts";

Devvit.configure({
  redditAPI: true,
});

Devvit.addSchedulerJob({
  name: "daily-post",
  onRun: async (_, context) => {
    console.log('Executing daily post');
    const subreddit = await context.reddit.getCurrentSubreddit();
    await context.reddit.submitPost({
      title: `Lexicon - ${getFormattedDate()}`,
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
  },
});

Devvit.addTrigger({
  events: ["AppInstall", "AppUpgrade"],
  onEvent: async (_, context) => {
    console.log('Trigger Added');
    try {
      const existingJobId = await context.redis.get("jobId");

      if (existingJobId) {
        await context.scheduler.cancelJob(existingJobId);
      }

      const jobId = await context.scheduler.runJob({
        cron: "0 0 * * *",
        name: "daily-post",
        data: {},
      });
      await context.redis.set("jobId", jobId);
    } catch (e) {
      console.log("error was not able to schedule:", e);
      throw e;
    }
  },
});
