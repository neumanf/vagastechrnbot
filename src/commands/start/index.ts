import { Composer } from 'grammy';

export const startComposer = new Composer();

const START_MESSAGE =
    'Olá! Eu administro o @vagastechrn. Entre no canal para receber todas as postagens.';

startComposer.command('start', (ctx) => ctx.reply(START_MESSAGE));
