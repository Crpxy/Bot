/* eslint-disable @hapi/hapi/scope-start */
'use strict';

// Main \\
module.exports = {
    run: async (client, data) => {
        await client.send({
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
            `Loaded ${client.events.size} events!`,
            `Loaded ${client.commands.length} commands!`,
        ].join('\n'));
    },
};
