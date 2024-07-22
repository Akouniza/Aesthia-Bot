// commands/moderations/kick.js
// Import necessary modules
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user from the server')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to kick')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for kicking')
                .setRequired(false)),
    async execute(interaction) {
        // Get the user to kick from the interaction options
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        // Check if the user has permission to kick members
        if (!interaction.member.permissions.has('KICK_MEMBERS')) {
            return interaction.reply('You do not have permission to kick members.');
        }

        // Check if the user is kickable (higher or equal role)
        if (!user.kickable) {
            return interaction.reply('I cannot kick this user.');
        }

        try {
            // Kick the user with the provided reason
            await user.kick(reason);
            interaction.reply(`Successfully kicked ${user.tag} for: ${reason}`);
        } catch (error) {
            console.error(error);
            interaction.reply('An error occurred while kicking the user.');
        }
    },
};
