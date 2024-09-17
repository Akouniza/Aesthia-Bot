// commands/moderations/ban.js
// Import necessary modules
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
    // Define the slash command data
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user from the server')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to ban')
                .setRequired(true)) // User option is required
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for banning')
                .setRequired(false)), // Reason option is optional

    // Execute function for the slash command
    async execute(interaction) {
        // Get the user to ban and reason from the interaction options
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        // Check if the user has permission to ban members
        if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            return interaction.reply({ content: 'You do not have permission to ban members.', ephemeral: true });
        }

        // Fetch the member object of the user to check bannable status
        const member = await interaction.guild.members.fetch(user.id).catch(console.error);

        // Check if the member is bannable
        if (!member || !member.bannable) {
            return interaction.reply({ content: 'I cannot ban this user.', ephemeral: true });
        }

        try {
            // Ban the user with the provided reason
            await member.ban({ reason: reason });
            interaction.reply(`Successfully banned ${user.tag} for: ${reason}`);
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'An error occurred while banning the user.', ephemeral: true });
        }
    },
};
