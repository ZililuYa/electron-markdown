'use strict'

const path = require('path')
const pkg = require('./package.json')
const webpack = require('webpack')

let mainConfig = {
    entry: {
        main: __dirname+'/app/main.js'
    },
    externals: Object.keys(pkg.dependencies || {}),
    node: {
        __dirname: false,
        __filename: false
    },
    output: {
        filename: '[name].js',
        libraryTarget: 'commonjs2',
        path: __dirname+'/main.js'
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ],
    resolve: {
        extensions: ['.js', '.json', '.node'],
        modules: [
            path.join(__dirname, 'app/node_modules')
        ]
    },
    target: 'electron-main'
}

module.exports = mainConfig
