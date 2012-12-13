/**
 * @author Till Hermsen
 * @date 29.11.12
 */
'use strict';

angular.module('MobileControllers', []).

    controller('ToolbarController', [
        '$scope',
        '$location',

        function($scope, $location) {
            $scope.routeTo = function(route) {
                $location.url(route);
            };

            $scope.onLogoutBtnTap = function() {
                console.log("logout");
                // do logout...
                $location.url("/");
            }

            $scope.onBackBtnTap = function() {
                history.back();
            };
        }
    ]);
