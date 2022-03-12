/* eslint-disable no-unused-vars */
/* eslint-disable require-await */
/* eslint-disable @hapi/hapi/scope-start */
'use strict';

// Main \\
class Command {
    constructor(client, name, opt={}) {
        this.client = client;
        this.name = name;
        this.description = opt.description || null
        this.cooldown = opt.cooldown || null
        this.perm = opt.perm || []
        this.roles = opt.roles || []
        this.owner = opt.owner || false
    }

    async run(...args) {
		throw new Error(`[RainHub] > Command ${this.name} doesn't have a run function!`);
    }
}

// Export \\
module.exports = Command;
