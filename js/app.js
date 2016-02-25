'use strict';

/* App Module */

var travelcartApp = angular.module('travelcartApp', [
    'ngRoute',
    'travelcartControllers',
    'filters'
]);

travelcartApp.config(['$routeProvider',
    function($routeProvider){
        $routeProvider.
            when('/home', {
                templateUrl: 'partials/home.html',
                controller: 'ProductDisplayCtrl'
            }).
            when('/cart', {
                templateUrl: 'partials/cart.html',
                controller: ''
            }).
            when('/product/:id', {
                templateUrl: 'partials/productDetail.html',
                controller: ''
            }).
            when('/search/date/:startDate/:endDate', {
                templateUrl: 'partials/home.html',
                controller: 'ProductSearchCtrl'
            }).
            when('/admin/product/mgt', {
                templateUrl: 'partials/admin/productMgt.html',
                controller: ''
            }).
            when('/admin/product/edit/:id', {
                templateUrl: 'partials/admin/productEdit.html',
                controller: ''
            }).
            when('/admin/product/add', {
                templateUrl: 'partials/admin/productAdd.html',
                controller: ''
            }).
            when('/admin/order/mgt', {
                templateUrl: 'partials/admin/orderMgt.html',
                controller: ''
            }).
            when('/admin/comment/mgt', {
                templateUrl: 'partials/admin/commentMgt.html',
                controller: ''
            }).
            when('/admin/comment/detail/:id', {
                templateUrl: 'partials/admin/commentDetail.html',
                controller: ''
            }).
            when('/member/order/mgt', {
                templateUrl: 'partials/member/orderMgt.html',
                controller: ''
            }).
            when('/member/comment', {
                templateUrl: 'partials/member/comment.html',
                controller: ''
            }).
            when('/member/trans/success', {
                templateUrl: 'partials/member/successTrans.html',
                controller: ''
            }).
            when('/member/trans/fail', {
                templateUrl: 'partials/member/failTrans.html',
                controller: ''
            }).
            otherwise({
                redirectTo: '/home'
            });
    }]);

travelcartApp.factory('UserService', [function(){

    var myUser = new User();

    return {
        userObj : myUser
    };
}]);

travelcartApp.factory('CartService', [function(){

    var myCart = new Cart('TravelCart');

    return {
        cartObj : myCart
    };
}]);


/**
 * Truncate Filter
 * @Param text
 * @Param length, default is 10
 * @Param end, default is "..."
 * @return string
 */
angular.module('filters', []).
    filter('truncate', function () {
        return function (text, length, end) {
            if (isNaN(length))
                length = 10;

            if (end === undefined)
                end = "...";

            if (text.length <= length || text.length - end.length <= length) {
                return text;
            }
            else {
                return String(text).substring(0, length-end.length) + end;
            }

        };
    });

/**
 * Usage
 *
 * var myText = "This is an example.";
 *
 * {{myText|Truncate}}
 * {{myText|Truncate:5}}
 * {{myText|Truncate:25:" ->"}}
 * Output
 * "This is..."
 * "Th..."
 * "This is an e ->"
 *
 */
