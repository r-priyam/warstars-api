import fetch from 'node-fetch';
import * as CryptoJS from 'crypto-js';
import type { Repository } from 'typeorm';
import type { FastifyRequest } from 'fastify';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { DatabaseSession, User } from '~/database';
import type { AppConfig } from '~/core/config/env.getters';
import type { ICreateUser, ICredentialsResponse, IDiscordUser, IDiscordUserGuild, IEncryptedTokens } from '~/utils/interfaces';

@Injectable()
export class DiscordService {
    constructor(
        private readonly config: AppConfig,
        @InjectRepository(User) private userDB: Repository<User>,
        @InjectRepository(DatabaseSession) private sessionDB: Repository<DatabaseSession>
    ) {}

    async handleCallback(request: FastifyRequest, code: string) {
        try {
            const oauthData = await this.exchangeToken('authorization_code', { code });
            const userDiscordData: IDiscordUser = await this.getUserData(oauthData.access_token);
            const tokens = this.encryptTokens(oauthData.access_token, oauthData.refresh_token);
            const user = await this.createUser(this.userData(userDiscordData, tokens));
            await this.createSession(request, user);
        } catch (error) {
            throw new HttpException({ status: HttpStatus.INTERNAL_SERVER_ERROR, error }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private userData(user: IDiscordUser, tokens: IEncryptedTokens): ICreateUser {
        return {
            discordId: user.id,
            username: user.username,
            discriminator: user.discriminator,
            email: user.email,
            avatar: user.avatar,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        };
    }

    private async createUser(data: ICreateUser): Promise<User> {
        const user = await this.userDB.findOne({ discordId: data.discordId });

        if (user) {
            const updatedUser = await this.updateUser(user, data);
            return updatedUser;
        }

        const newUser = this.userDB.create(data);
        return await this.userDB.save(newUser);
    }

    private async updateUser(user: User, data: ICreateUser): Promise<User> {
        user.username = data.username;
        user.discriminator = data.discriminator;
        user.email = data.email;
        user.avatar = data.avatar;
        user.accessToken = data.accessToken;
        user.refreshToken = data.refreshToken;
        return await this.userDB.save(user);
    }

    private async createSession(request: FastifyRequest, user: User) {
        request.session.user = user;
        const session = this.sessionDB.create({
            id: request.session.sessionId,
            expiredAt: new Date(request.session.cookie.expires).getTime(),
            json: JSON.stringify(user)
        });
        return await this.sessionDB.save(session);
    }

    async handleTokenRefresh(request: FastifyRequest) {
        try {
            const refreshToken = this.decryptToken(request.session.user.refreshToken).toString(CryptoJS.enc.Utf8);
            const refreshData = await this.exchangeToken('refresh_token', { refreshToken });
            const userDiscordData: IDiscordUser = await this.getUserData(refreshData.access_token);
            const tokens = this.encryptTokens(refreshData.access_token, refreshData.refresh_token);
            const user = await this.createUser(this.userData(userDiscordData, tokens));
            await this.createSession(request, user);
        } catch (error) {
            throw new HttpException({ status: HttpStatus.INTERNAL_SERVER_ERROR, error }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async userGuilds(request: FastifyRequest): Promise<IDiscordUserGuild> {
        const accessToken = this.decryptToken(request.session.user.accessToken).toString(CryptoJS.enc.Utf8);
        const response = await fetch('https://discord.com/api/users/@me/guilds', { headers: { authorization: `Bearer ${accessToken}` } });
        const data = await response.json();
        if (!response.ok) throw new HttpException({ status: HttpStatus.BAD_REQUEST, error: data }, HttpStatus.BAD_REQUEST);
        return data;
    }

    async logOut(request: FastifyRequest) {
        const sessionId = request.session.sessionId;
        await this.sessionDB.delete({ id: sessionId });
    }

    private async exchangeToken(
        grantType: string,
        { code, refreshToken }: { code?: string; refreshToken?: string }
    ): Promise<ICredentialsResponse> {
        const body = new URLSearchParams({
            client_id: this.config.discord.clientId,
            client_secret: this.config.discord.clientSecret,
            grant_type: grantType,
            redirect_uri: this.config.discord.redirectUrl
        });
        if (code) body.append('code', code);
        else body.append('refresh_token', refreshToken);

        const response = await fetch('https://discord.com/api/v8//oauth2/token', {
            method: 'POST',
            body,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const data = await response.json();
        if (!response.ok) throw new HttpException({ status: HttpStatus.BAD_REQUEST, error: data }, HttpStatus.BAD_REQUEST);
        return data;
    }

    private async getUserData(accessToken: string): Promise<IDiscordUser> {
        const response = await fetch('https://discord.com/api/users/@me', { headers: { authorization: `Bearer ${accessToken}` } });
        const data = await response.json();
        if (!response.ok) throw new HttpException({ status: HttpStatus.BAD_REQUEST, error: data }, HttpStatus.BAD_REQUEST);
        return data;
    }

    private encryptToken = (token: string) => CryptoJS.AES.encrypt(token, this.config.discord.encryptSecret);

    private decryptToken = (encrypted: string) => CryptoJS.AES.decrypt(encrypted, this.config.discord.encryptSecret);

    private encryptTokens(accessToken: string, refreshToken: string): IEncryptedTokens {
        return { accessToken: this.encryptToken(accessToken).toString(), refreshToken: this.encryptToken(refreshToken).toString() };
    }
}
