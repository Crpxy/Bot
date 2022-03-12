/* eslint-disable no-unused-vars */
/* eslint-disable require-await */
/* eslint-disable @hapi/hapi/scope-start */
'use strict';

// Main \\
class Event {
    constructor(client, name) {
        this.client = client;
        this.name = name;
    }

    async run(...args) {
		throw new Error(`[RainHub] > Event ${this.name} doesn't have a run function!`);
    }
}

// Export \\
module.exports = Event;
