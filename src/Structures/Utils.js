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

const EventClass = require(Path.join(__dirname, 'Class', 'Event.js'));
const CmdClass = require(Path.join(__dirname, 'Class', 'Command.js'));

// Class \\
class Utils {
    constructor(client) {
        this.client = client;
        this.internals = {
            commands: {},
            types: {
                string: 3,
                number: 4,
                boolean: 5,
            },
        };
    }

    isClass(c) {
        return typeof (c) === 'function' && typeof (c.prototype) === 'object' && c.toString().substring(0, 5) === 'class';
    }

    isOwners(id) {
        return this.client.config.bot.owners.includes(id);
    }

    registerCommand() {
        const definitions = this.client.commands;

        for (const def of definitions) {
            if (def.options) {
                def.options = Jade.object(def.options);
            }

            this.internals.commands[def.name] = def;
        }

        const commands = [];
        for (const def of definitions) {
            const command = { ...def };

            delete command.handler;

            if (!command.options) {
                continue;
            }

            const schema = command.options;
            const desc = schema.describe();
            const options = desc.keys;
            const discordOptions = [];

            for (const key of Object.keys(options)) {
                const item = options[key];
                const type = this.internals.types[item.type];

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

        const promises = commands.map((cmd) => {
            return Api.post(`/applications/${this.client.config.bot.app}/guilds/${this.client.config.bot.guild}/commands`, {
                payload: cmd,
            });
        });

        return promises.all(promises);
    }

    handleEvents(event, data) {
        const Event = this.client.events.get(event);
        if (Event) {
            Event.run(data);
        }
    }

    async loadEvents() {
        return Glob(`${Path.join(__dirname, '..', 'Events')}/**/*.js`).then((events) => {
            for (const file of events) {
                delete require.cache[file];
                const { name } = Path.parse(file);
                const eventFile = require(file);

                if (!this.isClass(eventFile)) {
                    throw new TypeError(`[RainHub] > Event ${name} is not a class`);
                }

                const event = new eventFile(this.client, name);
                if (!event instanceof (EventClass)) {
                    throw new TypeError(`[RainHub] > Event ${name}  doesnt belong in Event Class.`);
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
                const cmdFile = require(file);

                if (!this.isClass(cmdFile)) {
                    throw new TypeError(`[RainHub] > Command ${name} is not a class`);
                }

                const cmd = new cmdFile(this.client, name.toLowerCase());

                if (!cmd instanceof (CmdClass)) {
                    throw new TypeError(`[RainHub] > Command ${name}  doesnt belong in Command Class.`);
                }

                this.client.commands.set(cmd.name, cmd);
            }
        });
    }
}

// Exports \\
module.exports = Utils;
