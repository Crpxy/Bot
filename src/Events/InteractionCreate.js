/* eslint-disable @hapi/hapi/scope-start */
'use strict';

// Imports \\
const Toolkit = require('../Structures/Toolkit');

// Main \\
module.exports = {
    name: 'INTERACTION_CREATE',
    run: async (client, data) => {
        const def = client.cmdInternals.commands[data.data.name];
        if (!def) {
            return;
        }

        const command = {
            id: data.data.id,
            name: data.data.name,
            interaction: {
                id: data.id,
                token: data.token,
            },
            channel: data.channel_id,
            member: data.member,
            guild: data.guild_id,
        };

        const toolkit = new Toolkit(command);

        if (data.data.options) {
            command.options = {};

            for (const option of data.data.options) {
                command.options[option.name] = option.value;
            }

            const res = def.options.validate(command.options);
            if (res.errors) {
                return toolkit.error({
                    title: 'Failed to process your command',
                    description: `We detected a malformed option in your command: \`\`\`${res.errors[0].message}\`\`\``,
                });
            }

            command.options = res.value;
        }

        try {
            await def.run(client, command, toolkit);
        }
        catch (err) {
            console.error(err);
        }
    },
};
