'use strict';

module.exports = {
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [ 'babel-loader' ],
            }
        ]
    },
    output: {
        library: 'ReactAce',
        libraryTarget: 'umd'
    },
    externals: {
        'react': {
            root: 'React',
            commonjs2: 'react',
            commonjs: 'react',
            amd: 'react'
        }
    },
    resolve: {
        extensions: [ '', '.js' ]
    }
};
