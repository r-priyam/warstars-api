/* eslint-disable @typescript-eslint/consistent-type-imports */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';
import { Util } from 'clashofclans.js';
import { FastifyRequest } from 'fastify';
import type { Repository } from 'typeorm';
import { ClashService } from '~/core/clash/clash.service';
import { UserPlayer } from '~/database';

@Injectable()
export class PlayerService {
    constructor(
        @InjectRepository(UserPlayer) private playerDb: Repository<UserPlayer>,
        @OgmaLogger(PlayerService) private readonly logger: OgmaService,
        private readonly clash: ClashService
    ) {}

    private coc = this.clash.clashClient;
    private readonly roles = { member: 'Member', coLeader: 'Co-Leader', leader: 'Leader', admin: 'Elder' };

    public async userPlayers(request: FastifyRequest) {
        try {
            const data = await this.playerDb
                .createQueryBuilder('user')
                .where('user.discord_id = :discordId', { discordId: request.session.user.discordId })
                .getMany();

            const playersData = [];
            const players = Util.allSettled(data.map((e) => this.coc.getPlayer(e.playerTag)));

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
                    linkedAt: data.find((e) => e.playerTag === player.tag).linkedAt
                });
            }
            return playersData;
        } catch (error) {
            this.logger.error(error);
            throw new HttpException('Something went wrong!', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async linkPlayer(request: FastifyRequest, playerTag: string, apiToken: string) {
        if (!Util.isValidTag(Util.formatTag(playerTag))) throw new HttpException('Invalid Player Tag!', HttpStatus.NOT_ACCEPTABLE);

        let status: boolean;
        try {
            status = await this.coc.verifyPlayerToken(playerTag, apiToken);
        } catch (error) {
            if (error.reason === 'notFound') throw new HttpException('Player Not Found!', HttpStatus.NOT_FOUND);
            else {
                this.logger.error(error);
                throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        if (!status) throw new HttpException('Invalid API Token!', HttpStatus.BAD_REQUEST);

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
            } else {
                this.logger.error(error);
                throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    public async removePlayer(request: FastifyRequest, playerTag: string) {
        let data: any;
        try {
            data = await this.playerDb.query('DELETE FROM user_player WHERE discord_id = $1 AND player_tag = $2', [
                request.session.user.discordId,
                Util.formatTag(playerTag)
            ]);
        } catch (error) {
            this.logger.error(error);
            throw new HttpException('Something went wrong!', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if (data[1] === 0) throw new HttpException('Player Tag not linked!', HttpStatus.CONFLICT);
    }
}
