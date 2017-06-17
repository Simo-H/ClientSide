'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
    'ngRoute',
    'myApp.View.Home',
    'myApp.view2',
    'myApp.version',
    'ui.bootstrap'
]).config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
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
        .when('/Movies',
            {
                templateUrl: 'View.Movies/View.Movies.html',
                controller: 'moviesController'

            })
        .when('/login',
            {
                resolve: {
                    "check": function () {


                    }
                },
                templateUrl: 'Main/login.html',
                controller: 'loginControl'
            })
        .otherwise({redirectTo: 'index.html'});
}])
    .factory('UserDetails', function () {
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
    .controller('homeController', function ($scope, $http, $log, UserDetails) {
        $http.get("http://localhost:8888/movies/bestFive").success(function (response) {
            $log.info(response);
            $scope.moviesHot = [];
            $scope.moviesHot = response;
            $scope.moviesNew = [];
        });
        if (UserDetails.getUserStatus())
            $http.get("http://localhost:8888/movies/newMovies").success(function (response) {
                $scope.moviesNew = response;
            });
    })
    .controller('moviesController', function ($scope, $http, $log, $uibModal) {
        $scope.categories = new Array('action', 'animation', 'sci-fi', 'comics');
        $scope.movisByCategory = {};
        angular.forEach($scope.categories, function (catagory) {
            // Here, the lang object will represent the lang you called the request on for the scope of the function
            $http.get("http://localhost:8888/movies/getNextMovies?limit=5&category=" + catagory + "&rownum=1").success(function (response) {
                $scope.movisByCategory[catagory] = [];
                $scope.movisByCategory[catagory] = response;
            });
        });
        $scope.getSixMoreMoviesByCategory = function (category) {
            var from = $scope.movisByCategory[category].length + 1;
            $http.get("http://localhost:8888/movies/getNextMovies?limit=6&category=" + category + "&rownum=" + from).success(function (response) {
                $scope.movisByCategory[category].push.apply($scope.movisByCategory[category], response);
            });
        }
        $scope.viewMovie = function (movie) {

            var modalInstance = $uibModal.open({
                templateUrl: 'Templates/Main/MovieDetailsModal.html',
                controller: 'MovieModalController',
                resolve: {
                    movie: function () {
                        return movie;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

    })
    .controller('loginControl', function ($scope, $http) {
        $scope.submit = function () {
            var uname = $scope.username;
            var password = $scope.password;
            $scope.myFunction = function () {

            }
        }
    })

    .controller('RegisterController', function ($scope, $http, $log) {
        $scope.submit = function () {
            var username = $scope.first_name;
            $log.info(username);
            var password = $scope.password;

            $scope.myFunction = function () {

            }
        }
    })
    .controller('MovieModalController',function ($scope, $uibModalInstance, movie,$log,$http) {

        $scope.movie = movie;
        $http.get("http://localhost:8888/movies/movieDescription?movie_id="+movie.movie_id).success(function (response) {
            $scope.movieDescription = response[0];
            $log.info($scope.movieDescription);
        });
        $scope.ok = function () {
            $uibModalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

