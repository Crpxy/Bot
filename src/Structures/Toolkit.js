/* eslint-disable @hapi/hapi/scope-start */
'use strict';

// Imports \\
const Bone = require('@botsocket/bone');

const Api = require('./Api.js');
const Config = require('../../config.json');

const internals = {
    modes: ['success', 'warn', 'error', 'info'],
};

// Main \\
class Toolkit {
    constructor(command) {
        this._command = command;
    }

    respond(data) {
        const payload = {
            type: 4,
            data: data,
        };

        const int = this._command.interaction;
        const url = `/interactions/${int.id}/${int.token}/callback`;

        // console.log(payload)
        return Api.post(url, { payload });
    }
}

for (const mode of internals.modes) {
    Toolkit.prototype[mode] = function (embed) {
        Bone.assert(typeof embed === 'object', 'Embed must be an object');

        const decorated = internals.embed(embed, mode);
        return this.respond({ embeds: [decorated] });
    };
}

// Functions \\
internals.embed = function (embed, mode) {
    embed.footer = {
        text: embed.footer || Config.bot.embed.footer,
    };
    embed.timestamp = embed.timestamp || new Date();
    embed.color = parseInt(Config.bot.embed.colors[mode].replace('#', ''), 16);

    return embed;
};

// Exports \\
module.exports = Toolkit;
