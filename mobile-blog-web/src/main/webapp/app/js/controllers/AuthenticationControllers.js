/**
 * @author Till Hermsen
 * @date 02.11.12
 */

angular.module('AuthenticationControllers', ['UserServices']).

    /**
     * Login Controller
     */
    controller('LoginController', [
        '$scope',
        '$location',
        'UserService',

        function($scope, $location, UserService) {
            $scope.error;
            $scope.user;

            $scope.loginSubmit = function(credentials) {
                credentials = (credentials) ? $.param(credentials) : null;

                UserService.login(credentials).
                    success(function() {
                        $scope.user = null;
//                        $location.url('/');
                        history.back();
                    }).
                    error(function() {
                        $scope.error = {};
                        $scope.error.title = 'Login';
                        $scope.error.text  = 'Login failed!';
                    });
            }
        }
    ]);
