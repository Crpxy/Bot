/* eslint-disable @hapi/hapi/scope-start */
'use strict';

module.exports = {
    name: 'READY',
    run: (client, data) => {
        console.log([
            `Logged in as ${data.user.username}#${data.user.discriminator}`,
            `Loaded ${client.events.size} events!`,
        ].join('\n'));
    },
};
