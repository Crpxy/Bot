/* eslint-disable @hapi/hapi/capitalize-modules */
/* eslint-disable no-unused-vars */
/* eslint-disable @hapi/hapi/scope-start */
'use strict';

// Imports \\
const path = require('path');
const os = require('os');
const ms = require('ms');
const { utc } = require('moment');
const Package = require('../../package.json');

// Main \\
module.exports = {
    description: 'Show the bot info',
    cooldown: 4,
    run: (client, __, toolkit) => {
        const uptime = ms(new Date() - client.user.readyAt, { long: true });
        const core = os.cpus()[0];

        return toolkit.info({
            title: 'BotInfo',
            fields: [
                {
                    name: 'General',
                    value: [
                        `**❯ Name:** \`${client.user.tag}\``,
                        `**❯ Developer:** \`CrpxyLab#2194\``,
                        `**❯ Uptime:** \`${uptime}\``,
                        `**❯ Creation Date:** \`${utc(client.user.createdAt).format('Do MMMM YYYY HH:mm:ss')}\``,
                        `**❯ Quartz:** \`v${Package.dependencies['@botsocket/quartz'].replace('^', '')}\``,
                        `**❯ Node.js:** \`${process.version}\``,
                    ].join('\n'),
                },
                {
                    name: 'System',
                    value: [
                        `**❯ Platform:** \`${process.platform}\``,
                        `**❯ Uptime:** \`${ms(os.uptime() * 1000, { long: true })}\``,
                        `**❯ CPU:**`,
                        `\u3000 **Cores:** \`${os.cpus().length}\``,
                        `\u3000 **Model:** \`${core.model}\``,
                        `\u3000 **Speed:** \`${core.speed}MHz\``,
                        `**❯ Memory:**`,
                        `\u3000 **Total:** \`${client.utils.formatBytes(process.memoryUsage().heapTotal)}\``,
                        `\u3000 **Used:** \`${client.utils.formatBytes(process.memoryUsage().heapUsed)}\``,
                    ].join('\n'),
                },
            ],
        });
    },
};
