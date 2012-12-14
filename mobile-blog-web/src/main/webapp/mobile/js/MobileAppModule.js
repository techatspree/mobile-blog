/**
 * AngularJS MobileAppModule
 *
 *
 * @author Till Hermsen
 * @date 14.12.12
 */

'use strict';

angular.module('MobileAppModule', []).

    /**
     *
     */
    run(['$window', function($window) {
        // Initialize fastclick library.
        // https://github.com/ftlabs/fastclick
        // Eliminates the 300ms delay between a physical
        // tap and the firing of a click event on mobile browsers.
        $window.addEventListener('load', function() {
            new FastClick(document.body);
        }, false);
    }]).


    /**
     * Directives
     */

    /**
     * Modal-dialog directive
     *
     * Example: error = $scope object
     * <div id="alertDialog" alert-dialog error="error" message="error" ng-show="show"></div>
     */
    directive('modalDialog', ['$window', '$timeout', function($window, $timeout) {
        return {
            restrict: 'A',
            templateUrl: 'partials/alert-dialog.html',
            scope: {
                error: '=',
                message: '='
            },
            link: function(scope) {
                var dialogWidth, dialogHeight,
                    windowWidth, windowHeight;

                // set dialog text
                scope.$watch('message', function() {
                    if (scope.message) {
                        scope.dialog = {
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
                $window.addEventListener('orientationchange', function() {
                    if (scope.show) setDialogPosition(300);
                }, false);


                // set dialog position
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
    }]).


    /**
     * Changes background color of a tapped list element
     */
    directive('pressed', [function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                $(element[0]).tap(function() {
                    angular.element(this).css("background", "#e2e2e2");
                });
            }
        }
    }]).


    /**
     * iScroll container
     * http://cubiq.org/iscroll-4
     */
    directive('scrollContainer', ['$window', '$timeout', function($window, $timeout) {
        return {
            restrict: 'A',
            link: function(scope, element) {
                var scrollContainer;

                // initialize iScroll container
                $timeout(function() {
                    scrollContainer = new iScroll(element[0], {
                        hideScrollbar: true,
                        checkDOMChanges: false
                    });

                    refresh(0);
                }, 0);

                // refresh iScroll container
                var refresh = function(timeout) {
                    $timeout(function() {
                        scrollContainer.refresh();
                    }, timeout);
                }

                // prevent default behaviour of standard touch events
                $window.addEventListener('touchmove', function (e) {
                    e.preventDefault();
                }, false);


                // listen for orientation change
                $window.addEventListener('onorientationchange', function(e) {
                    refresh(300);
                }, false);
            }
        }
    }]).


    /**
     * Transitions between partials (simple slide in effect).
     */
    directive('view', [
        '$route',
        '$compile',
        '$timeout',
        '$window',

        function ($route, $compile, $timeout, $window) {
            return {
                restrict:'A',
                terminal:true,
                link:function (scope, parentElm) {
                    var TRANSITION_TIME = 400,
                        partials = [],
                        inClass, outClass,
                        currentPartial;

                    // set initial transition direction
                    setTransitionDirection("fromRight");

                    // change transition direction on history.popstate event
                    $window.addEventListener("popstate", function() {
                        setTransitionDirection("fromLeft");
                    },false);

                    scope.$on('$routeChangeSuccess', update);


                    function update() {
                        if ($route.current && $route.current.locals.$template) {
                            partials.unshift(createPartial($route.current.locals.$template));
                            updatePartialQueue();
                        }
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
    ]).


    /**
     * Controller
     */
    controller('ToolbarController', ['$scope', '$location', function($scope, $location) {
        $scope.routeTo = function(route) {
            $location.url(route);
        };

        $scope.onBackBtnTap = function() {
            history.back();
        };

        $scope.onLogoutBtnTap = function() {
            $scope.broadcastBtnEvent('user:logout')
        }
    }]);
