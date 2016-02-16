/**
 * Created by antoine on 16/02/16.
 */
import path from 'path';

export const logProvider = ($delegate) => {


    var logFile = fs.createWriteStream( logFiles.log, {
        flags: 'w'
    });
    var errorFile = fs.createWriteStream( logFiles.error, {
        flags: 'w'
    });

    var writeLog = function() {
        for (let i in arguments) {
            if (typeof arguments[i] === 'object') {
                logFile.write( JSON.stringify(arguments[i]) + ' - ');
            } else {
                logFile.write( arguments[i] + ' - ');
            }
        }
        logFile.write('\n');
    }

    var writeError = function() {

        for (let i in arguments) {
            if (typeof arguments[i] === 'object') {
                errorFile.write( JSON.stringify(arguments[i]) + ' - ');
            } else {
                errorFile.write( arguments[i] + ' - ');
            }
        }
        errorFile.write('\n');
    }

    return {

        log: function () {
            writeLog.apply(this, arguments);
            $delegate.log(arguments);
        },

        info: function () {
            writeLog.apply(this, arguments);
            $delegate.info(arguments);
        },

        error: function () {
            writeError.apply(this, arguments);
            $delegate.error(arguments);
        },

        warn: function () {
            writeError.apply(this, arguments);
            $delegate.warn(arguments);
        }
    };

};