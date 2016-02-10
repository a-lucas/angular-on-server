/**
 * Created by antoine on 9/02/16.
 */
var angularcontext = require('angularcontext');

var context = angularcontext.Context();


context.runFiles([
    './node_modules/angular/angular.js',
    './node_modules/angular-resource/angular-resource.js',
    './node_modules/angular-route/angular-route.js',
    './dist/client/app.js'
],
    function (result, error) {
        if (error) {
            console.error(error);
        }
        else {
            var injector = context.injector(['ng']);

            injector.invoke(
                function ($rootScope, $compile) {

                    // Compile a template.
                    var link = $compile(
                        '<html ng-app="myApp"><body ><div prerendered></div></body></html>'
                    );

                    // Link the template to the scope to create a data-bound element.
                    var element = link($rootScope);

                    injector.bootstrap(element, ['myApp']);


                    console.log(element);

                    console.log(element.html());


                });

        }
    });
