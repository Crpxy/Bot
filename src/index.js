'use strict';

// Imports \\
const RainClient = require('./Structures/RainClient.js');
const Config = require('../config.json');

// Main \\
const client = new RainClient(Config);

client.login();
