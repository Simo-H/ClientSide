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
      .when('/',
          {
              templateUrl: 'Templates/Main/Home.html'
              // controller: 'homeController'

          })
      .when('/simo',
          {
              templateUrl: 'view2/view2.html'
          })
      .otherwise({redirectTo: 'index.html'});
}
    .controller('homeController',function ($scope,$http) {
        $http.get("http://localhost:8888/movies/bestfive").then(function (response) {
            $scope.movies = JSON.parse(response.data);
            console.log("1")
        })
    })
]);
