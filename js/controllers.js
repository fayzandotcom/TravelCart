'use strict';

/* Controllers */

var travelcartControllers = angular.module('travelcartControllers', []);

/*
    Ctrl to perform User related functions
    - Login
    - Registration
    - Change Password
    - Logout
 */
travelcartControllers.controller('UserCtrl', ['$scope', '$http', 'UserService', 'CartService',
    function($scope, $http, UserService, CartService){

        $scope.loginFormView = '1';
        $scope.regFormView = '0';
        $scope.userMenuView = '1';
        $scope.passChangeView = '0';
        $scope.successMsg = '';
        $scope.errorMsg = '';

        // get user object
        $scope.userObj = UserService.userObj;

        $scope.showRegForm = function(){
            $scope.successMsg = '';
            $scope.errorMsg = '';
            $scope.regFormView = '1';
            $scope.loginFormView = '0';
        }

        $scope.showLoginForm = function(){
            $scope.successMsg = '';
            $scope.errorMsg = '';
            $scope.regFormView = '0';
            $scope.loginFormView = '1';
        }

        $scope.showUserMenu = function(){
            $scope.successMsg = '';
            $scope.errorMsg = '';
            $scope.userMenuView = '1';
            $scope.passChangeView = '0';
        }

        $scope.showPassChange = function(){
            $scope.successMsg = '';
            $scope.errorMsg = '';
            $scope.userMenuView = '0';
            $scope.passChangeView = '1';

        }

        $scope.login = function(){
            $scope.successMsg = '';
            $scope.errorMsg = '';
            $scope.email = $("#email").val();
            $scope.password = $("#password").val();

            // required field validation
            if($scope.email=='' || $scope.password==''){
                return;
            }

            var config = {
                method: 'POST',
                url: 'http://localhost/travelcart-api/user/get',
                data: "email="+$scope.email+"&password="+$scope.password,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            };
            $http(config)
                .success(function(data, status, headers, config){
                    if(data.id){
                        $scope.userObj.isLogged = '1';
                        $scope.userObj.id = data.id;
                        $scope.userObj.email = data.email;
                        $scope.userObj.name = data.name;
                        $scope.userObj.role = data.role;

                        // save logged user to local storage
                        $scope.userObj.saveUser();
                    }else{
                        $scope.errorMsg = "Access Denied!"
                    }
                })
                .error(function(data, status, headers, config){
                    $scope.userObj.isLogged = '0';
                    $scope.userObj.id = '';
                    $scope.userObj.email = '';
                    $scope.userObj.name = '';
                    $scope.userObj.role = '';

                    $scope.errorMsg = "Access Denied!"
                });
        }

        $scope.logout = function(){
            $scope.successMsg = '';
            $scope.errorMsg = '';
            // clear the logged user
            $scope.userObj.clearUser();

            // get cart object
            $scope.cartObj = CartService.cartObj;
            // clear cart items
            $scope.cartObj.clearItems();
        }

        $scope.register = function(){
            $scope.successMsg = '';
            $scope.errorMsg = '';
            $scope.reg_name = $("#reg_name").val();
            $scope.reg_email = $("#reg_email").val();
            $scope.reg_password = $("#reg_password").val();
            $scope.reg_repassword = $("#reg_repassword").val();

            // required field validation
            if($scope.reg_name=='' || $scope.reg_email=='' || $scope.reg_password=='' || $scope.reg_repassword==''){
                return;
            }
            // password match validation
            if($scope.reg_password!=$scope.reg_repassword){
                $scope.errorMsg = "Password not match!";
                return;
            }

            var config = {
                method: 'POST',
                url: 'http://localhost/travelcart-api/user/create',
                data: "email="+$scope.reg_email+"&password="+$scope.reg_password+"&name="+$scope.reg_name+"&role=member",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            };
            $http(config)
                .success(function(data, status, headers, config){
                    if(data.id){
                        $scope.successMsg = 'User created successfully!';
                        $scope.reg_name = '';
                        $scope.reg_email = '';
                        $scope.reg_password = '';
                        $scope.reg_repassword = '';
                    }else{
                        $scope.errorMsg = 'Fail to create user!';
                    }
                })
                .error(function(data, status, headers, config){
                    $scope.errorMsg = 'Fail to create user!';
                });
        }

        $scope.changePass = function(){
            $scope.successMsg = '';
            $scope.errorMsg = '';
            $scope.cg_password = $("#cg_password").val();
            $scope.cg_repassword = $("#cg_repassword").val();

            // required field validation
            if($scope.cg_password=='' || $scope.cg_repassword==''){
                return;
            }
            // password match validation
            if($scope.cg_password!=$scope.cg_repassword){
                $scope.errorMsg = "Password not match!";
                return;
            }

            var config = {
                method: 'POST',
                url: 'http://localhost/travelcart-api/user/change/password',
                data: "email="+$scope.userObj.email+"&password="+$scope.cg_password,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            };
            $http(config)
                .success(function(data, status, headers, config){
                    if(data.status){
                        $scope.successMsg = 'Password changed successfully!';
                        $scope.cg_password = '';
                        $scope.cg_repassword = '';
                    }else{
                        $scope.errorMsg = 'Fail to change password!';
                    }
                })
                .error(function(data, status, headers, config){
                    $scope.errorMsg = 'Fail to change password!';
                });
        }

    }]);

/*
 Ctrl to display products and add to cart
 - Display products
 - Add to cart
 */
travelcartControllers.controller('ProductDisplayCtrl', ['$scope', '$http', 'CartService',
    function($scope, $http, CartService){

        // get cart object
        $scope.cartObj = CartService.cartObj;

        // get products
        var proConfig = {
            method: 'GET',
            url: 'http://localhost/travelcart-api/products'
        };
        $http(proConfig)
            .success(function(data, status, headers, config){
                $scope.products = data;
            })
            .error(function(data, status, headers, config){
                //$scope.errorMsg = 'Fail to change password!';
            });

    }]);

/*
 Ctrl to display detail of product and add to cart
 - Display product details
 - Add to cart
 */
travelcartControllers.controller('ProductDetailCtrl', ['$scope', '$http', '$routeParams', 'CartService',
    function($scope, $http, $routeParams, CartService){

        var pid = $routeParams.id;

        // get cart object
        $scope.cartObj = CartService.cartObj;

        // get products
        var proConfig = {
            method: 'GET',
            url: 'http://localhost/travelcart-api/product/'+pid
        };
        $http(proConfig)
            .success(function(data, status, headers, config){
                $scope.product = data[0];
            })
            .error(function(data, status, headers, config){
                //$scope.errorMsg = 'Fail to change password!';
            });

    }]);

/*
 Ctrl to display cart summary
 - Display items in cart
 - Total price
 */
travelcartControllers.controller('CartSummaryCtrl', ['$scope', '$http', 'CartService',
    function($scope, $http, CartService){

        $scope.totalItems = function (){
            return CartService.cartObj.getTotalCount();
        }

        $scope.totalPrice = function(){
            return CartService.cartObj.getTotalPrice();
        }

    }]);

/*
 Ctrl to display cart details
 - Item, quantity, unit price, total price. And grand total
 - Also option to checkout
 */
travelcartControllers.controller('CartDetailCtrl', ['$scope', '$http', 'CartService', 'UserService',
    function($scope, $http, CartService, UserService){

        $scope.items = CartService.cartObj.items;
        $scope.totalPrice = function(){
          return CartService.cartObj.getTotalPrice();
        }

        // used to add and delete items. pass negative value to delete
        $scope.addItem = function(id, name, price, qty){
            CartService.cartObj.addItem(id, name, price, qty);
        }

        // delete item by id
        $scope.deleteItem = function(id){
            CartService.cartObj.deleteItem(id);
        }

        // check if the cart have items
        $scope.hasItems = function(){
            if($scope.items != ''){
                return true;
            }else{
                return false;
            }
        }

        $scope.clearCart = function(){
            var r=confirm("Are you sure want to clear cart items?");
            if(r==true){
                CartService.cartObj.clearItems();
                location.reload();
            }
        }

        $scope.checkOut = function() {

            $scope.userObj = UserService.userObj;

            if($scope.userObj.role != 'member'){
                alert('Please signin as member first.')
                return;
            }

            // paypal params
            var paypalUrl = 'https://www.sandbox.paypal.com/cgi-bin/webscr';
            var paypalParam = {
                cmd : '_cart',
                upload : '1',
                business : 'shoptest@travelcart.com',
                currency_code : 'USD',
                custom : $scope.userObj.id // userid as custom field
            };

            for (var i = 0; i < $scope.items.length; i++){
                var item = $scope.items[i];

                var date = getCurrentDate();
                var name = item.name;
                var price = item.price;
                var quantity = item.quantity;
                var u_id = $scope.userObj.id;

                var param = "date="+date+"&p_name="+name+"&p_price="+price+"&p_quantity="+quantity+"&u_id="+u_id+"&status=0";
                var config = {
                    method: 'POST',
                    url: 'http://localhost/travelcart-api/order/create',
                    data: param,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                };
                $http(config)
                    .success(function(data, status, headers, config){
                        if(data.id){
                            //alert('success');
                        }else{
                            //alert('fail1');
                        }
                    })
                    .error(function(data, status, headers, config){
                        //alert('fail2');
                    });

                // add items to paypalParam
                var no = i+1;
                paypalParam["item_name_"+no] = name;
                paypalParam["amount_"+no] = price;
                paypalParam["quantity_"+no] = quantity;

            }

            // post to paypal
            post_to_url(paypalUrl, paypalParam, 'POST');
        }

    }]);

/*
 Ctrl to search by date
 - Product search by date and date range
 */
travelcartControllers.controller('ProductSearchCtrl', ['$scope', '$http', '$routeParams', 'CartService',
    function($scope, $http, $routeParams, CartService){

        var startDate = $routeParams.startDate;
        var endDate = $routeParams.endDate;

        // get cart object
        $scope.cartObj = CartService.cartObj;

        // get products by date range
        var proConfig = {
            method: 'GET',
            url: 'http://localhost/travelcart-api/product/date/'+startDate+'/'+endDate
        };
        $http(proConfig)
            .success(function(data, status, headers, config){
                $scope.products = data;
            })
            .error(function(data, status, headers, config){
                //$scope.errorMsg = 'Fail to change password!';
            });

    }]);

travelcartControllers.controller('SearchCtrl', ['$scope', '$location',
    function($scope, $location){

        $scope.search = function(){
            var startDate = $('#startdate').val();
            var endDate = $('#enddate').val();

            if(startDate=='' || startDate == null){
                alert('Please select date.');
                return;
            }

            if(endDate=='' || endDate == null){
                endDate = startDate;
            }

            $location.path('/search/date/'+startDate+'/'+endDate);
        }

    }]);

/*
 Ctrl to manage products
 - Display products
 - Delete products
 */
travelcartControllers.controller('ProductMgtCtrl', ['$scope', '$http', 'UserService',
    function($scope, $http, UserService){

        $scope.userObj = UserService.userObj;

        // get products
        var proConfig = {
            method: 'GET',
            url: 'http://localhost/travelcart-api/products'
        };
        $http(proConfig)
            .success(function(data, status, headers, config){
                $scope.products = data;
            })
            .error(function(data, status, headers, config){
                //$scope.errorMsg = 'Fail to change password!';
            });

        $scope.deleteProduct = function(id){
            //alert(id);
            var r=confirm("Are you sure want to delete this product?");
            if(r==false){
                //alert('false');
                return;
            }
            // delete product
            var config = {
                method: 'GET',
                url: 'http://localhost/travelcart-api/product/delete/id/'+id
            };
            $http(config)
                .success(function(data, status, headers, config){
                    //$scope.products = data;
                })
                .error(function(data, status, headers, config){
                    //$scope.errorMsg = 'Fail to change password!';
                });

            location.reload();
        }

    }]);

/*
 Ctrl to edit product
 - Get product by id
 - Edit product
 */
travelcartControllers.controller('ProductEditCtrl', ['$scope', '$http', '$routeParams', 'UserService',
    function($scope, $http, $routeParams, UserService){

        $scope.userObj = UserService.userObj;

        var pid = $routeParams.id;

        $(document).ready(function(){
            $('#date').datepicker();
        });

        // get product
        var proConfig = {
            method: 'GET',
            url: 'http://localhost/travelcart-api/product/'+pid
        };
        $http(proConfig)
            .success(function(data, status, headers, config){
                $scope.product = data[0];
            })
            .error(function(data, status, headers, config){
                //$scope.errorMsg = 'Fail to change password!';
            });

        $scope.editProduct = function(){
            var id = $('#pid').val();
            var name = $('#name').val();
            var desc = $('#desc').val();
            var price = $('#price').val();
            var image = $('#selImg');
            var imgSrc = image.attr("src");
            var date = $('#date').val();
            var days = $('#days').val();
            var nights = $('#nights').val();

            $scope.successMsg = '';
            $scope.errorMsg = '';

            // empty field check
            if(name=='' || desc=='' || price=='' || date == '' || days=='' || nights==''){
                alert('Please fill the required fields');
                return;
            }

            // check numeric values
            if(isNaN(price)){alert('Price should be in numeric'); return;}
            if(isNaN(days)){alert('Days should be in numeric'); return;}
            if(isNaN(nights)){alert('Nights should be in numeric'); return;}


            var config = {
                method: 'POST',
                url: 'http://localhost/travelcart-api/product/edit',
                data: "id="+id+"&name="+name+"&desc="+desc+"&price="+price+"&image="+imgSrc+"&date="+date+"&days="+days+"&nights="+nights,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            };
            $http(config)
                .success(function(data, status, headers, config){
                    if(data.status){
                        $scope.successMsg = 'Product updated successfully!';
                    }else{
                        $scope.errorMsg = 'Fail to edit product!';
                    }
                })
                .error(function(data, status, headers, config){
                    $scope.errorMsg = 'Fail to edit product!';
                });
        }

    }]);

/*
 Ctrl to add product
 - add product
 */
travelcartControllers.controller('ProductAddCtrl', ['$scope', '$http', 'UserService',
    function($scope, $http, UserService){

        $scope.userObj = UserService.userObj;

        $(document).ready(function(){
            $('#date').datepicker();
        });

        $scope.addProduct = function(){
            var name = $('#name').val();
            var desc = $('#desc').val();
            var price = $('#price').val();
            var image = $('#selImg');
            var imgSrc = image.attr("src");
            var date = $('#date').val();
            var days = $('#days').val();
            var nights = $('#nights').val();

            $scope.successMsg = '';
            $scope.errorMsg = '';

            // empty field check
            if(name=='' || desc=='' || price=='' || date == '' || days=='' || nights==''){
                alert('Please fill the required fields');
                return;
            }

            // check numeric values
            if(isNaN(price)){alert('Price should be in numeric'); return;}
            if(isNaN(days)){alert('Days should be in numeric'); return;}
            if(isNaN(nights)){alert('Nights should be in numeric'); return;}


            var config = {
                method: 'POST',
                url: 'http://localhost/travelcart-api/product/create',
                data: "name="+name+"&desc="+desc+"&price="+price+"&image="+imgSrc+"&date="+date+"&days="+days+"&nights="+nights,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            };
            $http(config)
                .success(function(data, status, headers, config){
                    if(data.id){
                        $scope.successMsg = 'Product created successfully!';
                    }else{
                        $scope.errorMsg = 'Fail to create product!';
                    }
                })
                .error(function(data, status, headers, config){
                    $scope.errorMsg = 'Fail to create product!';
                });
        }

    }]);

/*
 Ctrl to upload image
 - upload image
 */
travelcartControllers.controller('ImageUploadCtrl', ['$scope', '$http',
    function($scope, $http){

        $scope.uploadFile = function(files) {
            var fd = new FormData();
            //Take the first selected file
            fd.append("fileToUpload", files[0]);

            $http.post('http://localhost/TravelCart/lib/php/upload.php', fd, {
                withCredentials: true,
                headers: {'Content-Type': undefined },
                transformRequest: angular.identity
            }).success(function(data, status, headers, config){
                    if(data.status==true){
                        $("#selImg").attr("src","img/products/"+data.name);
                    }else{
                        alert('Incorrect file format!');
                    }
                })
              .error(function(data, status, headers, config){
                    alert('Unable to upload image');
              });

        };

    }]);

/*
 Ctrl to manage orders
 - Display orders
 - Delete orders
 - Process orders (change status)
 */
travelcartControllers.controller('OrderMgtCtrl', ['$scope', '$http', 'UserService',
    function($scope, $http, UserService){

        $scope.userObj = UserService.userObj;

        // get orders
        var url = '';
        if($scope.userObj.role == 'admin'){
            url = 'http://localhost/travelcart-api/orders';
        }else{
            var uid = $scope.userObj.id;
            url = 'http://localhost/travelcart-api/order/user/'+uid;
        }
        var proConfig = {
            method: 'GET',
            url: url
        };
        $http(proConfig)
            .success(function(data, status, headers, config){
                $scope.orders = data;
            })
            .error(function(data, status, headers, config){
                //$scope.errorMsg = 'Fail to change password!';
            });

        $scope.deleteOrder = function(id){
            var r=confirm("Are you sure want to delete this order?");
            if(r==false){
                return;
            }
            // delete order
            var config = {
                method: 'GET',
                url: 'http://localhost/travelcart-api/order/delete/id/'+id
            };
            $http(config)
                .success(function(data, status, headers, config){

                })
                .error(function(data, status, headers, config){

                });

            location.reload();
        }

        $scope.changeStatus = function(id, status){
            // change order status
            var config = {
                method: 'POST',
                url: 'http://localhost/travelcart-api/order/change/status',
                data: "id="+id+"&status="+status,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            };
            $http(config)
                .success(function(data, status, headers, config){

                })
                .error(function(data, status, headers, config){

                });
            location.reload();
        }

    }]);

/*
 Ctrl to manage comments
 - Display comments
 - Delete comments
 */
travelcartControllers.controller('CommentMgtCtrl', ['$scope', '$http', 'UserService',
    function($scope, $http, UserService){

        $scope.userObj = UserService.userObj;

        // get comments
        var url = '';
        if($scope.userObj.role == 'admin'){
            url = 'http://localhost/travelcart-api/comments';
        }else{
            var uid = $scope.userObj.id;
            url = 'http://localhost/travelcart-api/comment/user/'+uid;
        }
        var proConfig = {
            method: 'GET',
            url: url
        };
        $http(proConfig)
            .success(function(data, status, headers, config){
                $scope.comments = data;
            })
            .error(function(data, status, headers, config){
                //$scope.errorMsg = 'Fail to change password!';
            });

        $scope.deleteComment = function(id){
            var r=confirm("Are you sure want to delete this comment/feedback/enquiry?");
            if(r==false){
                return;
            }
            // delete comment
            var config = {
                method: 'GET',
                url: 'http://localhost/travelcart-api/comment/delete/id/'+id
            };
            $http(config)
                .success(function(data, status, headers, config){

                })
                .error(function(data, status, headers, config){

                });

            location.reload();
        }

        $scope.sendComment = function(){

            var date = getCurrentDate();
            var uid = $scope.userObj.id;
            var type = $('#type').val();
            var desc = $('#desc').val();
            var param = "date="+date+"&u_id="+uid+"&type="+type+"&desc="+desc;

            $scope.successMsg = '';
            $scope.errorMsg = '';

            if (desc==''){
                alert('Please write message first.');
                return;
            }

            // new comment
            var config = {
                method: 'POST',
                url: 'http://localhost/travelcart-api/comment/create',
                data: param,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            };
            $http(config)
                .success(function(data, status, headers, config){
                    if(data.id){
                        $scope.successMsg = "Your message has been sent successfully!";
                    }else{
                        $scope.errorMsg = "Unable to send your message. Please try again.";
                    }
                })
                .error(function(data, status, headers, config){
                    $scope.errorMsg = "Unable to send your message. Please try again.";
                });
        }

    }]);

/*
 Ctrl to display comment
 */
travelcartControllers.controller('CommentDetailCtrl', ['$scope', '$http', '$routeParams', 'UserService',
    function($scope, $http, $routeParams, UserService){

        var id = $routeParams.id;

        $scope.userObj = UserService.userObj;

        // get comment
        var proConfig = {
            method: 'GET',
            url: 'http://localhost/travelcart-api/comment/'+id
        };
        $http(proConfig)
            .success(function(data, status, headers, config){
                $scope.comment = data[0];
            })
            .error(function(data, status, headers, config){
                //$scope.errorMsg = 'Fail to change password!';
            });

    }]);

// create form and submit
function post_to_url(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}

// get current date
function getCurrentDate(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd
    }

    if(mm<10) {
        mm='0'+mm
    }

    today = yyyy +"-"+ mm +"-"+ dd;
    return today;
}