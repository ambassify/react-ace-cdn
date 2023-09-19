'use strict';

module.exports = {
    targets: 'extends @ambassify/browserslist-config',
    presets: [
        [ '@babel/preset-env', {
            bugfixes: true,
            modules: 'commonjs',
        } ],
        '@babel/preset-react'
    ]
};
