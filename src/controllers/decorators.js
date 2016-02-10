

export function Controller() {

    return function(target, key, descriptor) {

        target.constructor = ($scope) => {
            target.scope = $scope;
        }
        console.log('decorator = ', target.constructor);
        return target;
    }
}

export function bound(...args) {
    console.log('ARGUMENST LENGTH + ', args.length);

    if (args.length === 1) {
        return boundClass(...args);
    } else {
        console.log(args);
        throw 'PB';
    }
}

/**
 * Use boundMethod to bind all methods on the constructor.prototype
 */
function boundClass(constructor) {
    // (Using reflect to get all keys including symbols)
    Reflect.ownKeys(constructor.prototype).forEach(key => {
        // Ignore special case constructor method
        console.log('Checing key = ', key);

        if (key === 'constructor') return;

        var descriptor = Object.getOwnPropertyDescriptor(constructor.prototype, key);

        // Only methods need binding
        if (typeof descriptor.value === 'function') {
            console.log('Bonding a function (for what??')
            Object.defineProperty(constructor.prototype, key, boundMethod(constructor, key, descriptor));
        }
    });
    return constructor;
}


/*(
    }target, key, descriptor) {
        console.log("Decorator called: ", target, key, descriptor);
        for(var i in target) {
            console.log(i);
        }
        target = Object.assign({},  target, target.$scope )

        console.log(ttarget);

        return target;
    };

}*/