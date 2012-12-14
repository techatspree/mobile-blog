/**
 * @author Till Hermsen
 * @date 12.11.12
 */

angular.module('RegistrationControllers', ['UserServices']).

    /**
     * Register Controller
     */
    controller('RegisterController', [
        '$scope',
        '$location',
        'UserService',

        function($scope, $location, UserService) {
            $scope.error;
            $scope.user;

            $scope.registerSubmit = function(userData) {
                userData = (userData) ? $.param(userData) : null;

                UserService.register(userData).
                    success(function() {
                        $scope.user = null;
//                        $location.url('/login');
                        history.back();
                    }).
                    error(function(data) {
                        $scope.error = data;
                    });
            }
        }
    ]);
