import { Injectable } from '@nestjs/common';
import { Command } from 'discord-akairo';
import type { Message } from 'discord.js';
import { getConnection } from 'typeorm';

@Injectable()
export default class LeagueIconCommand extends Command {
    public constructor() {
        super('leagueicon', {
            aliases: ['leagueicon'],
            ownerOnly: true,
            channel: 'guild',
            description: {
                content: 'Set league icon for a league in the database'
            }
        });
    }

    public *args(): unknown {
        const leagueId = yield {
            type: 'number'
        };

        const iconUrl = yield {
            match: 'rest',
            type: 'string'
        };

        return { leagueId, iconUrl };
    }

    public async exec(message: Message, { leagueId, iconUrl }: { leagueId?: number; iconUrl: string }) {
        if (!leagueId || !iconUrl) return message.util.send('**Please provide `League ID` and `Icon Url`**');
        const db = getConnection();

        await db.query('UPDATE league SET icon_url = $1 WHERE league_id = $2 RETURNING league_name', [iconUrl, leagueId]);
        return message.util.send('League badge updated successfully!');
    }
}
