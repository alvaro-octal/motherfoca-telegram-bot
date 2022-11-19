import { Context, Telegraf } from 'telegraf';
import { Request, logger, Response, region, config } from 'firebase-functions';
import { AbstractCommand } from './commands/abstract.command';
import { StartCommand } from './commands/start.command';
import { EspaletCommand } from './commands/espalet.command';

const bot = new Telegraf(config().telegram.token, {
    telegram: {
        webhookReply: true,
    },
});

bot.catch(async (err, ctx: Context): Promise<void> => {
    logger.error('[Bot] Error', err);
    await ctx.reply(`Encountered an error for ${ctx.updateType}`);
});

const commands: AbstractCommand[] = [new StartCommand(), new EspaletCommand()];

for (const command of commands) {
    bot.command(`/${command.name}`, (ctx: Context) => command.invoke(ctx));
}

exports.webhook = region('europe-west6').https.onRequest(
    async (request: Request, response: Response): Promise<void> => {
        logger.log('Incoming message', request.body);
        await bot.handleUpdate(request.body, response).then(() => {
            return response.sendStatus(200);
        });
    },
);
