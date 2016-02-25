
function  User(){
    this.id = '';
    this.email = '';
    this.name = '';
    this.role = '';
    this.isLogged = '0';

    // load user from local storage when initializing
    this.loadUser();
}

// save user (login)
User.prototype.saveUser = function () {
    if (localStorage != null) {
        localStorage.userId = this.id;
        localStorage.userEmail = this.email;
        localStorage.userName = this.name;
        localStorage.userRole = this.role;
        localStorage.userIsLogged = this.isLogged;
    }
}

User.prototype.loadUser = function () {
    if (localStorage != null) {

        this.id = localStorage.userId != null ? localStorage.userId : '';
        this.email = localStorage.userEmail != null ? localStorage.userEmail : '';
        this.name = localStorage.userName != null ? localStorage.userName : '';
        this.role = localStorage.userRole != null ? localStorage.userRole : '';
        this.isLogged = localStorage.userIsLogged != null ? localStorage.userIsLogged : '0';
    }
}

// clear user (logout)
User.prototype.clearUser = function () {
    this.id = '';
    this.email = '';
    this.name = '';
    this.role = '';
    this.isLogged = '0';
    this.saveUser();
}