/* eslint-disable @hapi/hapi/scope-start */
'use strict';

// Imports \\
const { promisify } = require('util');

const Path = require('path');

const Glob = promisify(require('glob'));


// Class \\
class Utils {
    constructor(client) {
        this.client = client;
    }

    handleEvents(event, data) {
        const Event = this.client.events.get(event);
        if (Event) {
            Event.run(this.client, data);
        }
    }

    // eslint-disable-next-line require-await
    async loadEvents() {
        return Glob(`${Path.join(__dirname, '..', 'Events')}/*.js`).then((events) => {
            for (const file of events) {
                const event = require(file);

                this.client.events.set(event.name, event);
            }
        });
    }
}

// Exports \\
module.exports = Utils;
