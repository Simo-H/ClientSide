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
        .when('/Login',
            {
                templateUrl: 'View.Login/View.Login.html',
                controller: 'LoginController'
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
        .when('/ShoppingCart',
            {
                templateUrl: 'View.ShoppingCart/View.ShoppingCart.html',
                controller: ''
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
        factory.setUserName = function (name) {
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
    .controller('LoginController', function ($scope, $http, $log,UserDetails) {
        $scope.Login = function () {
            $log.info("test");
            var login = {
                username: $scope.username,
                password: $scope.password,
            }


            var res = $http.post('http://localhost:8888/clients/login', login, {headers: {'Content-Type': 'application/json'}});
            res.success(function (data, status, headers, config) {
                UserDetails.setUserName(data.first_name);
                $log.info(data);
            });
            res.error(function (data, status, headers, config) {
                alert("failure message: " + JSON.stringify({data: data}));
            });
            // Making the fields empty
            //
            $scope.client_id = '';
            $scope.password = '';

        }
    })

app.controller('RegisterController', function ($scope, $http, $log) {
    $scope.submit = function () {
        var user = {
            client_id: $scope.client_id,
            first_name: $scope.first_name,
            last_name: $scope.last_name,
            address: $scope.address,
            phone_number: $scope.phone_number,
            email_address: $scope.email_address,
            credit_card: $scope.credit_card,
            security_answer: $scope.security_answer,
            password: $scope.password,
            country: $scope.country,
            favourite_catergory: $scope.favourite_catergory,
            favourite_catergory2: $scope.favourite_catergory2,
            username: $scope.username
        };
        $log.info(first_name);
        // var password= $scope.last_name;
        var res = $http.post('http://localhost:8888/clients/addClient', user, {headers: {'Content-Type': 'application/json'}});
        res.success(function (data, status, headers, config) {
            $scope.message = data;
            $log.info(first_name);

        });
        res.error(function (data, status, headers, config) {
            alert("failure message: " + JSON.stringify({data: data}));
        });
        // Making the fields empty
        //
        $scope.name = '';
        $scope.employees = '';
        $scope.headoffice = '';
    }
})
    .controller('MovieModalController', function ($scope, $uibModalInstance, movie, $log, $http) {

        $scope.movie = movie;
        $http.get("http://localhost:8888/movies/movieDescription?movie_id=" + movie.movie_id).success(function (response) {
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

