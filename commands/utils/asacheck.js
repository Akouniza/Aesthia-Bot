const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('asacheck')
        .setDescription('Check the status of the ARK servers and refresh it automatically.')
        .addStringOption(option => 
            option.setName('server1')
                .setDescription('The ID of the first server')
                .setRequired(false))
        .addStringOption(option => 
            option.setName('server2')
                .setDescription('The ID of the second server')
                .setRequired(false))
        .addStringOption(option => 
            option.setName('server3')
                .setDescription('The ID of the third server')
                .setRequired(false))
        .addStringOption(option => 
            option.setName('server4')
                .setDescription('The ID of the fourth server')
                .setRequired(false))
        .addStringOption(option => 
            option.setName('server5')
                .setDescription('The ID of the fifth server')
                .setRequired(false)),
    async execute(interaction) {
        const serverIdPattern = /^[0-9]+$/; // Regex pattern to match numeric server IDs
        const serverIds = [
            interaction.options.getString('server1'),
            interaction.options.getString('server2'),
            interaction.options.getString('server3'),
            interaction.options.getString('server4'),
            interaction.options.getString('server5')
        ].filter(id => id && serverIdPattern.test(id)); // Filter out invalid IDs

        const fetchServerStatus = async () => {
            try {
                const serverData = await Promise.all(serverIds.map(async (id) => {
                    const response = await axios.get(`https://api.battlemetrics.com/servers/${id}`);
                    return { id, attributes: response.data.data.attributes };
                }));

                // Construct the embed message
                const embed = new EmbedBuilder()
                    .setTitle('ARK Server Status')
                    .setColor(0x00AE86)
                    .setTimestamp()
                    .setFooter({ text: `Last Refresh: ${new Date().toLocaleString()}` });

                serverData.forEach((data, index) => {
                    embed.addFields(
                        { name: `Server ${index + 1}`, value: data.attributes.name, inline: true },
                        { name: 'BM ID', value: data.id, inline: true },
                        { name: 'Status', value: data.attributes.status, inline: true },
                        { name: 'Players', value: `${data.attributes.players}/${data.attributes.maxPlayers}`, inline: true },
                        { name: 'Map', value: data.attributes.details.map, inline: true }
                    );
                    // Add a blank field for spacing only if it's not the last server
                    if (index < serverData.length - 1) {
                        embed.addFields({ name: '\u200B', value: '\u200B', inline: false });
                    }
                });

                // Edit the original message with the new embed
                if (interaction.replied || interaction.deferred) {
                    await interaction.editReply({ embeds: [embed] });
                } else {
                    await interaction.reply({ embeds: [embed] });
                }
            } catch (error) {
                console.error('Error fetching server status:', error);
                const errorMessage = 'There was an error fetching the server status. Please try again later.';
                if (interaction.replied || interaction.deferred) {
                    await interaction.editReply(errorMessage);
                } else {
                    await interaction.reply(errorMessage);
                }
            }
        };

        // Fetch the server status immediately
        await fetchServerStatus();

        // Set an interval to fetch the server status every minute
        setInterval(fetchServerStatus, 60000);
    },
};