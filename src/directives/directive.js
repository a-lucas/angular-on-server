/**
 * Created by antoine on 10/02/16.
 */
const dependencies = {};

class Directive {


    constructor() {
        const name = this.constructor.name;
        if ( typeof dependencies[name] === 'undefined') {
            dependencies[name] = {
                arguments: arguments
            };
        }
    }
}
