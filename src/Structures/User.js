/* eslint-disable @hapi/hapi/scope-start */
'use strict';

// Main \\
class User {
    constructor(client, data) {
        this.client = client;

        this.id = data.id;
        this.createdAt = new Date(Number(BigInt(data.id) >> 22n) + 1420070400000);
        this.username = data.username;
        this.discriminator = data.discriminator;
        this.tag = `${data.username}#${data.discriminator}`;
        this.avatar = data.avatar;
        this.bot = Boolean(data.bot);
        this.system = Boolean(data.system);
        this.readyAt = null;
    }
}

// Exports \\
module.exports = User;
