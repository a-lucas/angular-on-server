/**
 * This is the Angular Original ngView DIrective.
 **/
export default function($http, $templateCache, $route, $anchorScroll, $compile, $controller) {
    return {
        restrict: 'ECA',
        terminal: true,
        link: function (scope, element, attr) {

            //console.log('Directive Prerendered called', this);

            var lastScope,
                onloadExp = attr.onload || '';

            scope.$on('$routeChangeSuccess', update);
            update();


            function destroyLastScope() {
                if (lastScope) {
                    lastScope.$destroy();
                    lastScope = null;
                }
            }

            function clearContent() {
                element.html('');
                destroyLastScope();
            }

            function update() {
                var locals = $route.current && $route.current.locals,
                    template = locals && locals.$template;

               // console.log('template = ', template);

                if (template) {
                    element.html(template);
                    destroyLastScope();

                    var link = $compile(element.contents()),
                        current = $route.current,
                        controller;

                    lastScope = current.scope = scope.$new();
                    if (current.controller) {
                        locals.$scope = lastScope;
                        controller = $controller(current.controller, locals);
                        element.children().data('$ngControllerController', controller);
                    }

                    link(lastScope);
                    lastScope.$emit('$viewContentLoaded');
                    lastScope.$eval(onloadExp);

                    // $anchorScroll might listen on event...
                    $anchorScroll();
                } else {

                    //clearContent();
                }
            }
        }
    }
}