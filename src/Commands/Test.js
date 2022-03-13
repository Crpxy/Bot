/* eslint-disable no-unused-vars */
/* eslint-disable @hapi/hapi/scope-start */
'use strict';

// Main \\
module.exports = {
    description: 'test',
    run: (_, __, toolkit) => {
        return toolkit.info({
            title: 'Test',
            description: 'test ok!',
        });
    },
};
