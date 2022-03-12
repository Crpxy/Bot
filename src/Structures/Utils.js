/* eslint-disable no-unsafe-negation */
/* eslint-disable @hapi/hapi/scope-start */
/* eslint-disable require-await */
'use strict';

// Imports \\
const { promisify } = require('util');

const Path = require('path');

const Glob = promisify(require('glob'));

const EventClass = require(Path.join(__dirname, 'Class', 'Event.js'));

// Class \\
class Utils {
    constructor(client) {
        this.client = client;
    }

    isClass(c) {
        return typeof (c) === 'function' && typeof (c.prototype) === 'object' && c.toString().substring(0, 5) === 'class';
    }

    isOwners(id) {
        return this.client.config.bot.owners.includes(id);
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
        return;
    }
}

// Exports \\
module.exports = Utils;
