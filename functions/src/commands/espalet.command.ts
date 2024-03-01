import { AbstractCommand } from './abstract.command';
import { Context } from 'telegraf';
import { InputMediaPhoto } from 'telegraf/types';

export class EspaletCommand extends AbstractCommand {
    async invoke(ctx: Context): Promise<void> {
        await ctx.sendChatAction('upload_photo');

        const now: Date = new Date();

        const photos: InputMediaPhoto[] = [
            {
                type: 'photo',
                media: `https://www.espalet.eu/webcams/Frontera_18072/000M.jpg?t=${now.getTime()}`,
                caption: 'Portalet Francia',
            },
            {
                type: 'photo',
                media: `https://www.espalet.eu/webcams/Frontera_18008/000M.jpg?t=${now.getTime()}`,
                caption: 'Portalet España',
            },
        ];

        const response: Response = await fetch('https://www.espalet.eu/');
        const body: string = await response.text();

        const regex =
            // eslint-disable-next-line max-len
            /https:\/\/www.espalet.eu\/webcams\/(\w+)_(\d+)\/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})_(\d{2})_(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{3})_TIMING.jpg/gm;

        let m: RegExpExecArray | null;

        while ((m = regex.exec(body)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            photos.push({
                type: 'photo',
                media: m[0],
                caption: `${m[1]} ${m[5]}-${m[6]}-${m[7]} ${m[8]}:${m[9]}:${m[10]}`,
            });
        }

        await ctx.replyWithMediaGroup(photos);
    }

    readonly name: string = 'espalet';
}
