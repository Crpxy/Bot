/* eslint-disable @hapi/hapi/scope-start */
'use strict';

// Imports \\
const Path = require('path');

const Event = require(Path.join(__dirname, '..', 'Structures', 'Class', 'Event.js'));

// Class \\
class Ready extends Event {
    async run(data) {
        await this.client.send({
            op: 3,
            d: {
                activities: [{
                    type: 3,
                    name: 'RainHub',
                }],
                afk: true,
                since: null,
                status: 'idle',
            },
        });

        console.log([
            `Logged in as ${data.user.username}#${data.user.discriminator}`,
            `Loaded ${this.client.events.size} events!`,
            `Loaded ${this.client.commands.size} commands!`,
        ].join('\n'));
    }
}

// Exports \\
module.exports = Ready;
