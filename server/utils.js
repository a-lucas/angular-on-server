
export function getFiles(files) {
    const fileSrc = [];
    for(var i in files) {
        fileSrc[i] = fs.readFileSync(files[i] , 'utf8');
    }
    return fileSrc;
}


export function log() {
    var str = '';
    for(var i in arguments) {
        if (typeof arguments[i] === 'string' || typeof arguments[i] === 'number') { str = str + " " + arguments[i];}
    }
    console.log(str);
}

export function logObject(name, obj, level, force) {
    if (!force) force = false;
    if (!level) {
        level=0;
    }
    console.log('');
    console.log('///////////', name, '////////////');
    console.log('');

    if (typeof obj === 'string' || typeof obj === 'number') {
        console.log('value = ', obj);
    }


    if (typeof obj !== 'string') {

        for (var i in obj) {
            switch (typeof obj[i]) {
                case 'string':
                case 'number':
                    console.log('   ', i, '   =>   ', obj[i]);
                    break;
                case 'object':
                    if (level >=1) {
                        console.log('   ', i, '   =>   //// OBJECT ////');
                        logObject ( i,  obj[i], level -1, force);
                    } else {
                        console.log('   ', i, '   =>   ', typeof obj[i]);
                    }
                    break;
                case 'function':
                case 'undefined':
                    if (force) {
                        console.log('   ', i, '   =>   ', typeof obj[i]);
                    }
                    break;
                default:
                    console.log('   ', i, '   =>   ', typeof obj[i]);
            }
        }
    }
}

export function delay(ms, func) {
    return setTimeout(func, ms);
}

export function interval(ms, func) {
    return setInterval(func, ms);
}

export function  getClientHtml() {
    return fs.readFileSync('index.es7.html', 'utf8');
}

export function getServerHtml() {
    return fs.readFileSync('index.server.html', 'utf8');
}
