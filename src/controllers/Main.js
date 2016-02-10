/**
 * Created by antoine on 9/02/16.
 */

export default class MainCtrl {
    /*@ngInject*/
    constructor($http, $animate){
        console.log('MMainCntl Loaded', this);
        this.http = $http;
        this.animate = $animate;
    }

    title = 'Angular Es6 revisited';
}


