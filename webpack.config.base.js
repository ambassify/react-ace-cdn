'use strict';

var webpack = require('webpack');

module.exports = {
    module: {
        loaders: [
            { test: /\.jsx?$/, loaders: ['babel-loader'], exclude: /node_modules/ }
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
        extensions: ['', '.js']
    }
};
