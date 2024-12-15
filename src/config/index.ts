import 'dotenv/config';

export const config = {
    nodeEnv: process.env.NODE_ENV ?? '',
    port: process.env.PORT ?? 3000,
    botToken: process.env.BOT_TOKEN ?? '',
    channelId: process.env.CHANNEL_ID ?? '',
    dbUrl: process.env.DATABASE_URL ?? '',
};
