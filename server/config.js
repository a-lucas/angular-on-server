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
            log:  {
                path: path.resolve( './logs/log.log'),
                stack: false
            },
            warn:  {
                path: path.resolve( './logs/warn.log'),
                stack: false
            },
            info: {
                path: path.resolve('./logs/info.log'),
                stack: false
            },
            error: {
                path: path.resolve('./logs/error.log'),
                stack: true
            },
        }

};
