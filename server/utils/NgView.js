export default function ($route, $anchorScroll, $compile, $controller, $animate) {
    return {
        restrict: 'ECA',
        terminal: true,
        priority: 1000,
        transclude: 'element',
        compile: function (element, attr, linker) {
            return function (scope, $element, attr) {
                var currentScope,
                    currentElement,
                    onloadExp = attr.onload || '';

                function cleanupLastView() {
                    if (currentScope) {
                        currentScope.$destroy();
                        currentScope = null;
                    }
                    if (currentElement) {
                        $animate.leave(currentElement);
                        currentElement = null;
                    }
                }

                function update() {
                    var locals = $route.current && $route.current.locals,
                        template = locals && locals.$template;

                    if (template !== undefined) {
                        var newScope = scope.$new();
                        linker(
                            newScope,
                            function (clone) {
                                cleanupLastView();

                                clone.html(template);
                                $animate.enter(clone, null, $element);

                                var link = $compile(clone.contents()),
                                    current = $route.current;

                                currentScope = current.scope = newScope;
                                currentElement = clone;

                                if (current.controller) {
                                    locals.$scope = currentScope;
                                    var controller = $controller(current.controller, locals);
                                    if (current.controllerAs) {
                                        currentScope[current.controllerAs] = controller;
                                    }
                                    clone.data('$ngControllerController', controller);
                                    clone.children().data('$ngControllerController', controller);
                                }

                                link(currentScope);
                                currentScope.$emit('$viewContentLoaded');
                                currentScope.$eval(onloadExp);

                                // $anchorScroll might listen on event...
                                $anchorScroll();
                            }
                        );
                    } else {
                        cleanupLastView();
                    }
                }

                scope.$on('$routeChangeSuccess', update);
                update();

            };
        }
    };
}