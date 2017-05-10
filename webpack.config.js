var webpack = require('webpack');

module.exports = {
    //插件项
    //页面入口文件配置
    entry: {
        index: __dirname + '/app/main.js'
    },
    //入口文件输出配置
    output: {
        path: __dirname,
        filename: '[name].js'
    }, node: {
        fs: "empty"
    },
    // target: 'node',
    target: "electron"
};