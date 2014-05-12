/**
 * Created by maxim on 11.05.14.
 */

/*global console, angular, $ */

var scotchTodo = angular.module('scotchTodo', []);

scotchTodo.config(['$httpProvider', function ($httpProvider) {
    "use strict";
    var authToken = $('meta[name="csrf-token"]').attr('content');
    $httpProvider.defaults.headers.common["X-CSRF-TOKEN"] = authToken;
}]);

scotchTodo.controller('mainController', ['$scope', '$http', function ($scope, $http) {
    "use strict";

    $scope.formData = {};

    $http.get('/api/todos').
        success(function (data) {
            $scope.todos = data;
        }).error( function(data) {
            console.log('Error: ' + data);
        });

    $scope.createTodo = function () {
        $http.post('/api/todos', $scope.formData).
            success( function (data) {
                $scope.formData = {};
                $scope.todos = data;
            }).error( function (data) {
                console.log('Error: ' + data);
            });
    };

    $scope.deleteTodo = function (id) {
        $http.delete('/api/todos/' + id).
            success( function (data) {
                $scope.todos = data;
            }).error( function (data) {
                console.log('Error: ' + data);
            });
    };


}]);