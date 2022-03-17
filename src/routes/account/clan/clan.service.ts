import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Clan, Util } from 'clashofclans.js';
import { FastifyRequest } from 'fastify';
import { Repository } from 'typeorm';

import { ClashService } from '~/core/clash/clash.service';
import { UserClan } from '~/database';

@Injectable()
export class ClanService {
    constructor(@InjectRepository(UserClan) private clanDb: Repository<UserClan>, private readonly clash: ClashService) {}

    private coc = this.clash.clashClient;

    public async userClans(request: FastifyRequest) {
        const data = await this.clanDb
            .createQueryBuilder('user')
            .where('user.discord_id = :discordId', { discordId: request.session.user.discordId })
            .getMany();
        const saved = [...data];

        const clansData = [];
        while (data.length !== 0) {
            const clans = Util.allSettled(data.splice(0, 5).map((data) => this.coc.getClan(data.clanTag)));

            for (const clan of await clans) {
                clansData.push({
                    name: clan.name,
                    tag: clan.tag,
                    members: clan.memberCount,
                    badge: clan.badge.url,
                    leader: clan.members.find((m) => m.role === 'leader').name,
                    level: clan.level,
                    location: clan.location?.name || 'No Location Set',
                    trophies: clan.points,
                    versusTrophies: clan.versusPoints,
                    labels: Object.fromEntries(clan.labels.map((label) => [label.name, label.icon.url])),
                    linkedAt: saved.find((data) => data.clanTag === clan.tag).linkedAt
                });
            }
        }
        saved.length > 0 && saved.pop();
        return clansData;
    }

    public async linkClan(request: FastifyRequest, clanTag: string) {
        if (!Util.isValidTag(Util.formatTag(clanTag))) {
            throw new HttpException('Invalid Clan Tag!', HttpStatus.NOT_ACCEPTABLE);
        }

        let clan: Clan;
        try {
            clan = await this.coc.getClan(clanTag);
        } catch (error) {
            if (error.reason === 'notFound') {
                throw new HttpException('Clan Not Found!', HttpStatus.NOT_FOUND);
            }
        }

        try {
            await this.clanDb
                .createQueryBuilder()
                .insert()
                .values([{ discordId: request.session.user.discordId, clanTag: clan.tag }])
                .execute();
        } catch (error) {
            if (error.code === '23505') {
                throw new HttpException('Clan is already linked', HttpStatus.BAD_REQUEST);
            }
        }
    }

    public async removeClan(request: FastifyRequest, clanTag: string) {
        const data = await this.clanDb.query('DELETE FROM user_clan WHERE discord_id = $1 AND clan_tag = $2', [
            request.session.user.discordId,
            Util.formatTag(clanTag)
        ]);
        if (data[1] === 0) {
            throw new HttpException('Clan Tag not linked!', HttpStatus.CONFLICT);
        }
    }
}
