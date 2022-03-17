import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MessageActionRow, MessageButton, MessageEmbed, TextChannel } from 'discord.js';

import { BotService } from '~/core/bot/bot.service';
import { EVENT_VALUES } from '~/utils/Constants';
import { IRegisterLeague } from '~/utils/interfaces';

@Injectable()
export class LeagueRegisterListener {
    constructor(private readonly discord: BotService) {}
    private bot = this.discord.client;

    @OnEvent(EVENT_VALUES.LEAGUE_REGISTER)
    async handleLeagueRegisterEvent(data: IRegisterLeague) {
        const LeagueInfoEmbed = new MessageEmbed()
            .setColor('#2ECC71')
            .setTitle('New League Approval Request')
            .addFields(
                { name: 'League Name', value: data.name, inline: false },
                { name: 'Abbreviation', value: data.abbreviation, inline: false },
                { name: 'Head Details', value: `${data.headAdmin} (${data.discordId})`, inline: false },
                { name: 'Discord Invite', value: data.discordInvite || 'Not provided', inline: false },
                { name: 'Twitter Handle', value: data.twitterHandle || 'Not provided', inline: false },
                { name: 'Website', value: data.website || 'Not Provided', inline: false },
                { name: 'Rules Link', value: data.rules || 'Not Provided', inline: false }
            )
            .setTimestamp();

        const buttons = new MessageActionRow().addComponents(
            new MessageButton().setCustomId(`APPROVE_${data.abbreviation}`).setLabel('Approve').setStyle('SUCCESS'),
            new MessageButton().setCustomId(`DECLINE_${data.abbreviation}`).setLabel('Decline').setStyle('DANGER')
        );

        const channel = this.bot.channels.cache.get('833084538971226132') as TextChannel;
        await channel.send({ embeds: [LeagueInfoEmbed], components: [buttons] });
    }
}
