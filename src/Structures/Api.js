'use strict';

const Bornite = require('@botsocket/bornite');

const Config = require('../../config.json');
const Package = require('../../package.json');

module.exports = Bornite.custom({
    baseUrl: 'https://discord.com/api/v8',
    validateStatus: true,
    headers: {
        Authorization: `Bot ${Config.bot.token}`,
        'User-Agent': `DiscordBot, (https://botsocket.com, ${Package.version}`,
    },
});
