import { AbstractCommand } from './abstract.command';
import { Context } from 'telegraf';

export class MozaCommand extends AbstractCommand {
    async invoke(ctx: Context): Promise<void> {
        await ctx.reply('TODO');
    }

    readonly name: string = 'moza';
}
