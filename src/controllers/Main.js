/**
 * Created by antoine on 9/02/16.
 */
import {TestDecorator} from './decorators';

class MainCtrl {
    constructor($log){
        console.log($log);
        $log.log('test');
//        this.someMethod();
        console.log('MMainCntl Loaded', this);
    }

    title = 'Angular Es6 revisited';
}
export default MainCtrl;