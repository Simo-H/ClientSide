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
      .when('/stav',
          {
            templateUrl: 'View.Home/View.Home.html'
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
}]);


app.controller('loginControl',function($scope, $http){
     $scope.submit=function(){
        var uname= $scope.username;
        var password= $scope.password;
         $scope.myFunction = function() {
            
         }
     }
 });