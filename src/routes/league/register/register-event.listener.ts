import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { GuildMember, MessageActionRow, MessageButton, MessageEmbed, TextChannel } from 'discord.js';
import { Repository } from 'typeorm';
import { BotService } from '~/core/bot/bot.service';
import { League, LeagueAdmin } from '~/database';
import { IRegisterLeague } from '~/utils/interfaces';

@Injectable()
export class LeagueRegisterListener {
	constructor(
		private readonly discord: BotService,
		@InjectRepository(League) private leagueDb: Repository<League>,
		@InjectRepository(LeagueAdmin) private adminDb: Repository<LeagueAdmin>
	) {
		this.bot.on('interactionCreate', async (interaction) => {
			if (!interaction.isButton()) return;
			if (!interaction.customId.startsWith('APPROVE_') && !interaction.customId.startsWith('DECLINE_')) return;

			const user = interaction.member as GuildMember;
			if (/^APPROVE/i.test(interaction.customId)) {
				const abbreviation = interaction.customId.replace('APPROVE_', '');

				const leagueData = await this.leagueDb.query(
					'UPDATE league SET is_verified = true WHERE abbreviation = $1 RETURNING league_id, name, abbreviation, discord_id',
					[abbreviation]
				);
				await this.adminDb.query('INSERT INTO league_admin (discord_id, league_id, permissions) VALUES($1, $2, $3)', [
					leagueData[0][0].discord_id,
					leagueData[0][0].league_id,
					1024
				]);

				const verifiedEmbed = new MessageEmbed()
					.setColor('#2ECC71')
					.setTitle('League Approved')
					.setDescription(
						`Successfully approved ${leagueData[0][0].name} application. Unique ID: ${leagueData[0][0].league_id}. Abbreviation: ${leagueData[0][0].abbreviation}`
					)
					.setFooter({ text: `Approved by - ${user.displayName}`, iconURL: user.displayAvatarURL({ dynamic: true }) })
					.setTimestamp();
				return await interaction.update({ embeds: [verifiedEmbed], components: [] });
			}

			const abbreviation = interaction.customId.replace('DECLINE_', '');
			const leagueData = await this.leagueDb.query(
				'DELETE FROM league WHERE abbreviation = $1 RETURNING league_id, name, abbreviation, discord_id',
				[abbreviation]
			);

			const declineEmbed = new MessageEmbed()
				.setColor('#E74C3C')
				.setTitle('League Declined')
				.setDescription(
					`Successfully declined ${leagueData[0][0].name} application. Unique ID: ${leagueData[0][0].league_id}. Abbreviation: ${leagueData[0][0].abbreviation}`
				)
				.setFooter({ text: `Declined by - ${user.displayName}`, iconURL: user.displayAvatarURL({ dynamic: true }) })
				.setTimestamp();
			return await interaction.update({ embeds: [declineEmbed], components: [] });
		});
	}
	private bot = this.discord.client;

	@OnEvent('league.register')
	handleOrderCreatedEvent(data: IRegisterLeague) {
		const LeagueInfoEmbed = new MessageEmbed()
			.setColor('#2ECC71')
			.setTitle('New League Approval Request')
			.addFields(
				{ name: 'League Name', value: data.name, inline: false },
				{ name: 'Abbreviation', value: data.abbreviation, inline: false },
				{ name: 'Head Deatils', value: `${data.headAdmin} (${data.discordId})`, inline: false },
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
		channel.send({ embeds: [LeagueInfoEmbed], components: [buttons] });
	}
}
