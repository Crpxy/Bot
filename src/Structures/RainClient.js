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
        this.commands = new Map();

        this.config = opt;
        this.utils = new Utils(this);

        this.user = null;

        this.onDispatch = function (event, data) {
            this.utils.handleEvents(event, data);
        };

        this.login = function () {
            this.utils.loadEvents();

            this.connect();
        };
    }
}

// Exports \\
module.exports = RainClient;
