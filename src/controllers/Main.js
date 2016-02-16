/**
 * Created by antoine on 9/02/16.
 */

class MainCtrl {
    constructor($log){
        $log.log('I am a log', 'with two parameters');
        var test = {
            name: 'value'
        };

        $log.error('I am outpuing an object', test);

    }

    title = 'Angular Es6 revisited';
}
export default MainCtrl;