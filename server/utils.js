/**
 * Created by antoine on 16/02/16.
 */

var Contextify = require('contextify');
var fs = require('fs');

exports.getContext = function(){
    c_window = Contextify({
        console : console
    });
    c_window.window = c_window.getGlobal();
    c_window.window.fs = fs;
    return c_window;
}