'use strict';

angular.module('MobileDirectives', ['MobileControllers']).

    directive('scroll', [function() {

        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs, controller) {
                document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

                var scrollContainer = new iScroll(element[0], {});

                window.onorientationchange = function() {
                    setTimeout(function () { scrollContainer.refresh(); }, 200);
                }
            }
        }
    }]);
