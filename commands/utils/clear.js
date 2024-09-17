const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Export the command module
module.exports = {
    // Define the command data
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clears a specified number of messages from the channel.')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The number of messages to clear')
                .setRequired(true)),
    
    // Define the execute function
    async execute(interaction) {
        // Get the amount of messages to clear from the interaction options
        const amount = interaction.options.getInteger('amount');

        // Check if the amount is a valid number and within a reasonable range
        if (isNaN(amount) || amount <= 0 || amount > 100) {
            return interaction.reply('Please provide a valid number of messages to clear (1-100).');
        }

        try {
            // Fetch the specified number of messages from the channel
            const messages = await interaction.channel.messages.fetch({ limit: amount });
            // Bulk delete the fetched messages
            await interaction.channel.bulkDelete(messages);

            // Create an embed for the success message
            const successEmbed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('Messages Cleared')
                .setDescription(`Successfully cleared ${messages.size} messages.`)
                .setTimestamp();

            // Reply with the embed
            await interaction.reply({ embeds: [successEmbed], ephemeral: true });
        } catch (error) {
            // Log the error and reply with a failure message
            console.error('Error clearing messages:', error);
            await interaction.reply({ content: 'Failed to clear messages. Please try again later.', ephemeral: true });
        }
    },
};