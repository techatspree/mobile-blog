'use strict';

angular.module('MobileDirectives', ['MobileControllers']).


    directive('onTap', [function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs, controller) {
                $(element[0]).tap(function() {
                    console.log(this);
                    angular.element(this).css("background", "#e2e2e2");
                });
            }
        }
    }]).

    directive('scrollContainer', ['$window', '$timeout', function($window, $timeout) {

        return {
            restrict: 'A',
            link: function(scope, element, attrs, controller) {
                var scrollContainer;

                $timeout(function() {
                    console.log("init");
                    scrollContainer = new iScroll(element[0], { hideScrollbar: true });
                    refresh();
                }, 100);


                function refresh() {
                    $timeout(function() {
                        console.log("refresh");
                        scrollContainer.refresh();
                    }, 300);
                }

                document.addEventListener('touchmove', function (e) {
                    e.preventDefault();
                }, false);


                window.onorientationchange = function() {
                    console.log("on orient.....");
                    refresh();
                };

            }
        }
    }]).

    directive('myView', function ($http, $templateCache, $route, $anchorScroll, $compile, $controller, $rootScope, $timeout) {
        return {
            restrict:'ECA',
            terminal:true,
            link:function (scope, parentElm, attr) {
                var TRANSITION_TIME = 500
                                                     ,
                    partials = [],
                    inClass = "slideinfromright",
                    outClass = "slideouttoleft",
                    currentPartial, lastPartial;

                window.onpopstate = function(event) {
                    console.log("onpop");
                    inClass = "slideinfromleft";
                    outClass = "slideouttoright";
                }



                scope.$on('$routeChangeSuccess', update);
//                    update();

                //'Angularize' a partial: Create scope/controller, $compile element, insert into dom
                function setupPartial(partial) {
                    var cur = $route.current;
                    partial.scope = cur.locals.$scope = scope.$new();
//                    partial.controller = $controller(cur.controller, cur.locals);
                    partial.element.contents().data('$ngControllerController', partial.controller);
                    $compile(partial.element.contents())(partial.scope);
                    parentElm.append(partial.element);
                    partial.scope.$emit('$viewContentLoaded');
                }

                //Create just an element for a partial
                function createPartial(template) {
                    return {
                        element: angular.element('<div class="partial">').html(template)
                    };
                }

                function destroyPartial(partial) {
                    partial.scope.$destroy();
                    partial.element.remove();
                    partial = null;
                }


                function transition(inPartial, outPartial) {
//                    inPartial.element.css("-webkit-transform", "translateX(100%)");

//                    $timeout(function() {
                    inPartial.element.addClass("in");
                    inPartial.element.addClass(inClass);

                    console.log(inClass);

                    if (outPartial) {
                        outPartial.element.addClass("out");
                        outPartial.element.addClass(outClass);
                    }

                    setTimeout(function() {
                        inPartial.element.removeClass("in");
                        inPartial.element.removeClass(inClass);
                        if (outPartial) destroyPartial(outPartial);
                        updatePartialQueue();

                        inClass = "slideinfromright";
                        outClass = "slideouttoleft";

                        $rootScope.$broadcast("transition:complete", {});

                    }, TRANSITION_TIME);




                }

                function updatePartialQueue() {
                    //Bring in a new partial if it exists
                    if (partials.length > 0) {
                        var newPartial = partials.pop();
                        setupPartial(newPartial)
                            transition(newPartial, currentPartial);
                            currentPartial = newPartial;
                    }
                }

                function update() {
                    if ($route.current && $route.current.locals.$template) {
                        partials.unshift(createPartial($route.current.locals.$template));
                        updatePartialQueue();
                    }
                }
            }
        }
    });
