'use strict';

angular.module('MobileDirectives', ['MobileControllers']).

    directive("alertDialog", [
        "$window",
        "$timeout",

        function($window, $timeout) {
            return {
                restrict: 'A',
                templateUrl: 'partials/alert-dialog.html',
                scope: {
                    error: '=',
                    message: '='
                },
                link: function(scope, element, attrs) {
                    var dialogWidth, dialogHeight,
                        windowWidth, windowHeight;

                    // set dialog text
                    scope.$watch('message', function() {
                        if (scope.message) {
                            scope.dialog = {
                                title: scope.message.title,
                                text: scope.message.text
                            }
                        }
                    });

                    // show dialog
                    scope.$watch('error', function() {
                        if (scope.error) {
                            setDialogPosition(0);
                            scope.error = null;
                            scope.show  = true;
                        }
                    });

                    scope.hideDialog = function() {
                        scope.show = false;
                    };


                    // set modal position on orientationchange
                    $window.addEventListener("orientationchange", function() {
                        if (scope.show) setDialogPosition(300);
                    }, false);

                    var setDialogPosition = function(timeout) {
                        $timeout(function() {
                            windowWidth  = $window.innerWidth;
                            windowHeight = $window.innerHeight;

                            dialogWidth  = $('#modalDialog').width();
                            dialogHeight = $('#modalDialog').height();

                            $('#modalDialog').css("left", ((windowWidth / 2) - dialogWidth / 2));
                            $('#modalDialog').css("top", ((windowHeight / 2) - dialogHeight / 2));
                        }, timeout);
                    };
                }
            }
        }
    ]).

    directive('pressed', [
        function() {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    $(element[0]).tap(function() {
                        angular.element(this).css("background", "#e2e2e2");
                    });
                }
            }
        }
    ]).

    directive('scrollContainer', [
        '$window',
        '$timeout',

        function($window, $timeout) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    var scrollContainer;

                    $timeout(function() {
                        scrollContainer = new iScroll(element[0], {
                            hideScrollbar: true,
                            checkDOMChanges: false
                        });
                        refresh(0);
                    }, 0);

                    var refresh = function(timeout) {
                        $timeout(function() {
                            scrollContainer.refresh();
                        }, timeout);
                    }

                    $window.addEventListener('touchmove', function (e) {
                        e.preventDefault();
                    }, false);

                    $window.onorientationchange = function() {
                        refresh(300);
                    };
                }
            }
        }
    ]).

    directive('view', [
        '$route',
        '$compile',
        '$timeout',
        '$window',

        function ($route, $compile, $timeout, $window) {
            return {
                restrict:'A',
                terminal:true,
                link:function (scope, parentElm, attr) {
                    var TRANSITION_TIME = 400,
                        partials = [],
                        inClass, outClass,
                        currentPartial;


                    setTransitionDirection("fromRight");

                    scope.$on('$routeChangeSuccess', update);

                    $window.addEventListener("popstate", function() {
                        setTransitionDirection("fromLeft");
                    },false);


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
                            element: angular.element('<div class="partial in">').html(template)
                        };
                    }

                    function destroyPartial(partial) {
                        partial.scope.$destroy();
                        partial.element.remove();
                        partial = null;
                    }


                    function transition(inPartial, outPartial) {
                        $timeout(function() {
                            inPartial.element.addClass(inClass);

                            if (outPartial) {
                                outPartial.element.addClass("out");
                                outPartial.element.addClass(outClass);
                            }

                            $timeout(function() {
                                inPartial.element.removeClass("in");
                                inPartial.element.removeClass(inClass);

                                if (outPartial) destroyPartial(outPartial);

                                setTransitionDirection("fromRight");
                            }, TRANSITION_TIME);
                        }, 0);
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

                    function setTransitionDirection(direction) {
                        switch (direction) {
                            case "fromRight":
                                inClass  = "slideinfromright";
                                outClass = "slideouttoleft";
                                break;

                            case "fromLeft":
                                inClass  = "slideinfromleft";
                                outClass = "slideouttoright";
                                break;
                        }
                    }
                }
            }
        }
    ]);
