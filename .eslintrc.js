'use strict';

module.exports = {
    settings: {
        react: {
            version: 'detect'
        }
    },
    extends: [
        'ambassify/lodash',
    ],
    overrides: [
        {
            files: [
                'src/**/*.js',
            ],
            extends: [
                'ambassify/browser',
                'ambassify/react',
            ]
        },
        {
            files: [
                'scripts/**/*.js',
                './*.js',
            ],
            extends: [
                'ambassify/node',
                'ambassify/strict',
            ],
            rules: {
                'no-console': 0,
                'n/no-process-exit': 0
            }
        },
        {
            files: [
                'test/**/*.js',
            ],
            env: {
                browser: true,
                node: true,
            },
            extends: [
                'ambassify/react',
                'ambassify/browser',
                'ambassify/mocha',
            ]
        }
    ]
};
