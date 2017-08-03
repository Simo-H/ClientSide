'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
    'ngRoute',
    'myApp.version',
    'ui.bootstrap',
    'ngCookies',
]).config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider
        .when('/',
            {
                templateUrl: 'View.Home/View.Home.html',//view
                controller: 'homeController'//controller
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
                controller: 'ShoppingCartController'
            })
        .when('/OrdersList',
            {
                templateUrl: 'View.OrdersList/View.OrderList.html',
                controller: 'OrderListController'
            })
        .when('/About',
            {
                templateUrl: 'View.About/About.html'
            })
        .otherwise({redirectTo: 'index.html'});
}])
    .directive('numericOnly', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, modelCtrl) {

                modelCtrl.$parsers.push(function (inputValue) {
                    var transformedInput = inputValue ? inputValue.replace(/[^\d]/g, '') : null;

                    if (transformedInput != inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }

                    return transformedInput;
                });
            }
        };
    })
    .directive('numberSpin', [function () {

        return {
            restrict: 'E',
            require: 'ngModel',
            scope: {
                "ngModel": '='
            },
            template: '<div class="input-group pull-right" style="width: 50px;height: 10px;padding: 0; margin: 0;bottom: 0">' +
            '<span class="input-group-btn">' +
            '<button data-ng-click="minus()" style="width: 10px;padding: 0;height: 20px " type="button" class="btn btn-danger btn-number" data-type="minus" data-field="quant[2]">' +
            '<span style="font-size: 6px;text-align: center; padding: 0;margin: 0;top: -3px;"; class="glyphicon glyphicon-minus"; ></span>' +
            '</button>' +
            '</span>' +
            '<input numeric-only data-ng-model="ngModel"  ng-pattern="onlyNumbers" ng-change="updateModel()" type="text" name="quant[2]" style="padding: 0;margin: 0;font-size: 15px;text-align: center;height: 20px" class="form-control input-number" value=1 min="1" max="100">' +
            '<span class="input-group-btn">' +
            '<button data-ng-click="plus()" type="button" class="btn btn-success btn-number"  style="width: 10px;padding-bottom: 10px;padding:0px;top: 0;margin-top:0;height: 20px " data-type="plus" data-field="quant[2]">' +
            '<span class="glyphicon glyphicon-plus" style="font-size: 6px;text-align: center; padding: 0;margin: 0;top: -3px;"></span>' +
            '</button>' +
            '</span>' +
            '</div>',
            link: function (scope, elem, attrs, ctrl) {

                scope.onlyNumbers = /^\d+$/;
                scope.plus = function () {
                    if (scope.ngModel < 999) {
                        scope.ngModel = scope.ngModel * 1 + 1;
                        scope.updateModel(scope.ngModel);
                    }
                }
                scope.minus = function () {
                    if (scope.ngModel > 0) {
                        scope.ngModel = scope.ngModel - 1;
                        scope.updateModel();
                    }
                }
                scope.updateModel = function () {
                    ctrl.$setViewValue(scope.ngModel);
                }
            }
        }

    }])
    .filter('filterCategories', function ($log) {
        return function (items, text) {
            var result = {};
            // $log.info(text);
            if (text != "") {
                angular.forEach(items, function (value, key) {
                    if (key.includes(text)) {
                        result[key] = value;
                    }
                });
            }
            else {
                result = items;
            }
            return result;
        };
    })
    .filter('filterMovies', function ($log) {
        return function (items, text, category) {
            var result = {};
            // $log.info(text);
            if (text != "") {
                angular.forEach(items, function (value, key) {
                    if (key.includes(text)) {
                        result[key] = value;
                    }
                });
            }
            else {
                result = items;
            }
            return result;
        };
    })
    .filter('yesNo', function () {
        return function (boolean) {
            return boolean ? 'Yes' : 'No';
        }
    })
    .filter('filterByRanking', function ($log) {
        return function (items, ranking) {
            var result = [];
            // $log.info(text);
            if (ranking != "") {
                angular.forEach(items, function (item) {
                    if(item.ranking > ranking)
                        result.push(item)
                });
            }
            else {
                result = items;
            }
            return result;
        };
    })
    .factory('UserDetails', function ($rootScope, $log,$cookies,ShoppingDetails,$location,$http) {
        var factory = {};
        factory.isLoggedIn = false;
        factory.username = "Guest";
        factory.user_token;
        factory.userLastEntryDate = new Date();
        factory.dollar = true;
        factory.favourite_catergory = "";
        factory.favourite_catergory2 = "";
        factory.getUserLastEntryDate = function () {
            return factory.userLastEntryDate;
        }
        factory.setUserLastEntryDate = function (date) {
            factory.userLastEntryDate = date;
            $rootScope.$broadcast('updateUser');
        }
        factory.getUserStatus = function () {
            return factory.isLoggedIn;
        }
        factory.getUserToken = function () {
            return factory.user_token;
        }
        factory.setUserStatus = function (status) {
            factory.isLoggedIn = status;
            // $log.info(status);
            $rootScope.$broadcast('updateUser');
            // $log.info(factory.isLoggedIn);
        }
        factory.setUserToken = function (user_token) {
            factory.user_token = user_token;

            $rootScope.$broadcast('updateUser');
            // $log.info(factory.user_token);
        }
        factory.getUsername = function () {
            return factory.username;
        }
        factory.setUsername = function (name) {
            factory.username = name;

            $rootScope.$broadcast('updateUser');

        }
        factory.loadUserData = function () {
            // var cookies = $cookies.getAll();
            // angular.forEach(cookies, function (v, k) {
            //     $cookies.remove(k);
            //
            // });
            var lastUserLoggedIn = $cookies.get('!LastUser');
            var NotfirstLogin = undefined != lastUserLoggedIn;
            // $log.info($cookies.get(lastUserLoggedIn));
            // $log.info(NotfirstLogin);
            if(NotfirstLogin)
            {
                var User = JSON.parse($cookies.get(lastUserLoggedIn));
            }
            $log.info(NotfirstLogin && User.UserStatus === 'true');
            factory.setUserStatus(NotfirstLogin && User.UserStatus === 'true');
            if (factory.getUserStatus() === true)
            {
                factory.setUsername(User.username);
                factory.setUserToken(User.token);
                factory.favourite_catergory = User.favourite_catergory;
                factory.favourite_catergory2 = User.favourite_catergory2;
                // factory.setUserLastEntryDate(User.UserLastEntryDate)
                if(undefined != User.Cart)
                {
                    ShoppingDetails.movies = User.Cart;
                }
            }
            // $log.info(factory.getUserStatus());
        }
        factory.Login = function (username,password) {
            // var login = {
            //     username: $scope.username,
            //     password: $scope.password,
            // }
            // $log.info($cookies.getAll());
            var LastEntryDate = new Date();
            var login = {
                username: username,
                password: password,
            }
            var res = $http.post('http://localhost:8888/clients/login', login, {headers: {'Content-Type': 'application/json'}});
            res.success(function (data, status, headers, config) {
                if(data.length == 0)
                {
                    bootbox.alert("User or Password are invalid, please enter correct user name and password")
                    return;
                }
                $log.info(data);
                var userSession = {"username": data[0].username, "token": data[0].token, "UserStatus": "true", "UserLastEntryDate":factory.userLastEntryDate,
                    "favourite_catergory": data[0].favourite_catergory, "favourite_catergory2": data[0].favourite_catergory2}
                $log.info(userSession);
                if (undefined == $cookies.get(data[0].username)) {
                    $cookies.put(data[0].username, JSON.stringify(userSession));
                }
                else {
                    var logoutUser = JSON.parse($cookies.get(data[0].username));
                    logoutUser.UserStatus = "true";
                    LastEntryDate = logoutUser.UserLastEntryDate;
                    logoutUser.UserLastEntryDate = new Date();
                    factory.favourite_catergory = data[0].favourite_catergory;
                    factory.favourite_catergory2 = data[0].favourite_catergory2;
                    $cookies.put(data[0].username, JSON.stringify(logoutUser));
                }
                $cookies.put('!LastUser', data[0].username);
                // $log.info($cookies.get(data[0].username));
                factory.setUserLastEntryDate(LastEntryDate);
                factory.setUserStatus(true);
                factory.setUserToken(data[0].token);
                factory.setUsername(data[0].username);
                factory.favourite_catergory = data[0].favourite_catergory;
                factory.favourite_catergory2 = data[0].favourite_catergory2;
                factory.loadUserData();
                $http.defaults.headers.common = {'token': factory.getUserToken(),'username' : factory.getUsername()};
                $location.path('/');

            });
            res.error(function (data, status, headers, config) {
                alert("failure message: " + JSON.stringify({data: data}));
            });
        }
        return factory;
    })
    .factory('MoviesUtilities', function ($log) {
        var factory = {};
        factory.getNumber = function (num) {
            var arr = [];
            var i = 0;
            while (i < num) {
                arr.push(i);
                i++;
            }
            ;
            // $log.info(arr);
            return arr;
        }
        factory.pictureLink = function (movie_id) {
            return 'http://localhost:8888/images/ (' + movie_id +").jpg";
        }
        return factory;
    })
    .factory('ShoppingDetails', function ($rootScope, $log,$cookies) {
        var factory = {};

        factory.movies = [];
        factory.getMovies = function () {
            // $log.info(factory.movies);

            return factory.movies;

        }
        factory.addMovie = function (movie,username) {
            if (undefined == factory.movies) {
                factory.movies = [];
            }
            factory.movies.push(movie);
            $log.info("tam tam tam");
            $rootScope.$broadcast('updateShopping');
            factory.updateCookies(username);
        }
        factory.removeMovie = function (movie,username) {
            var index = factory.movies.indexOf(movie);
            factory.movies.splice(index, 1);
            $rootScope.$broadcast('updateShopping');
            factory.updateCookies(username);

        }
        factory.setmovies=function()
        {
            factory.movies = [];
        }
        factory.updateMovieAmount = function (index,movie,username) {
            // $log.info("index: "+ index + " movie amount: "+movie.amount);
            factory.movies[index].amount = movie.amount;
            factory.updateCookies(username);
        }
        factory.updateCookies = function (username) {
            var userCookie = $cookies.get(username);
            var User = JSON.parse(userCookie);
            User.Cart = factory.movies;
            $cookies.put(username, JSON.stringify(User));
        }
        return factory;
    })
    .controller('homeController', function ($scope, $http, $log,ShoppingDetails, UserDetails,MoviesUtilities, $uibModal) {
        $scope.moviesHot = [];
        $scope.moviesNew = [];
        $scope.isLoggedIn = UserDetails.getUserStatus();
        $scope.amount = '1';
        $http.get("http://localhost:8888/movies/bestFive").success(function (response) {
            $scope.moviesHot = response;
        });
        $http.get("http://localhost:8888/movies/newMovies").success(function (response) {
            $scope.moviesNew = response;
        });
        $scope.$on('updateUser', function () {
            $scope.isLoggedIn = UserDetails.getUserStatus();
            // $log.info($scope.isLoggedIn);
        });
        $scope.pictureLink = function (movie_id) {
            return MoviesUtilities.pictureLink(movie_id);
        }
        $scope.addAmountToMovie = function (movie, amount) {
            movie['amount'] = amount;
            // $log.info(movie);
        }
        $scope.addMovieToCart = function (movie, amount) {
            if (amount > 0) {
                $scope.addAmountToMovie(movie, amount);
                // $log.info(movie);
                ShoppingDetails.addMovie(movie,UserDetails.getUsername());
            }

        }
        $scope.getNumber = function (num) {
            return MoviesUtilities.getNumber(num);
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
    })
    .controller('moviesController', function ($scope, $http, $log, $uibModal, ShoppingDetails, MoviesUtilities,$cookies,UserDetails,$location,$anchorScroll) {
        $scope.categories = new Array('Action', 'Adventure', 'Animation', 'Biography','Comedy','Crime','Documentary','Drama','Fantasy','Music','Thriller','Mystery');
        $scope.searchByCategory = "";
        $scope.searchByMovieName = "";
        $scope.movisByCategory = {};
        $scope.amount = '1';
        $scope.showQuantity = 5;
        $scope.recommendedMovies = [];
        // $log.info("test" + UserDetails.favourite_catergory);
        $scope.isLoggedIn = UserDetails.getUserStatus();
      //  $log.info($scope.isLoggedIn);
        $scope.pictureLink = function (movie_id) {
            return MoviesUtilities.pictureLink(movie_id);
        }
        $http.get("http://localhost:8888/movies/getMoviesByCategory?category=" + UserDetails.favourite_catergory).success(function (response) {
            $scope.recommendedMovies.push.apply($scope.recommendedMovies, response);
            $log.info(UserDetails.favourite_catergory);
        });
        $http.get("http://localhost:8888/movies/getMoviesByCategory?category=" + UserDetails.favourite_catergory2).success(function (response) {
            $scope.recommendedMovies.push.apply($scope.recommendedMovies, response);
            // $log.info($scope.recommendedMovies);

        });

        angular.forEach($scope.categories, function (catagory) {
            // Here, the lang object will represent the lang you called the request on for the scope of the function
            $http.get("http://localhost:8888/movies/getMoviesByCategory?category=" + catagory).success(function (response) {
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
        $scope.getNumber = function (num) {
            return MoviesUtilities.getNumber(num);
        };
        $scope.addAmountToMovie = function (movie, amount) {
            movie['amount'] = amount;
            // $log.info(movie);
        }
        $scope.addMovieToCart = function (movie, amount) {
            if (amount > 0) {
                $scope.addAmountToMovie(movie, amount);
                // $log.info(movie);
                ShoppingDetails.addMovie(movie,UserDetails.getUsername());
            }

        }
        $scope.$on('updateUser', function () {
            $scope.isLoggedIn = UserDetails.getUserStatus();
            // $log.info($scope.isLoggedIn);
            // $log.info($scope.isLoggedIn);
        });
        $scope.scrollTo = function(id) {
            var old = $location.hash();
            $location.hash(id);
            $anchorScroll();
            //reset to old to keep any additional routing logic from kicking in
            $location.hash(old);
        };


    })
    .controller('LoginController', function ($scope, $http, $log, UserDetails, $cookies, $location,$uibModal) {
        $scope.username = '';
        $scope.password = '';
        $scope.Login = function () {
            UserDetails.Login($scope.username,$scope.password);
        }
        $scope.RestorePassword=function()
        {
            var modalInstance = $uibModal.open({
                templateUrl: 'Templates/Main/RestorePasswordModalController.html',
                controller: 'RestorePasswordModalController',
            });
        }
    })
    .controller('RegisterController', function ($scope, $http, $log,UserDetails,$location) {
        $scope.countrylist=[];
        var xmlhttp;
        if(window.XMLHttpRequest){
            xmlhttp= new XMLHttpRequest();
        }
        else{
            xmlhttp= new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.open("GET","countries.xml",false);
        xmlhttp.send();
        var xmlDoc=xmlhttp.responseXML;
        $log.info(xmlDoc);
        var doc=xmlDoc.getElementsByTagName("Country");
        for(var i=0; i<doc.length;i++)
        {
           // $scope.countrylist[doc[i].getElementsByTagName("Name")];
            var country_name=doc[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue;
            $scope.countrylist.push(country_name);

            //  $log.info(doc[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue);
        }
        $log.info($scope.countrylist);

        // xmlhttp.close();
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
            // $log.info(user.username);
            // var password= $scope.last_name;

            $http.post('http://localhost:8888/clients/addClient', user, {headers: {'Content-Type': 'application/json'}})
           .success(function (data, status, headers, config) {
                if (data.statusCode!=400)
                {
                    $log.info("111111");
                    //UserDetails.Login($scope.username,$scope.password);
                    $location.path('/Login');
                }
            })
            .error(function (data, status, headers, config) {
                $log.info("3333333");
                bootbox.alert("<h1>register fail</h1>");
            });

        }
    })
    .controller('MovieModalController', function ($scope, $uibModalInstance, movie, $log, $http, MoviesUtilities, ShoppingDetails) {
        $scope.amount = '1';
        $scope.movie = movie;
        $http.get("http://localhost:8888/movies/movieDescription?movie_id=" + movie.movie_id).success(function (response) {
            $scope.movieDescription = response[0];
            // $log.info($scope.movieDescription);
        });
        $scope.ok = function () {
            $uibModalInstance.close($scope.selected.item);
        };
        $scope.pictureLink = function (movie_id) {
            return MoviesUtilities.pictureLink(movie_id);
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.getNumber = function (num) {
            return MoviesUtilities.getNumber(num);
        }
        $scope.addAmountToMovie = function (movie, amount) {
            movie['amount'] = amount;
            // $log.info(movie);
        }
        $scope.addMovieToCart = function (movie, amount) {
            if (amount > 0) {
                $scope.addAmountToMovie(movie, amount);
                // $log.info(movie);
                ShoppingDetails.addMovie(movie);
            }
        }
    })
    .controller('ShoppingCartController', function ($scope, $log, $http, $location, $uibModal, ShoppingDetails, MoviesUtilities,UserDetails, $cookies) {
        $scope.totalPrice = 0;

        $scope.movies = ShoppingDetails.movies;
        angular.forEach($scope.movies, function (movie) {
            $scope.totalPrice = movie.amount * movie.price_dollars + $scope.totalPrice;
            // $log.info(movie);
        })

        $scope.clickContinueShoping = function () {
            $location.path('/Movies');
        }

        $scope.$on('updateShopping', function () {
            $scope.totalPrice = 0;
            $scope.movies = ShoppingDetails.getMovies();
            angular.forEach($scope.movies, function (movie) {
                $scope.totalPrice = movie.amount * movie.price_dollars + $scope.totalPrice;
            })
        });
        $scope.change = function (index,movie) {
            // $log.info("1");

            $scope.totalPrice = 0;
            ShoppingDetails.updateMovieAmount(index,movie,UserDetails.getUsername());
            angular.forEach($scope.movies, function (movie) {
                $scope.totalPrice = movie.amount * movie.price_dollars + $scope.totalPrice;
            })
        }
        $scope.deleteMovieShopingCart = function (movie) {
            ShoppingDetails.removeMovie(movie,UserDetails.getUsername());
        };
        $scope.getorderlist = function () {
            $location.path('/OrdersList');

        }
        $scope.gotoCheckout = function () {
            if (ShoppingDetails.movies.length>0){
            var modalInstance = $uibModal.open({
                templateUrl: 'Templates/Main/CheckoutModal.html',
                controller: 'CheckoutModalController',
            });}
        }
        $scope.pictureLink = function (movie_id) {
            return MoviesUtilities.pictureLink(movie_id);
        }

    })
    .controller('OrderListController',function($scope,$log,$http,$location,$uibModal,UserDetails){
        $scope.OrdersList=[];
        $http.get("http://localhost:8888/orders/previousOrders").success(function (response) {
            $scope.OrdersList = response;

        });
        $scope.goback = function () {
            $location.path('/ShoppingCart');

        }
        $scope.viewOrderInvoice = function (order) {
            var modalInstance = $uibModal.open({
                templateUrl: 'Templates/Main/OrderInvoiceModal.html',
                controller: 'OrderInvoiceModalController',
                size: 'lg',
                resolve: {
                    order: function () {
                        return order;
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
    .controller('CheckoutModalController', function ($scope, $uibModalInstance, $log,$location,$uibModal, $http,ShoppingDetails,UserDetails) {
        $scope.pay="dollar";
        $scope.payment;
        $scope.orderdate;
        $scope.totalPrice=0
        $scope.movies=ShoppingDetails.movies;
        angular.forEach($scope.movies, function (movie) {
            $scope.totalPrice = movie.amount * movie.price_dollars + $scope.totalPrice;
        })
        $scope.payment = $scope.totalPrice;
        $scope.currentDate = new Date();
        $scope.currentDate = $scope.currentDate.setDate($scope.currentDate.getDate() + 7);
        $scope.pay;
        $scope.change = function () {
            $log.info('Modal dismissed at: ');

            if ($scope.pay == "dollar") {
                $scope.payment = $scope.totalPrice;

            }
            else {
                $scope.payment = parseInt($scope.totalPrice) / 3.8;

            }
        }
        // $scope.cancel=function(){
        //     // $location.path('/ShoppingCart');
        //     this.$hide();
        // }
        $scope.viewOrderInvoice = function (order) {
            var modalInstance = $uibModal.open({
                templateUrl: 'Templates/Main/OrderInvoiceModal.html',
                controller: 'OrderInvoiceModalController',
                size: 'lg',
                resolve: {
                    order: function () {
                        return order;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.submit=function(){
           // $log.info(factory.user_token);
            var order = {

                total_cost_dollar:$scope.payment ,
                date_of_purchase:new Date() ,
                token:UserDetails.user_token ,
                date_of_shipment: $scope.orderdate,
                movies: $scope.movies
            };

            // $log.info(order)

            var res = $http.post('http://localhost:8888/orders/addOrder', order, {headers: {'Content-Type': 'application/json'}});
            res.success(function (data, status, headers, config)
            {
                var isANumber = isNaN(data) === false;
                if(isANumber) {
                    order.order_id = data;
                    $scope.viewOrderInvoice(order);
                    ShoppingDetails.setmovies();
                    $uibModalInstance.dismiss('cancel');
                    $location.path('/OrdersList');
                }
                else{
                    var message="<br> <p style= "+'"font-size:160%;"'+">Order was not completed. The following movies are currently out of stock:</p> <br> " +
                        "<p align="+'"center"'+"> ";
                    for ( var i = 0; i < data.length; i++) {
                        message +=(i+1).toString() +". "+ data[i].name + "<br>";
                        // $log.info(data[i]);
                    }
                    message+="</p>"
                    bootbox.alert(message)}
            });
            res.error(function (data, status, headers, config) {
                alert("failure message: " + JSON.stringify({data: data}));
            });
        }

    })
    .controller('NavController', function ($scope, UserDetails, $location, $log, $cookies, ShoppingDetails) {
        UserDetails.loadUserData();
        $scope.username = UserDetails.getUsername();
        $scope.isLoggedIn = UserDetails.getUserStatus();
        $scope.LastEntryDate = UserDetails.getUserLastEntryDate();
        $scope.$on('updateUser', function () {
            $scope.username = UserDetails.getUsername();
            $scope.isLoggedIn = UserDetails.getUserStatus();
            // $log.info($scope.isLoggedIn);
            // $log.info($scope.isLoggedIn);
        });
        $scope.logout = function () {
            $cookies.put('!LastUser', $scope.username)
            $log.info($cookies.get($scope.username));
            var logoutUser = JSON.parse($cookies.get($scope.username));
            logoutUser.UserStatus = "false";
            $cookies.put($scope.username, JSON.stringify(logoutUser));
            $log.info($cookies.get($scope.username));
            UserDetails.setUsername("Guest");
            UserDetails.setUserStatus(false);
            UserDetails.setUserToken("");
            $location.path('/');
            // $log.info(UserDetails.getUserStatus())
        }
        // $scope.setUserName($scope.UserName);
        // $log.info($scope.UserName);


    })
    .controller('OrderInvoiceModalController', function ($scope, $uibModalInstance, order, $log,$http) {
        // $scope.order = order;
        // $log.info(order);
        $http.get("http://localhost:8888/orders/getOrder?order_id="+order.order_id).success(function (response) {
            $scope.order = response[0];
            $http.get("http://localhost:8888/clients/getClientDetails?client_id="+response[0].client_id).success(function (response2) {
                $scope.clientDetails = response2[0];
            });
        });
        $http.get("http://localhost:8888/orders/OrderDetails?order_id="+order.order_id).success(function (response3) {
            $scope.orderDetails = response3;
            $log.info(response3);
        });
        $scope.ok = function () {
            $uibModalInstance.close($scope.selected.item);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })
    .controller('RestorePasswordModalController', function ($scope, $log,$http) {
        $scope.username ;
        $scope.security_answer ;
        $scope.restore=function(){
            $log.info($scope.username);
            $log.info( $scope.security_answer);

           var s= $http.get("http://localhost:8888/clients/restorePassword?username=" + $scope.username+"&security_answer="+ $scope.security_answer)
                .success(function (response) {
                    if(response.length==0)
                    {
                        bootbox.alert("No password found");
                    }
                    else{
                        bootbox.alert("Password found:"+response[0].password);
                    }
            });

        }
    });
