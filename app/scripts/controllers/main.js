
/**
 * @ngdoc function
 * @name climbTreeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the climbTreeApp
 */
angular.module('clymbAhead').controller('MainCtrl', function ($scope, $http) {
    'use strict';
    $scope.test = "Start here";

    /**
     * Take the user input
     * Based on current input, find all possible words that it could complete
     * put the first char as a node hanging from this node
     * @param climbNode
     */
    $scope.climb = function (climbNode) {

    };

    function person(first, last, age, eyecolor) {
        this.firstName = first;
        this.lastName = last;
        this.age = age;
        this.eyeColor = eyecolor;
    }
});

