export const config = {
  botToken: process.env.BOT_TOKEN ?? "",
  channelId: process.env.CHANNEL_ID ?? "",
  routinesCron: process.env.ROUTINES_CRON ?? "*/30 * * * *",
  dbTable: process.env.DYNAMODB_TABLE ?? "",
};
