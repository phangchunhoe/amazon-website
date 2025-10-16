class Cart {
    cartItems = JSON.parse(localStorage.getItem(this.#localStorageKey)) || [{
            Id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
            quantity: 1,
            deliveryOptionId: '1'
        }, {
            Id: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
            quantity: 2,
            deliveryOptionId: '2'
    }];

    #localStorageKey;

    constructor(localStorageKey) {
        // console.log('Constructing...');
        this.#localStorageKey = localStorageKey;

        this.cartItems = [{
            Id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
            quantity: 1,
            deliveryOptionId: '1'
        }, {
            Id: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
            quantity: 7,
            deliveryOptionId: '2'
        }];
    }

    saveNewQuantity(productId, quantity) {
        for (let i = 0; i < this.cartItem.length; i++) {
            // compare using the same property name the cart uses (Id), normalize to string
            if (String(this.cartItems[i].Id) === String(productId)) {
                this.cartItems[i].quantity = quantity;
                localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems));
            break;
            };
        };
    };

    addToCart(productId, quantityValue) {
    // Check whether there is matching items

        let matchingItem;

        this.cartItem.forEach((item) => {
            if (productId === item.Id) {
                matchingItem = item;
            }
        });

        if (matchingItem) {
            matchingItem.quantity += quantityValue;
        }
        else {
            // Else, make a new index for it
            this.cartItem.push({
                Id: productId,
                quantity: quantityValue,
                deliveryOptionId: '1'
            });  
        }
        localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItem));
    };

    removeFromCart(productId) {
        this.cartItem.forEach((cartItem, index) => {
            if (productId === cartItem.Id) this.cartItem.splice(index, 1);
            localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItem));
        })
    };

    calculateTotal() {
        // Calculate total Quantity
        let total = 0;
        this.cartItem.forEach((cartItem) => {
            total += cartItem.quantity;
        })
        return total;
    };

    updateDeliveryOption(productId, deliveryOptionId) {
        let matchingItem;

        this.cartItem.forEach((item) => {
            if (productId === item.Id) {
                matchingItem = item;
            }
        })

        matchingItem.deliveryOptionId = deliveryOptionId;
        localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItem));
    };
}

const cart = new Cart('cart-oop');
const businessCart = new Cart('cart-business');

// console.log(cart.localStorageKey);
console.log(cart);
console.log(businessCart);