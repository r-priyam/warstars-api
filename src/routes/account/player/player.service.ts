import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Util } from 'clashofclans.js';
import { FastifyRequest } from 'fastify';
import { Repository } from 'typeorm';

import { ClashService } from '~/core/clash/clash.service';
import { UserPlayer } from '~/database';

@Injectable()
export class PlayerService {
    constructor(@InjectRepository(UserPlayer) private playerDb: Repository<UserPlayer>, private readonly clash: ClashService) {}

    private coc = this.clash.clashClient;
    private readonly roles = { member: 'Member', coLeader: 'Co-Leader', leader: 'Leader', admin: 'Elder' };

    public async userPlayers(request: FastifyRequest) {
        const data = await this.playerDb
            .createQueryBuilder('user')
            .where('user.discord_id = :discordId', { discordId: request.session.user.discordId })
            .getMany();

        const playersData = [];
        while (data.length !== 0) {
            const players = Util.allSettled(data.splice(0, 5).map((e) => this.coc.getPlayer(e.playerTag)));

            for (const player of await players) {
                playersData.push({
                    name: player.name,
                    tag: player.tag,
                    trophies: player.trophies,
                    versusTrophies: player.versusTrophies,
                    clan: {
                        name: player.clan?.name || 'No Clan',
                        position: this.roles[player.role] || null,
                        badge: player.clan?.badge.url || null
                    },
                    labels: Object.fromEntries(player.labels.map((label) => [label.name, label.icon.url])),
                    linkedAt: data.find((data) => data.playerTag === player.tag).linkedAt
                });
            }
        }
        return playersData;
    }

    public async linkPlayer(request: FastifyRequest, playerTag: string, apiToken: string) {
        if (!Util.isValidTag(Util.formatTag(playerTag))) {
            throw new HttpException('Invalid Player Tag!', HttpStatus.NOT_ACCEPTABLE);
        }

        let status: boolean;
        try {
            status = await this.coc.verifyPlayerToken(playerTag, apiToken);
        } catch (error) {
            if (error.reason === 'notFound') {
                throw new HttpException('Player Not Found!', HttpStatus.NOT_FOUND);
            }
        }

        if (!status) {
            throw new HttpException('Invalid API Token!', HttpStatus.BAD_REQUEST);
        }

        try {
            await this.playerDb
                .createQueryBuilder()
                .insert()
                .values([{ discordId: request.session.user.discordId, playerTag: Util.formatTag(playerTag) }])
                .execute();
            return 'Player linked successfully';
        } catch (error) {
            if (error.code === '23505') {
                throw new HttpException('Player is already linked', HttpStatus.BAD_REQUEST);
            }
        }
    }

    public async removePlayer(request: FastifyRequest, playerTag: string) {
        const data = await this.playerDb.query('DELETE FROM user_player WHERE discord_id = $1 AND player_tag = $2', [
            request.session.user.discordId,
            Util.formatTag(playerTag)
        ]);
        if (data[1] === 0) {
            throw new HttpException('Player Tag not linked!', HttpStatus.CONFLICT);
        }
    }
}
