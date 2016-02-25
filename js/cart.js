

function Cart(cartName){

    this.clearCart = false;
    this.items = [];

    // load items from local storage when initializing
    this.loadItems();

    // save items to local storage when unloading
    var self = this;
    $(window).unload(function(){
        if(self.clearCart){
            self.clearItems();
        }
        self.saveItems();
        self.clearCart = false;
    });
}

// save items to local storage
Cart.prototype.saveItems = function(){
    if(localStorage != null && JSON != null){
        localStorage[this.cartName + "_items"] = JSON.stringify(this.items);
    }
}

// load items from local storage
Cart.prototype.loadItems = function(){
    var items = localStorage != null ? localStorage[this.cartName + "_items"] : null;
    if(items != null && JSON != null){
        try{
            var items = JSON.parse(items);
            for(var i = 0; i < items.length; i++){
                var item = items[i];
                if(item.id != null && item.name != null && item.price != null && item.quantity != null){
                    item = new CartItem(item.id, item.name, item.price, item.quantity);
                    this.items.push(item);
                }
            }
        }
        catch(err){
            // ignore errors while loading...
        }
    }
}

// adds an item to the cart
Cart.prototype.addItem = function(id, name, price, quantity){
    quantity = this.toNumber(quantity);
    if(quantity != 0){

        // update quantity for existing item
        var found =false;
        for (var i = 0; i < this.items.length && !found; i++){
            var item = this.items[i];
            if(item.id == id){
                found = true;
                item.quantity = this.toNumber(item.quantity + quantity);
                if(item.quantity <= 0){
                    this.items.splice(i, 1);    // remove that item
                }
            }
        }

        // new item, add now
        if(!found){
            var item = new CartItem(id, name, price, quantity);
            this.items.push(item);
        }

        // save changes
        this.saveItems();
    }
}

// deletes an item from the cart
Cart.prototype.deleteItem = function(id){

    for (var i = 0; i < this.items.length; i++){
        var item = this.items[i];
        if(item.id == id){
            this.items.splice(i, 1);    // remove that item
        }
    }

}

// clear the cart
Cart.prototype.clearItems = function () {
    this.items = [];
    this.saveItems();
}

// get the total price for all items currently in the cart
Cart.prototype.getTotalPrice = function(id){
    var total = 0;
    for (var i = 0; i < this.items.length; i++){
        var item = this.items[i];
        if(id == null || item.id == id){
            total += this.toNumber(item.quantity * item.price);
        }
    }
    return total;
}

// get the total count for all items currently in the cart
Cart.prototype.getTotalCount = function(id){
    var count = 0;
    for (var i = 0; i < this.items.length; i++){
        var item = this.items[i];
        if(id == null || item.id == id) {
            count += this.toNumber(item.quantity);
        }
    }
    return count;
}

Cart.prototype.toNumber = function (value) {
    value = value * 1;
    return isNaN(value) ? 0 : value;
}


//----------------------------------------------------------------
// items in the cart
//
function CartItem(id, name, price, quantity){
    this.id = id;
    this.name = name;
    this.price = price * 1;
    this.quantity = quantity * 1;
}