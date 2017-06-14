'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.View.Home',
  'myApp.view2',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider
      .when('/stav',
          {
            templateUrl: 'View.Home/View.Home.html'
          })
      .when('/simo',
          {
              templateUrl: 'view2/view2.html'
          })
      .otherwise({redirectTo: 'index.html'});
}]);
