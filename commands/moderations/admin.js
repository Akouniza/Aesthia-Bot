const { SlashCommandBuilder, Permissions, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('admin')
        .setDescription('Ban or kick a user from the server')
        .addSubcommand(subcommand =>
            subcommand
                .setName('ban')
                .setDescription('Ban a user from the server')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to ban')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('Reason for banning')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('kick')
                .setDescription('Kick a user from the server')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to kick')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('Reason for kicking')
                        .setRequired(false))),
    
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = await interaction.guild.members.fetch(user.id).catch(console.error);

        if (!member) {
            return interaction.reply({ content: 'User not found in the server.', ephemeral: true });
        }

        if (subcommand === 'ban') {
            if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
                return interaction.reply({ content: 'You do not have permission to ban members.', ephemeral: true });
            }

            if (!member.bannable) {
                return interaction.reply({ content: 'I cannot ban this user.', ephemeral: true });
            }

            try {
                await member.send(`You have been banned from ${interaction.guild.name} for: ${reason}`);
                await member.ban({ reason: reason });
                interaction.reply(`Successfully banned ${user.tag} for: ${reason}`);
            } catch (error) {
                console.error(error);
                interaction.reply({ content: 'An error occurred while banning the user.', ephemeral: true });
            }
        } else if (subcommand === 'kick') {
            if (!interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
                return interaction.reply({ content: 'You do not have permission to kick members.', ephemeral: true });
            }

            if (!member.kickable) {
                return interaction.reply({ content: 'I cannot kick this user.', ephemeral: true });
            }

            try {
                await member.send(`You have been kicked from ${interaction.guild.name} for: ${reason}`);
                await member.kick(reason);
                interaction.reply(`Successfully kicked ${user.tag} for: ${reason}`);
            } catch (error) {
                console.error(error);
                interaction.reply({ content: 'An error occurred while kicking the user.', ephemeral: true });
            }
        }
    },
};