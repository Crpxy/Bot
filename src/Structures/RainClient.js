/* eslint-disable @hapi/hapi/scope-start */
'use strict';

// Imports \\
const { client } = require('@botsocket/quartz');

// const Api = require('./Api');
const Utils = require('./Utils.js');

// Main \\
class RainClient extends client {
    constructor(opt = {}) {
        super('wss://gateway.discord.gg', {
            token: opt.bot.token,
            intents: [
                'GUILDS',
                'GUILD_MEMBERS',
                'GUILD_MESSAGES',
            ],
        });

        this.events = new Map();
        this.commands = [];

        this.user = null;
        this.cmdInternals = null;

        this.config = opt;
        this.utils = new Utils(this);

        this.onDispatch = function (event, data) {
            this.utils.handleEvents(event, data);
        };

        this.login = async function () {
            await this.utils.loadEvents();
            await this.utils.loadCommands();
            await this.utils.registerCommand();
            this.connect();
        };
    }
}

// Exports \\
module.exports = RainClient;
