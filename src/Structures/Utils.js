/* eslint-disable padding-line-between-statements */
/* eslint-disable no-unsafe-negation */
/* eslint-disable @hapi/hapi/scope-start */
/* eslint-disable require-await */
'use strict';

// Imports \\

const { promisify } = require('util');

const Path = require('path');
const Glob = promisify(require('glob'));

const Jade = require('@botsocket/jade');
const Bone = require('@botsocket/bone');

const Api = require('./Api.js');

// Class \\
class Utils {
    constructor(client) {
        this.client = client;
        this.client.cmdInternals = {
            commands: {},
            types: {
                string: 3,
                number: 4,
                boolean: 5,
            },
        };
    }

    isOwners(id) {
        return this.client.config.bot.owners.includes(id);
    }

    formatBytes(bytes) {
        if (bytes === 0) {
            return '0 Bytes';
        }
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${parseFloat((bytes / 1024 ** i).toFixed(2))} ${sizes[i]}`;
    }

    registerCommand() {
        const definitions = this.client.commands;

        for (const def of definitions) {
            if (def.options) {
                def.options = Jade.object(def.options);
            }

            this.client.cmdInternals.commands[def.name] = def;
        }

        const commands = [];
        for (const def of definitions) {
            const command = { ...def };
            commands.push(command);

            delete command.run;

            if (!command.options) {
                continue;
            }

            const schema = command.options;
            const desc = schema.describe();
            const options = desc.keys;
            const discordOptions = [];

            for (const key of Object.keys(options)) {
                const item = options[key];
                const type = this.client.cmdInternals.types[item.type];

                Bone.assert(type, `Unsupported type ${item.type} for option ${key}`);

                const option = { type, name: key };
                discordOptions.push(option);

                Bone.assert(item.notes, `Missing description for option ${key}`);
                option.description = item.notes[0];

                if (item.flags) {
                    if (item.flags.label) {
                        option.name = item.flags.label;
                    }

                    if (item.flags.presence === 'required') {
                        option.required = true;
                    }

                    if (item.flags.only && item.flags.allows) {
                        Bone.assert(item.allows.length <= 10, `Option ${key} has more than 10 choices`);

                        option.choices = item.allows.map((choice) => {
                            return { name: choice, value: choice };
                        });
                    }
                }
            }

            command.options = discordOptions;
        }

        const url = `/applications/${this.client.config.bot.app}/guilds/${this.client.config.bot.guild}/commands`;
        const promises = commands.map((cmd) => {
            return Api.post(url, {
                payload: cmd,
            });
        });

        return Promise.all(promises);
    }

    handleEvents(event, data) {
        const Event = this.client.events.get(event);
        if (Event) {
            Event.run(this.client, data);
        }
    }

    async loadEvents() {
        return Glob(`${Path.join(__dirname, '..', 'Events')}/**/*.js`).then((events) => {
            for (const file of events) {
                delete require.cache[file];
                const { name } = Path.parse(file);
                const event = require(file);

                if (!event.name) {
                    event.name = name.toUpperCase();
                }

                this.client.events.set(event.name.toUpperCase(), event);
            }
        });
    }

    async loadCommands() {
        return Glob(`${Path.join(__dirname, '..', 'Commands')}/**/*.js`).then((cmds) => {
            for (const file of cmds) {
                delete require.cache[file];
                const { name } = Path.parse(file);
                const cmd = require(file);

                if (!cmd.name) {
                    cmd.name = name.toLowerCase();
                }

                this.client.commands.push(cmd);
            }
        });
    }
}

// Exports \\
module.exports = Utils;
