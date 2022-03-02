import { GuildMember, Interaction, MessageEmbed } from 'discord.js';
import { Listener } from 'discord-akairo';
import { getConnection } from 'typeorm';

export default class MessageListener extends Listener {
    public constructor() {
        super('buttonInteraction', {
            emitter: 'client',
            event: 'interactionCreate',
            category: 'client'
        });
    }

    public async exec(interaction: Interaction) {
        if (!interaction.isButton()) return;
        if (!interaction.customId.startsWith('APPROVE_') && !interaction.customId.startsWith('DECLINE_')) return;

        const db = getConnection();
        const user = interaction.member as GuildMember;

        if (/^APPROVE/i.test(interaction.customId)) {
            const abbreviation = interaction.customId.replace('APPROVE_', '');
            const leagueData = await db.query(
                'UPDATE league SET is_verified = true WHERE abbreviation = $1 RETURNING league_id, name, abbreviation, discord_id',
                [abbreviation]
            );
            await db.query('INSERT INTO league_admin (discord_id, league_id, permissions, head_admin) VALUES($1, $2, $3, $4)', [
                leagueData[0][0].discord_id,
                leagueData[0][0].league_id,
                8,
                true
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
        const leagueData = await db.query(
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
    }
}
