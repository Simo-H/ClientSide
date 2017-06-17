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
      .when('/Register',
          {
              templateUrl: 'View.Register/View.Register.html',
              controller: 'RegisterController'

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

app.controller('RegisterController',function($scope, $http,$log){
    $scope.submit=function(){
        var user = {
            client_id:$scope.clientid,
            first_name : $scope.first_name,
            last_name : $scope.last_name,
            address:$scope.add,
            phone_number:$scope.phone,
            email_address:$scope.email,
            credit_card:$scope.name,
            security_answer:$scope.name,
            password:$scope.password,
            country: $scope.country,
            favourite_catergory:$scope.catagory,
            favourite_catergory2:$scope.catagory2,
            username: $scope.username,
        };
        $log.info(uname);
        var password= $scope.last_name;
        var res = $http.post('/savecompany_json', dataObj);
        res.success(function(data, status, headers, config) {
            $scope.message = data;
        });
        res.error(function(data, status, headers, config) {
            alert( "failure message: " + JSON.stringify({data: data}));
        });
        // Making the fields empty
        //
        $scope.name='';
        $scope.employees='';
        $scope.headoffice='';
    }
});
