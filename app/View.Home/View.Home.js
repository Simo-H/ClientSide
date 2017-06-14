'use strict';

angular.module('myApp.View.Home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/View.Home', {
    templateUrl: 'View.Home/View.Home.html',
    controller: 'View.HomeCtrl'
  });
}])

.controller('View.HomeCtrl', [function() {

}]);