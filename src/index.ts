import { serve } from "@hono/node-server";
import { makeTownsBot } from "@towns-protocol/bot";
import { Hono } from "hono";
import { logger } from "hono/logger";
import commands from "./commands";

async function main() {
  const bot = await makeTownsBot(
    process.env.APP_PRIVATE_DATA!,
    process.env.JWT_SECRET!,
    {
      commands,
    }
  );

  bot.onSlashCommand("time", async (handler, { channelId }) => {
    const currentTime = new Date().toLocaleString();
    await handler.sendMessage(channelId, `Current time: ${currentTime} ⏰`);
  });

  // /poke @cris @ryan @serge
  // > hey guys, @cris, @ryan, @serge, youre all good boys
  bot.onSlashCommand("poke", async (handler, { channelId, mentions }) => {
    const mentionString = mentions
      .map((mention) => mention.displayName)
      .join(", ");
    await handler.sendMessage(
      channelId,
      `Hey guys, ${mentionString}, you're all good boys!`
    );
  });

  const { jwtMiddleware, handler } = bot.start();

  const app = new Hono();
  app.use(logger());
  app.post("/webhook", jwtMiddleware, handler);
  serve({ fetch: app.fetch, port: parseInt(process.env.PORT!) });
  console.log(
    `✅ Quickstart Bot is running on https://localhost:${process.env.PORT}`
  );
}

main().catch((error) => {
  console.error("Failed to start bot:", error);
  process.exit(1);
});
