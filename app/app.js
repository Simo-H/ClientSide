'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
    'ngRoute',
    'myApp.View.Home',
    'myApp.view2',
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
    .factory('UserDetails', function ($rootScope, $log,$cookies,ShoppingDetails,$location,$http) {
        var factory = {};
        factory.isLoggedIn = false;
        factory.userName = "Guest";
        factory.user_id;
        factory.dollar = true;

        factory.getUserStatus = function () {
            return factory.isLoggedIn;
        }
        factory.getUserId = function () {
            return factory.user_id;
        }
        factory.setUserStatus = function (status) {
            factory.isLoggedIn = status;
            // $log.info(status);
            $rootScope.$broadcast('updateUser');
            // $log.info(factory.isLoggedIn);
        }
        factory.setUserId = function (userId) {
            factory.user_id = userId;

            $rootScope.$broadcast('updateUser');
            $log.info(factory.user_id);
        }
        factory.getUserName = function () {
            return factory.userName;
        }
        factory.setUserName = function (name) {
            factory.userName = name;

            $rootScope.$broadcast('updateUser');

        }
        factory.loadUserData = function () {
            var lastUserLoggedIn = $cookies.get('!LastUser');
            var firstLogin = undefined != lastUserLoggedIn;
            if(firstLogin)
            {
                var User = JSON.parse($cookies.get(lastUserLoggedIn));
            }
            factory.setUserStatus(firstLogin && User.UserStatus === 'true');
            if (factory.getUserStatus() === true)
            {
                factory.setUserName(User.userName);
                factory.setUserId(User.UserID);
                if(undefined != User.Cart)
                {
                    ShoppingDetails.movies = User.Cart;
                }
            }
        }
        factory.Login = function (username,password) {
            // var login = {
            //     username: $scope.username,
            //     password: $scope.password,
            // }
            var login = {
                username: username,
                password: password,
            }
            var res = $http.post('http://localhost:8888/clients/login', login, {headers: {'Content-Type': 'application/json'}});
            res.success(function (data, status, headers, config) {
                var userSession = {"userמame": data[0].username, "UserID": data[0].client_id, "UserStatus": "true"}

                if (undefined == $cookies.get(data[0].username)) {
                    $cookies.put(data[0].username, JSON.stringify(userSession));
                }
                else {
                    var logoutUser = JSON.parse($cookies.get(data[0].username));
                    logoutUser.UserStatus = "true";
                    // $log.info(logoutUser);
                    $cookies.put(data[0].username, JSON.stringify(logoutUser));
                }
                $cookies.put('!LastUser', data[0].username);
                // $log.info($cookies.get(data[0].username));
                factory.setUserStatus(true);
                factory.setUserId(data[0].client_id);
                factory.setUserName(data[0].username);
                factory.loadUserData();
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
        return factory;
    })
    .factory('ShoppingDetails', function ($rootScope, $log,$cookies) {
        var factory = {};

        factory.movies = [];
        factory.getMovies = function () {
            $log.info(factory.movies);

            return factory.movies;

        }
        factory.addMovie = function (movie,userName) {
            if (undefined == factory.movies) {
                factory.movies = [];
            }
            factory.movies.push(movie);
            $log.info("tam tam tam");
            $rootScope.$broadcast('updateShopping');
            factory.updateCookies(userName);
        }
        factory.removeMovie = function (movie,userName) {
            var index = factory.movies.indexOf(movie);
            factory.movies.splice(index, 1);
            $rootScope.$broadcast('updateShopping');
            factory.updateCookies(userName);

        }
        factory.setmovies=function()
        {
            factory.movies = [];
        }
        factory.updateMovieAmount = function (index,movie,userName) {
            $log.info("index: "+ index + " movie amount: "+movie.amount);
            factory.movies[index].amount = movie.amount;
            factory.updateCookies(userName);
        }
        factory.updateCookies = function (userName) {
            var userCookie = $cookies.get(userName);
            var User = JSON.parse(userCookie);
            User.Cart = factory.movies;
            $cookies.put(userName, JSON.stringify(User));
        }
        return factory;
    })
    .controller('homeController', function ($scope, $http, $log, UserDetails) {
        $scope.moviesHot = [];
        $scope.moviesNew = [];
        $scope.isLoggedIn = UserDetails.getUserStatus();
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
            return 'http://localhost:8888/images/ (' + movie_id +").jpg";
        }
    })
    .controller('moviesController', function ($scope, $http, $log, $uibModal, ShoppingDetails, MoviesUtilities,$cookies,UserDetails) {
        $scope.categories = new Array('Action', 'Adventure', 'Animation', 'Biography','Comedy','Crime','Documentary','Drama','Fantasy','Music','Thriller','Mystery');
        $scope.searchByCategory = "";
        $scope.searchByMovieName = "";
        $scope.movisByCategory = {};
        $scope.amount = '1';
        $scope.showQuantity = 5;
        $scope.pictureLink = function (movie_id) {
            return 'http://localhost:8888/images/ (' + movie_id +").jpg";
        }
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
                ShoppingDetails.addMovie(movie,UserDetails.getUserName());
            }

        }

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
    .controller('RegisterController', function ($scope, $http, $log,UserDetails) {
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
            $log.info(user.username);
            // var password= $scope.last_name;






            var res = $http.post('http://localhost:8888/clients/addClient', user, {headers: {'Content-Type': 'application/json'}});
            res.success(function (data, status, headers, config) {
                $scope.message = data;
                // $log.info(first_name);

                UserDetails.Login($scope.username,$scope.password);
            });
            res.error(function (data, status, headers, config) {
                alert("failure message: " + JSON.stringify({data: data}));
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
    .controller('ShoppingCartController', function ($scope, $log, $http, $location, $uibModal, ShoppingDetails, UserDetails, $cookies) {
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
            ShoppingDetails.updateMovieAmount(index,movie,UserDetails.getUserName());
            angular.forEach($scope.movies, function (movie) {
                $scope.totalPrice = movie.amount * movie.price_dollars + $scope.totalPrice;
            })
        }
        $scope.deleteMovieShopingCart = function (movie) {
            ShoppingDetails.removeMovie(movie,UserDetails.getUserName());
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

    })
    .controller('OrderListController',function($scope,$log,$http,$location,$uibModal,UserDetails){
        $scope.OrdersList=[];
        $http.get("http://localhost:8888/orders/previousOrders?client_id="+UserDetails.user_id).success(function (response) {
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
           // $log.info(factory.user_id);
            var order = {

                total_cost_dollar:$scope.payment ,
                date_of_purchase:new Date() ,
                client_id:UserDetails.user_id ,
                date_of_shipment: $scope.orderdate,
                movies: $scope.movies
            };

            $log.info(order)

            var res = $http.post('http://localhost:8888/orders/addOrder', order, {headers: {'Content-Type': 'application/json'}});
            res.success(function (data, status, headers, config)
            {
                var isANumber = isNaN(data) === false;
                if(isANumber) {
                    order.order_id = data;
                    $scope.viewOrderInvoice(order);
                    ShoppingDetails.setmovies();
                    $location.path('/OrdersList');
                }
                else{
                    var message="<br> <p style= "+'"font-size:160%;"'+">Order was not completed. The following movies are currently out of stock:</p> <br> " +
                        "<p align="+'"center"'+"> ";
                    for ( var i = 0; i < data.length; i++) {
                        message +=(i+1).toString() +". "+ data[i].name + "<br>";
                        $log.info(data[i]);
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
        $scope.userName = UserDetails.getUserName();
        $scope.isLoggedIn = UserDetails.getUserStatus();
        $scope.$on('updateUser', function () {
            $scope.userName = UserDetails.getUserName();
            $scope.isLoggedIn = UserDetails.getUserStatus();
            // $log.info($scope.isLoggedIn);
            // $log.info($scope.isLoggedIn);
        });
        $scope.logout = function () {
            $cookies.put('!LastUser', $scope.userName)
            var logoutUser = JSON.parse($cookies.get($scope.userName));
            logoutUser.UserStatus = "false";
            // $log.info($cookies.get($scope.userName));
            $cookies.put($scope.userName, JSON.stringify(logoutUser));
            UserDetails.setUserName("Guest");
            UserDetails.setUserStatus(false);
            UserDetails.setUserId("");
            $location.path('/');
            // $log.info(UserDetails.getUserStatus())
        }
        // $scope.setUserName($scope.UserName);
        // $log.info($scope.UserName);


    })
    .controller('OrderInvoiceModalController', function ($scope, $uibModalInstance, order, $log) {
        $scope.order = order;
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
