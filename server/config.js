/**
 * Created by antoine on 15/02/16.
 */
var path = require('path');

exports.clientConfig = {
    appname: 'myApp',
    bootstrap: false //if set to number, will bootstrap after setTimeout(number)

};

exports.serverConfig = {
        appname: 'myApp',
        timeout: 60000,
        port: 3002,
        views: {
            viewRoot: './../src/views',
            viewRegex: /\.html/i
        },
        logFiles: {
            log:  path.resolve( './logs/log.log'),
            warn: path.resolve( './logs/warn.log'),
            info: path.resolve('./logs/info.log'),
            error: path.resolve('./logs/error.log')
        }

};
