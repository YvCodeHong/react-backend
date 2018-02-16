const path = require('path');
const webpack = require('webpack');
const { public_js_dir, server_js_dir } = require('./config');

const serverConfig = {
    name: 'server',
    target: 'node',
    entry: path.join(__dirname, '../server/Server.jsx'),
    output: {
        path: server_js_dir,
        filename: 'server.js',
        libraryTarget: 'commonjs2',
        publicPath: ''
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.(jsx|e\.js)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: path.join(__dirname, '../../../build/cache')
                        }
                    }
                ]
            }
        ]
    }
}

const clientConfig = {
    name: 'client',
    target: 'web',
    entry: path.join(__dirname, '../client/client.jsx'),
    output: {
        path: public_js_dir,
        filename: 'client.js',
        publicPath: '/js/'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader'
                    }
                ]
            }
        ]
    }
}

module.exports = [clientConfig, serverConfig];