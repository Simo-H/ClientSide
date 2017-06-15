'use strict';

// Declare app level module which depends on views, and components
var app =angular.module('myApp', [
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
              templateUrl: 'Templates/Main/Home.html',
              controller: 'homeController'

          })
      .when('/simo',
          {
              templateUrl: 'view2/view2.html'
          })
      .when('/login',
          {
              resolve:{
                  "check":function () {


                  }
              },
              templateUrl: 'Main/login.html',
              controller: 'loginControl'
          })
      .otherwise({redirectTo: 'index.html'});
}])
    .controller('homeController',function ($scope,$http,$log) {
        $http.get("http://localhost:8888/movies/bestFive").success(function (response) {
            $log.info(response);
            $scope.movies = [];
            $scope.movies = response;

        })
    })
    // myApp.controller('homeController',function ($scope) {
    //
    // })



app.controller('loginControl',function($scope, $http){
     $scope.submit=function(){
        var uname= $scope.username;
        var password= $scope.password;
         $scope.myFunction = function() {

         }
     }
 });