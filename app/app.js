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
                controller: 'ShopingCartController'
            })
        .otherwise({redirectTo: 'index.html'});
}])
    .directive('numericOnly', function(){
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {

                modelCtrl.$parsers.push(function (inputValue) {
                    var transformedInput = inputValue ? inputValue.replace(/[^\d]/g,'') : null;

                    if (transformedInput!=inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }

                    return transformedInput;
                });
            }
        };
    })
    .directive('numberSpin', [function(){

        return {
            restrict: 'E',
            require: 'ngModel',
            scope: {
                "ngModel": '='
            },
            template: '<div class="input-group pull-right" style="width: 50px;height: 10px;padding: 0; margin: 0;bottom: 0">'+
                        '<span class="input-group-btn">'+
                            '<button data-ng-click="minus()" style="width: 10px;padding: 0;height: 20px " type="button" class="btn btn-danger btn-number" data-type="minus" data-field="quant[2]">'+
                             '<span style="font-size: 6px;text-align: center; padding: 0;margin: 0;top: -3px;"; class="glyphicon glyphicon-minus"; ></span>'+
                            '</button>'+
                        '</span>'+
                        '<input numeric-only data-ng-model="ngModel"  ng-pattern="onlyNumbers" type="text" name="quant[2]" style="padding: 0;margin: 0;font-size: 15px;text-align: center;height: 20px" class="form-control input-number" value=1 min="1" max="100">'+
                        '<span class="input-group-btn">'+
                            '<button data-ng-click="plus()" type="button" class="btn btn-success btn-number"  style="width: 10px;padding-bottom: 10px;padding:0px;top: 0;margin-top:0;height: 20px " data-type="plus" data-field="quant[2]">'+
                                '<span class="glyphicon glyphicon-plus" style="font-size: 6px;text-align: center; padding: 0;margin: 0;top: -3px;"></span>'+
                            '</button>'+
                        '</span>'+
                    '</div>',
            link: function(scope, elem, attrs,ctrl){

                scope.onlyNumbers = /^\d+$/;
                scope.plus = function(){
                    if(scope.ngModel<999){
                        scope.ngModel = scope.ngModel*1 + 1;
                        scope.updateModel(scope.ngModel);
                    }
                }
                scope.minus = function(){
                    if(scope.ngModel>0){
                        scope.ngModel = scope.ngModel - 1;
                        scope.updateModel();
                    }
                }
                scope.updateModel = function()
                {
                    ctrl.$setViewValue(scope.ngModel);
                }
            }
        }

    }])
    .filter('filterCategories', function($log) {
        return function(items,text) {
            var result = {};
            // $log.info(text);
            if(text != "")
            {
                angular.forEach(items, function(value, key) {
                    if (key.includes(text)) {
                        result[key] = value;
                    }
                });
            }
            else
            {
                result = items;
            }
            return result;
        };
    })
    .filter('filterMovies', function($log) {
        return function(items,text,category) {
            var result = {};
            // $log.info(text);
            if(text != "")
            {
                angular.forEach(items, function(value, key) {
                    if (key.includes(text)) {
                        result[key] = value;
                    }
                });
            }
            else
            {
                result = items;
            }
            return result;
        };
    })
    .factory('UserDetails', function ($rootScope, $log) {
        var factory = {};
        factory.isLoggedIn = false;
        factory.userName = "Guest";
        factory.getUserStatus = function () {
            return factory.isLoggedIn;
        }
        factory.setUserStatus = function (status) {
            factory.isLoggedIn = status;
            // $log.info(factory.isLoggedIn);
        }
        factory.getUserName = function () {
            return factory.userName;
        }
        factory.setUserName = function (name) {
            factory.userName = name;
            $rootScope.$broadcast('updateUser');

        }
        return factory;
    })
    .factory('MoviesUtilities', function ($log) {
        var factory = {};
        factory.getNumber = function(num) {
            var arr=[];
            var i=0;
            while(i<num){arr.push(i);i++;};
            // $log.info(arr);
            return arr;
        }
        return factory;
    })
    .factory('ShoppingDetails', function ($rootScope, $log) {
        var factory = {};
        factory.movies = [];
        factory.getMovies = function () {
            $log.info(factory.movies);

            return factory.movies;

        }
        factory.addMovie = function (movie) {
            factory.movies.push(movie);
            $log.info(factory.movies);
            $rootScope.$broadcast('updateShoping');

        }
        factory.removeMovie = function (movie) {
            var index = factory.movies.indexOf(movie);
            factory.movies.splice(index, 1);
            $rootScope.$broadcast('updateShoping');

        }

        return factory;
    })
    .controller('homeController', function ($scope, $http, $log, UserDetails) {
        $http.get("http://localhost:8888/movies/bestFive").success(function (response) {
            // $log.info(response);
            $scope.LoggedIn = UserDetails.getUserStatus();
            $scope.moviesHot = [];
            $scope.moviesHot = response;
            $scope.moviesNew = [];
        });
        $http.get("http://localhost:8888/movies/newMovies").success(function (response) {
            $log.info(response);
            $scope.moviesNew = response;
        });
    })
    .controller('moviesController', function ($scope, $http, $log, $uibModal,ShoppingDetails,MoviesUtilities) {
        $scope.categories = new Array('action', 'animation', 'sci-fi', 'comics');
        $scope.searchByCategory = "";
        $scope.searchByMovieName = "";
        $scope.movisByCategory = {};
        $scope.amount = '1';
        angular.forEach($scope.categories, function (catagory) {
            // Here, the lang object will represent the lang you called the request on for the scope of the function
            $http.get("http://localhost:8888/movies/getNextMovies?limit=5&category=" + catagory + "&rownum=1").success(function (response) {
                $scope.movisByCategory[catagory] = [];
                $scope.movisByCategory[catagory] = response;
                // ShoppingDetails.movies = response;
                // $log.info(ShoppingDetails.movies);
            });
        });
        $scope.getSixMoreMoviesByCategory = function (category) {
            var from = $scope.movisByCategory[category].length + 1;
            $http.get("http://localhost:8888/movies/getNextMovies?limit=6&category=" + category + "&rownum=" + from).success(function (response) {
                $scope.movisByCategory[category].push.apply($scope.movisByCategory[category], response);
            });
        };
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
        $scope.getNumber = function(num) {
            return MoviesUtilities.getNumber(num);
        };
        $scope.addAmountToMovie = function (movie,amount) {
            movie['amount'] = amount;
            // $log.info(movie);
        }
        $scope.addMovieToCart = function (movie,amount) {
            if(amount > 0)
            {
                $scope.addAmountToMovie(movie,amount);
                // $log.info(movie);
                ShoppingDetails.addMovie(movie);
            }

        }

        })
    .controller('LoginController', function ($scope, $http, $log, UserDetails) {
        $scope.Login = function () {
            var login = {
                username: $scope.username,
                password: $scope.password,
            }
            var res = $http.post('http://localhost:8888/clients/login', login, {headers: {'Content-Type': 'application/json'}});
            res.success(function (data, status, headers, config) {
                // $log.info(data[0].username);
                UserDetails.setUserStatus(true);
                UserDetails.setUserName(data[0].username);
                // UserDetails.setUserStatus(true);
                // $log.info(UserDetails.getUserStatus())
                // NavController.updateUserName();
                // $log.info(UserDetails.getUserName());
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
    .controller('RegisterController', function ($scope, $http, $log) {
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
            // $log.info(first_name);
            // var password= $scope.last_name;
            var res = $http.post('http://localhost:8888/clients/addClient', user, {headers: {'Content-Type': 'application/json'}});
            res.success(function (data, status, headers, config) {
                $scope.message = data;
                // $log.info(first_name);

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
    .controller('MovieModalController', function ($scope, $uibModalInstance, movie, $log, $http,MoviesUtilities,ShoppingDetails) {
        $scope.amount = '1';
        $scope.movie = movie;
        $http.get("http://localhost:8888/movies/movieDescription?movie_id=" + movie.movie_id).success(function (response) {
            $scope.movieDescription = response[0];
            // $log.info($scope.movieDescription);
        });
        $scope.ok = function () {
            $uibModalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.getNumber = function(num) {
            return MoviesUtilities.getNumber(num);
        }
        $scope.addAmountToMovie = function (movie,amount) {
            movie['amount'] = amount;
            // $log.info(movie);
        }
        $scope.addMovieToCart = function (movie,amount) {
            if(amount > 0)
            {
                $scope.addAmountToMovie(movie,amount);
                // $log.info(movie);
                ShoppingDetails.addMovie(movie);
            }
        }
    })
    .controller('ShopingCartController', function ($scope,$log,$http,$location,ShoppingDetails){
        $scope.totalPrice=0;
        $scope.movies=ShoppingDetails.movies;
        angular.forEach($scope.movies, function (movie) {
            movie['amount'] = 2;
        })
        angular.forEach($scope.movies, function (movie) {
            $scope.totalPrice=movie.amount * movie.price_dollars +$scope.totalPrice;
            // $log.info(movie);
        })

        $scope.clickContinueShoping=function () {
           $location.path('/Movies');
       }

       $scope.$on('updateShoping', function () {
            $scope.totalPrice=0;
            $scope.movies= ShoppingDetails.getMovies();
           angular.forEach($scope.movies, function (movie) {
               $scope.totalPrice=movie.amount * movie.price_dollars +$scope.totalPrice;
            })

        });
       $scope.change=function(){
           $log.info("1");

           $scope.totalPrice=0;

            angular.forEach($scope.movies, function (movie) {
                $scope.totalPrice=movie.amount * movie.price_dollars +$scope.totalPrice;
            })
        }
        $scope.deleteMovieShopingCart = function (movie) {
            ShoppingDetails.removeMovie(movie);
        };
        $scope.Madeorder=function(){


/////////////////////add locstion////////////
        }

    })
    .controller('NavController', function ($scope, UserDetails, $location) {
        $scope.userName = UserDetails.getUserName();
        $scope.$on('updateUser', function () {
            $scope.userName = UserDetails.getUserName();
            // $scope.isLoggedIn = UserDetails.getUserStatus();
            $location.path('/');

        });



        // $scope.setUserName($scope.UserName);
        // $log.info($scope.UserName);


    });
