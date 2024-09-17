// ./events/ready.js
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const registerCommands = require('./registerCommands');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        // Database connection setup
        const db = mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
        });

        // Connect to the database
        db.connect((err) => {
            if (err) {
                console.error('Error connecting to the database:', err);
            } else {
                console.log('Connected to the database successfully.');
            }
        });

        // Ping the database to check the connection
        db.query('SELECT 1', (pingError) => {
            if (pingError) {
                console.error('Error pinging the database:', pingError);
            } else {
                console.log('Database pinged successfully.');
            }
        });

        // Close the database connection when the process exits
        process.on('SIGINT', () => {
            db.end((endError) => {
                if (endError) {
                    console.error('Error closing the database connection:', endError);
                } else {
                    console.log('Database connection closed.');
                    process.exit(0);
                }
            });
        });

        // Count the number of loaded commands
        const commandCount = client.commands.size;
        const serverCount = client.guilds.cache.size;
        const uniqueUsers = client.users.cache.size;

        // Trigger the refreshServers event
        const refreshServers = require('./refreshServers');
        await refreshServers.execute(client);

        // List the names of custom event files
        const eventFiles = fs.readdirSync(path.join(__dirname, '..', 'events')).filter(file => file.endsWith('.js') && file !== 'ready.js');

        console.log(`
        \x1b[31m                      _    _      _                   ____          _   
        \x1b[31m     /\\              | |  | |    (_)                 |  _ \\        | |  
        \x1b[31m    /  \\    ___  ___ | |_ | |__   _   __ _   ______  | |_) |  ___  | |_ 
        \x1b[31m   / /\\ \\  / _ \\/ __|| __|| '_ \\ | | / _\` | |______| |  _ <  / _ \\ | __|
        \x1b[31m  / ____ \\|  __/\\__ \\| |_ | | | || || (_| |          | |_) || (_) || |_ 
        \x1b[31m /_/    \\_\\___| |___/ \\__||_| |_||_| \\__,_|          |____/  \\___/  \\__|
        \x1b[0m
        `);

        // Display Aesthia information
        console.log(`
╭────────── Aesthia ───────────╮
│  Prefixes           │ /      │
│  Language           │ en-US  │
│  Aesthia version    │ 1.0    │
│  Discord.js version │ v14.0  │
│  Storage type       │ MarDB  │
│  ──────────────────────────  │
│  Shards             │ \x1b[33;1m${client.shard ? `(${client.shard.count})`.padStart(4) : '(1)'.padStart(6)}\x1b[0m │
│  Servers            │ \x1b[33;1m${`(${serverCount})`.padStart(6)}\x1b[0m │
│  Unique Users       │ \x1b[31;1m${`(${uniqueUsers})`.padStart(6)}\x1b[0m │
│  Commands Loaded    │ \x1b[34;1m${`(${commandCount})`.padStart(6)}\x1b[0m │
│  Custom Events      │ \x1b[34;1m${`(${eventFiles.length})`.padStart(6)}\x1b[0m │
╰──────────────────────────────╯
        `);

        console.log(`Logged in as ${client.user.tag}`);
        const inviteURL = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`;
        console.log(`Invite URL: \x1b[34;1m${inviteURL}`);

        registerCommands(client);

        // Fetch the guild ID from your .env file
        const guildId = process.env.GUILD_ID;

        // Create a new REST client
        const rest = new REST({ version: '10' }).setToken(client.token);

        // Get the list of your slash commands
        const commands = client.commands.map(command => command.data.toJSON());

        // Register the slash commands on the specified guild
    },
};