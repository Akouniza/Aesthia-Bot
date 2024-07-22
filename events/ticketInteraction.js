const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, ChannelType, EmbedBuilder, ButtonBuilder, PermissionsBitField, ButtonStyle } = require('discord.js');
const ticket = require('../database/models/ticketSchema');
const { createTranscript } = require('discord-html-transcripts');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.customId === 'ticketCreateSelect') {
            const userId = interaction.user.id;
            const modal = new ModalBuilder()
                .setTitle(`Create your ticket`)
                .setCustomId(interaction.values[0] === 'test12345' ? 'testTicketModal' : 'ticketModal');

            const why = new TextInputBuilder()
                .setCustomId('whyTicket')
                .setRequired(true)
                .setPlaceholder('What is the reason for creating this ticket')
                .setLabel('Why are you creating this ticket?')
                .setStyle(TextInputStyle.Paragraph);

            const info = new TextInputBuilder()
                .setCustomId('infoTicket')
                .setRequired(false)
                .setPlaceholder('Feel free to leave this blank')
                .setLabel('Provide us with any additional information')
                .setStyle(TextInputStyle.Paragraph);

            const one = new ActionRowBuilder().addComponents(why);
            const two = new ActionRowBuilder().addComponents(info);

            modal.addComponents(one, two);
            await interaction.showModal(modal);
        } else if (interaction.customId === 'ticketModal' || interaction.customId === 'testTicketModal') {
            const isTestTicket = interaction.customId === 'testTicketModal';
            const user = interaction.user;
            const data = await ticket.findOne({ Guild: interaction.guild.id });
            if (!data) return await interaction.reply({ content: `Sorry! Looks like you found this message but the ticket system is not yet set up here.`, ephemeral: true });

            const why = interaction.fields.getTextInputValue('whyTicket');
            const info = interaction.fields.getTextInputValue('infoTicket');
            const category = await interaction.guild.channels.cache.get(data.Category);

            const channelName = isTestTicket ? `test-${user.id}` : `ticket-${user.id}`;
            const channel = await interaction.guild.channels.create({
                name: channelName,
                type: ChannelType.GuildText,
                topic: `Ticket user: ${user.username}; Ticket reason: ${why}`,
                parent: category.id,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel]
                    },
                    {
                        id: user.id,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
                    }
                ]
            });

            const embed = new EmbedBuilder()
                .setColor("Blurple")
                .setTitle(`${isTestTicket ? 'Test' : ''} Ticket from ${user.username}`)
                .setDescription(`Opening Reason: ${why}\n\nExtra Information: ${info}`)
                .setTimestamp();

            const closeButton = new ButtonBuilder()
                .setCustomId('closeTicket')
                .setLabel('Close Ticket')
                .setStyle(ButtonStyle.Danger);

            const transcriptButton = new ButtonBuilder()
                .setCustomId('ticketTranscript')
                .setLabel('Transcript')
                .setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder()
                .addComponents(closeButton, transcriptButton);

            await channel.send({ embeds: [embed], components: [row] });
            await interaction.reply({ content: `Your ${isTestTicket ? 'test ' : ''}ticket has been opened in ${channel}`, ephemeral: true });
        
        } else if (interaction.customId == 'ticketModal') {
            const user = interaction.user;
            const data = await ticket.findOne({ Guild: interaction.guild.id });
            if (!data) return await interaction.reply({ content: `Sorry! Looks like you found this message but the ticket system is not yet set up here.`, ephemeral: true });

            const why = interaction.fields.getTextInputValue('whyTicket');
            const info = interaction.fields.getTextInputValue('infoTicket');
            const category = await interaction.guild.channels.cache.get(data.Category);

            const channel = await interaction.guild.channels.create({
                name: `ticket-${user.id}`,
                type: ChannelType.GuildText,
                topic: `Ticket user: ${user.username}; Ticket reason: ${why}`,
                parent: category.id,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel]
                    },
                    {
                        id: user.id,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
                    }
                ]
            });

            const embed = new EmbedBuilder()
                .setColor("Blurple")
                .setTitle(`Ticket from ${user.username}`)
                .setDescription(`Opening Reason: ${why}\n\nExtra Information: ${info}`)
                .setTimestamp();

            const closeButton = new ButtonBuilder()
                .setCustomId('closeTicket')
                .setLabel('Close Ticket')
                .setStyle(ButtonStyle.Danger);

            const transcriptButton = new ButtonBuilder()
                .setCustomId('ticketTranscript')
                .setLabel('Transcript')
                .setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder()
                .addComponents(closeButton, transcriptButton);

            await channel.send({ embeds: [embed], components: [row] });
            await interaction.reply({ content: `Your ticket has been opened in ${channel}`, ephemeral: true });
        } else if (interaction.customId == 'closeTicket') {
            const closeModal = new ModalBuilder()
                .setTitle(`Ticket Closing`)
                .setCustomId('closeTicketModal');
    
            const reason = new TextInputBuilder()
                .setCustomId('closeReasonTicket')
                .setRequired(true)
                .setPlaceholder('What is the reason for closing this ticket?')
                .setLabel('Provide a closing reason')
                .setStyle(TextInputStyle.Paragraph);
    
            const one = new ActionRowBuilder().addComponents(reason);
    
            closeModal.addComponents(one);
            await interaction.showModal(closeModal);
        } else if (interaction.customId == 'closeTicketModal') {
            const channel = interaction.channel;
            let memberId;
            if (channel.name.startsWith('ticket-')) {
                memberId = channel.name.replace('ticket-', '');
        } else if (channel.name.startsWith('test-')) {
                memberId = channel.name.replace('test-', '');
        }
            const member = await interaction.guild.members.fetch(memberId);

            const reason = interaction.fields.getTextInputValue('closeReasonTicket');
            await interaction.reply({ content: `Closing this ticket...` });

            setTimeout(async () => {
                await channel.delete().catch(err => console.error(err));
                await member.send(`You are receiving this notification because your ticket in ${interaction.guild.name} has been closed for: \`${reason}\``).catch(err => {});
            }, 5000);
        } else if (interaction.customId == 'ticketTranscript') {
            const file = await createTranscript(interaction.channel, {
                limit: -1,
                returnBuffer: false,
                filename: `${interaction.channel.name}.html`
            });
        
            const msg = await interaction.channel.send({ content: `Your transcript cache:`, files: [file] });
            const message = `**Here is your [ticket transcript](https://mahto.id/chat-exporter?url=${msg.attachments.first()?.url}) from ${interaction.guild.name}!**`;
            await interaction.reply({ content: message, ephemeral: true });
        }
    }
};