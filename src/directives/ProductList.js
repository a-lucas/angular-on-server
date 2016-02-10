export default function($http) {
    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        //scope: { products: { data: [ { name: 'test', price: 1 }] } },
        template: '<li ng-repeat="product in products">{{product.name}} {{product.price}}</li>',
        link: function (scope, element, attrs) {
            $http.get('/products').success(function (data) {
                console.log(data);
                scope.products = data;
            });
        }
    };
};

/*

class ProductList {

    constructor($http) {
        this.restrict = 'E';
        this.replace = true;
        this.transclude = false;
        this.template = '<li ng-repeat="product in products">{{product.name}} {{product.price}}</li>';
        //this.templateUrl = 'messages.html'
        this.scope = {}
    }

    controller($http) {

        //this.$inject = ['$http'];
        this.http = $http;
    }


    link(scope, element, attrs) {
        this.http.get('/products').success((data) => {
            console.log(data);
            this.products = data;
        });
    }
}

ProductList.compile = (tElement) => {

};

export default ProductList;
*/