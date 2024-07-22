const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { exec } = require('child_process');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('debug')
        .setDescription('Check for any code errors or if updates are pending'),
    async execute(interaction) {
        // Execute git status to check for pending updates
        exec('git status', (err, stdout, stderr) => {
            if (err) {
                return interaction.reply({ content: `Error executing git status: ${stderr}`, ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setTitle('Debug Information')
                .setColor(0x00AE86)
                .addFields(
                    { name: 'Git Status', value: stdout || 'No pending updates', inline: false }
                )
                .setTimestamp();

            interaction.reply({ embeds: [embed], ephemeral: true });
        });
    }
};
