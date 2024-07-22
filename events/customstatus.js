const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        client.user.setActivity('/help', { type: ActivityType.Playing });
        console.log('Custom status set to "Playing /help"');
    },
};

