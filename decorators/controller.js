class Controller {

    construct(dependencies, overwrite) {
        this.$inject(['$klog']);
        let type;
        for ( var i in dependencies) {
            if (typeof this[i] !== 'undefined') {
                if (overwrite) {
                    $log.warn('overwritting this');
                }
                $log.error('overwritting property - set overwrite = true.  " ', i, this[i],  '"');
                return;
            }
            type = typeof dependencies[i];

            switch (type) {
                case 'string':
                case 'number':
                    this[i] = dependencies[i];
                    break;
            }
        }
    }
}

export default Controller;
