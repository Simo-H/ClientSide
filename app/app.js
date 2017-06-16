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
              templateUrl: 'View.Home/View.Home.html',
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
    .factory('UserDetails', function(){
        var factory = {};
        var isLoggedIn = true;
        var userName = "Guest";
        factory.getUserStatus = function () {
            return isLoggedIn;
        }
        factory.setUserStatus = function (status) {
            isLoggedIn = status;
        }
        factory.getUserName = function () {
            return userName;
        }
        factory.setUserStatus = function (name) {
            userName = name;
        }
        return factory;
    })
    .controller('homeController',function ($scope,$http,$log,UserDetails) {
        $http.get("http://localhost:8888/movies/bestFive").success(function (response) {
            $log.info(response);
            $scope.moviesHot = [];
            $scope.moviesHot = response;
            $scope.moviesNew = [];
        });
                if(UserDetails.getUserStatus())
                    $http.get("http://localhost:8888/movies/newMovies").success(function (response) {
                        $log.info(response);
                        $scope.moviesNew = response;
                    });
    });

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