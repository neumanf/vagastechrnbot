export const config = {
  nodeEnv: process.env.NODE_ENV ?? "",
  cyclicUrl: process.env.CYCLIC_URL ?? "",
  port: process.env.PORT ?? 3000,
  botToken: process.env.BOT_TOKEN ?? "",
  channelId: process.env.CHANNEL_ID ?? "",
  dbName: process.env.CYCLIC_DB ?? "",
};
