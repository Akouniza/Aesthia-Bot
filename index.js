// Load environment variables from a .env file (dotenv)
require('dotenv').config();

// Import necessary modules and libraries
const { Client, GatewayIntentBits, Collection } = require('discord.js'); // Import Discord.js components
const fs = require('fs'); // File system module
const path = require('path'); // Path module for working with file paths
const { REST } = require('@discordjs/rest'); // REST module for interacting with Discord API
const { Routes } = require('discord-api-types/v10'); // Routes module for defining API routes

// Create a new Discord client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, // Allow access to information about servers (guilds)
        GatewayIntentBits.GuildMembers, // Allow access to information about members in servers
        GatewayIntentBits.GuildMessages, // Allow access to incoming messages in servers
        GatewayIntentBits.MessageContent // Allow access to message content
    ]
});

// Create a collection to store bot commands
client.commands = new Collection();

// Function to load bot commands from a directory
function loadCommands(directory) {
    // Read all files in the specified directory that end with .js
    const commandFiles = fs.readdirSync(path.join(__dirname, directory)).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(__dirname, directory, file);
        const command = require(filePath); // Load the command module

        // Store the loaded command in the collection using its name (without .js extension) as the key
        client.commands.set(command.data.name, command);
    }
}

// Load commands from the 'commands/moderations' and 'commands/utils' directories
loadCommands('commands/moderations');
loadCommands('commands/utils');

// Event handler for interactionCreate
const eventFiles = fs.readdirSync(path.join(__dirname, 'events')).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(path.join(__dirname, 'events', file)); // Load event handler module
    // Attach event handlers to client events
    client.on(event.name, (...args) => event.execute(...args, client));
}

// Log in to Discord using the bot's token from the environment variables
client.login(process.env.DISCORD_TOKEN);
