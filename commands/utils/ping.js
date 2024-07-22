const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),

    async execute(interaction) {
        // Function to create the embed with latency information
        const createEmbed = (roundTripLatency) => {
            return new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('Pong!')
                .setDescription(`Round-trip latency: ${roundTripLatency}ms`)
                .setTimestamp();
        };

        // Function to create the action row with the refresh button
        const createActionRow = () => {
            return new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('refresh_ping')
                        .setLabel('Refresh')
                        .setStyle(ButtonStyle.Primary)
                );
        };

        // Send an initial reply to the interaction and fetch the reply message
        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true, ephemeral: true });
        
        // Calculate the round-trip latency
        const roundTripLatency = Date.now() - interaction.createdTimestamp;

        // Create an embed message with the latency information
        const embed = createEmbed(roundTripLatency);

        // Edit the initial reply to include the embed message and the refresh button
        await interaction.editReply({ content: null, embeds: [embed], components: [createActionRow()], ephemeral: true });

        // Create a collector to handle button interactions
        const filter = i => i.customId === 'refresh_ping' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (i.customId === 'refresh_ping') {
                try {
                    // Calculate the new round-trip latency
                    const newSent = await i.update({ content: 'Pinging...', fetchReply: true, ephemeral: true });
                    const newRoundTripLatency = Date.now() - i.createdTimestamp;

                    // Create a new embed message with the updated latency information
                    const newEmbed = createEmbed(newRoundTripLatency);

                    // Edit the reply to include the new embed message
                    await i.editReply({ content: null, embeds: [newEmbed], components: [createActionRow()], ephemeral: true });
                } catch (error) {
                    if (error.code === 10062) {
                        console.error('Interaction has expired or is unknown.');
                        await i.followUp({ content: 'This interaction has expired. Please try again.', ephemeral: true });
                    } else {
                        console.error('An error occurred while updating the interaction:', error);
                        await i.followUp({ content: 'An error occurred. Please try again later.', ephemeral: true });
                    }
                }
            }
        });
    },
};