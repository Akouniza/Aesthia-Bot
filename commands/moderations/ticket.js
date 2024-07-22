// ./commands/moderations/ticket.js
const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ActionRowBuilder, StringSelectMenuBuilder, ChannelType } = require('discord.js');
const ticket = require('../../database/models/ticketSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Manage the ticket system')
        .addSubcommand(command => 
            command
                .setName('send')
                .setDescription('Send the ticket message')
                .addStringOption(option => 
                    option
                        .setName('name')
                        .setDescription('The name for the open select menu content')
                        .setRequired(true)
                )
                .addStringOption(option => 
                    option
                        .setName('message')
                        .setDescription('A custom message to add to the embed')
                        .setRequired(false)
                )
        )
        .addSubcommand(command => 
            command
                .setName('setup')
                .setDescription('Setup the ticket category')
                .addChannelOption(option => 
                    option
                        .setName('category')
                        .setDescription('The category to send tickets in')
                        .addChannelTypes(ChannelType.GuildCategory)
                        .setRequired(true)
                )
        )
        .addSubcommand(command => 
            command
                .setName('remove')
                .setDescription('Disable the ticket system')
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    async execute(interaction) {
        const { options } = interaction;
        const sub = options.getSubcommand();
        const data = await ticket.findOne({ Guild: interaction.guild.id });

        switch (sub) {
            case 'send':
                if (!data) {
                    return await interaction.reply({ content: `You have to do /ticket setup before you can send a ticket message...`, ephemeral: true });
                }

                const name = options.getString('name');
                const message = options.getString('message') || 'Create a ticket to talk with the server staff! Once you select below, use the input to describe why you are creating a ticket';

                const menu = new StringSelectMenuBuilder()
                    .setCustomId('ticketCreateSelect')
                    .setPlaceholder(name)
                    .addOptions([
                        {
                            label: 'Create your ticket',
                            description: 'Click to begin the ticket creation process',
                            value: 'createTicket'
                        },
                        {
                            label: 'test',
                            description: 'test123',
                            value: 'test12345'
                        }
                    ]);

                const select = new ActionRowBuilder().addComponents(menu);

                const embed = new EmbedBuilder()
                    .setColor("Blurple")
                    .setTitle(`Create a ticket`)
                    .setDescription(message + '')
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}` });

                await interaction.reply({ content: `I have sent your ticket message below.`, ephemeral: true });
                await interaction.channel.send({ embeds: [embed], components: [select] });

                break;

            case 'remove':
                if (!data) {
                    await interaction.reply({ content: `Looks like you don't already have a ticket system set`, ephemeral: true });
                } else {
                    // Replace this line with the appropriate delete method for your ORM or library
                    await ticket.destroy({ where: { Guild: interaction.guild.id } });
                    await interaction.reply({ content: `I have deleted your ticket category.`, ephemeral: true });
                }

                break;

            case 'setup':
                if (data) {
                    await interaction.reply({ content: `Looks like you already have a ticket category set to <#${data.Category}>`, ephemeral: true });
                } else {
                    const category = options.getChannel('category');
                    await ticket.create({
                        Guild: interaction.guild.id,
                        Category: category.id
                    });
                    await interaction.reply({ content: `I have set the category to **${category.name}**! Use /ticket send to send a ticket create message`, ephemeral: true });
                }

                break;
        }
    }
};
