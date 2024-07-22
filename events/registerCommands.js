// ./registerCommands.js
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

module.exports = async (client) => {
    const guildId = process.env.GUILD_ID;
    const rest = new REST({ version: '10' }).setToken(client.token);
    const commands = client.commands.map((command) => command.data.toJSON());

    try {
        await rest.put(
            Routes.applicationGuildCommands(client.user.id, guildId),
            { body: commands }
        );
        return commands.length; // Return the count of registered commands
    } catch (error) {
        console.error(error);
        return 0; // Return 0 in case of an error
    }
};
