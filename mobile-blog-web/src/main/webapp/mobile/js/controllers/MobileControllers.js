/**
 * @author Till Hermsen
 * @date 29.11.12
 */

angular.module('MobileControllers', []).

    controller('ToolbarController', [
        '$scope',

        function($scope) {
            $scope.title = "Mobile-Blog";
        }
    ]);
