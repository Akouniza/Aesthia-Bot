const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays a list of all commands with navigation arrows'),
    async execute(interaction) {
        const commands = interaction.client.commands;
        const sections = {
            debugging: [],
            moderations: [],
            utils: []
        };

        // Function to recursively read all .js files in the commands directory
        const readCommands = (dir) => {
            const files = fs.readdirSync(dir);
            files.forEach(file => {
                const filePath = path.join(dir, file);
                if (fs.statSync(filePath).isDirectory()) {
                    readCommands(filePath);
                } else if (file.endsWith('.js')) {
                    const command = require(filePath);
                    const folderName = path.basename(path.dirname(filePath));

                    if (folderName === 'debugging') {
                        sections.debugging.push(command.data);
                    } else if (folderName === 'moderations') {
                        sections.moderations.push(command.data);
                    } else if (folderName === 'utils') {
                        sections.utils.push(command.data);
                    }
                }
            });
        };

        // Start reading commands from the base commands directory
        readCommands(path.join(__dirname, '..', '..', 'commands'));

        // Create embeds for each section
        const createEmbed = (section, title) => {
            const embed = new EmbedBuilder()
                .setTitle(`${title} Commands`)
                .setColor(0x00AE86)
                .setDescription(section.map(cmd => `\`${cmd.name}\`: ${cmd.description}`).join('\n') || 'No commands available.');

            return embed;
        };

        const embeds = [
            createEmbed(sections.debugging, 'Debugging'),
            createEmbed(sections.moderations, 'Moderations'),
            createEmbed(sections.utils, 'Utils')
        ];

        let currentPage = 0;

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('previous')
                    .setLabel('◀')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('▶')
                    .setStyle(ButtonStyle.Primary)
            );

        const message = await interaction.reply({ embeds: [embeds[currentPage]], components: [row], fetchReply: true, ephemeral: true });

        const filter = i => i.customId === 'previous' || i.customId === 'next';
        const collector = message.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (i.customId === 'previous') {
                currentPage = currentPage > 0 ? --currentPage : embeds.length - 1;
            } else if (i.customId === 'next') {
                currentPage = currentPage + 1 < embeds.length ? ++currentPage : 0;
            }

            await i.update({ embeds: [embeds[currentPage]], components: [row], ephemeral: true });
        });

        collector.on('end', collected => {
            message.edit({ components: [] });
        });
    }
};