import 'dotenv/config';
import type { Knex } from 'knex';

import { config as botConfig } from './src/config';

const config: { [key: string]: Knex.Config } = {
    development: {
        client: 'mysql2',
        connection: {
            uri: botConfig.dbUrl,
        },
        migrations: {
            directory: './src/core/database/migrations',
        },
    },

    production: {
        client: 'mysql2',
        connection: {
            uri: botConfig.dbUrl,
        },
        migrations: {
            directory: './src/core/database/migrations',
        },
    },
};

export default config;
