const { REST } = require('@discordjs/rest'); // Import REST from discord.js
const { Routes } = require('discord-api-types/v10'); // Import Routes from discord-api-types
const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js'); // Import necessary classes from discord.js
const fs = require('fs').promises; // Import fs with promises
const path = require('path'); // Import path module
const registerCommands = require('../../events/registerCommands'); // Import the registerCommands function

async function getCommandFiles(dir) {
    const subdirs = await fs.readdir(dir);
    const files = await Promise.all(subdirs.map(async (subdir) => {
        const res = path.resolve(dir, subdir);
        return (await fs.stat(res)).isDirectory() ? getCommandFiles(res) : res;
    }));
    return files.flat().filter(file => file.endsWith('.js'));
}

async function reloadCommands(client) {
    let errorMessages = []; // Initialize an array to store error messages

    try {
        // Clear the commands collection
        client.commands.clear();

        // Get all command files in the commands directory and its subdirectories
        const commandFiles = await getCommandFiles(path.join(__dirname, '..', '..', 'commands'));

        // Load each command file
        await Promise.all(commandFiles.map(async (file) => {
            try {
                // Clear the require cache
                delete require.cache[require.resolve(file)];
                // Require the command file
                const command = require(file);
                // Set the command in the client's commands collection
                client.commands.set(command.data.name, command);
            } catch (error) {
                console.error(`Error loading command ${file}:`, error);
                errorMessages.push(`Error loading command ${file}: ${error.message}`);
            }
        }));

        // Register the commands with Discord
        await registerCommands(client);
    } catch (error) {
        console.error('Error reloading commands:', error);
        errorMessages.push(`Error reloading commands: ${error.message}`);
    }

    // If there are any error messages, throw an error
    if (errorMessages.length > 0) {
        throw new Error(errorMessages.join('\n'));
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload') // Set the command name to 'reload'
        .setDescription('Reloads all commands') // Set the command description
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator), // Require admin permission

    async execute(interaction, client) {
        // Create an embed message indicating the start of the reload process
        const embed = new EmbedBuilder()
            .setColor('#00ff00') // Set the embed color to green
            .setTitle('Reloading Commands') // Set the embed title
            .setDescription('Reloading all commands, please wait...'); // Set the embed description

        // Send the initial reply
        await interaction.reply({ embeds: [embed], ephemeral: true });

        try {
            // Reload the commands
            await reloadCommands(client);

            // Create a success embed message
            const successEmbed = new EmbedBuilder()
                .setColor('#00ff00') // Set the embed color to green
                .setTitle('Commands Reloaded') // Set the embed title
                .setDescription('All commands have been successfully reloaded.'); // Set the embed description

            // Edit the initial reply to include the success embed
            await interaction.editReply({ embeds: [successEmbed] });
        } catch (error) {
            // Create an error embed message
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000') // Set the embed color to red
                .setTitle('Error Reloading Commands') // Set the embed title
                .setDescription(`There was an error while reloading the commands:\n${error.message}`); // Set the embed description with the error message

            // Edit the initial reply to include the error embed
            await interaction.editReply({ embeds: [errorEmbed] });
        }
    },
};