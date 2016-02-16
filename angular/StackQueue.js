/**
 * Created by antoine on 15/02/16.
 */

export default  {
    httpBackend: [],
    timeouts: 0,
    promises: 0,
    initialized: false,
    done: false,
    timeoutValue: 500,
    timeout: null,

    add: function(object, type) {

        if (this.timeout !== null) {
            clearTimeout(this.timeout);
        }

        if (this.done === true) return;

        switch (type) {
            case 'httpBackend':
                this.httpBackend.push(
                    {
                        id: object.id,
                        when: Date.now()
                    }
                );
                break;
            case 'timeOout':
                this.timeouts++;
                break;
            case 'promise':
                this.promises++;
                break;
        }
    },
    resolve: function(object, type) {
        if (this.done === true) return;
        switch (type) {
            case 'httpBackend':
                for (var i in this.httpBackend) {
                    if ( this.httpBackend[i].id === object.id ) {
                        this.httpBackend.splice(i, 1);
                    }
                }
                break;
            case 'timeout':
                this.timeouts--;
                break;
            case 'promise':
                this.promises--;
                break;
        }


        if (this.timeout !== null) {
            clearTimeout(this.timeout);
        }

        if ( this.httpBackend.length === 0 && this.timeouts === 0 && this.promises === 0 ) {

            this.timeout = setTimeout(() => {
                if ( this.httpBackend.length === 0 && this.timeouts === 0 && this.promises === 0 ) {
                    const StackQueueEmpty = new Event('StackQueueEmpty');
                    window.dispatchEvent(StackQueueEmpty);
                    this.done = true;
                }
            }, this.timeoutValue);
        }

    }
}
