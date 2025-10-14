export let cart = JSON.parse(localStorage.getItem('cart')) || [{
    Id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    quantity: 1,
    deliveryOptionId: '1'
}, {
    Id: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    quantity: 2,
    deliveryOptionId: '2'
}];

export function addToCart(productId, quantityValue) {
    // Check whether there is matching items

    let matchingItem;

    cart.forEach((item) => {
        if (productId === item.Id) {
            matchingItem = item;
        }
    });

    if (matchingItem) {
        matchingItem.quantity += quantityValue;
    }
    else {
        // Else, make a new index for it
        cart.push({
            Id: productId,
            quantity: quantityValue,
            deliveryOptionId: '1'
        });  
    }
    localStorage.setItem('cart', JSON.stringify(cart));
};

export function removeFromCart(productId) {
    cart.forEach((cartItem, index) => {
        if (productId === cartItem.Id) cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
    })
}

export function calculateTotal(cart) {
    // Calculate total Quantity
    let total = 0;
    cart.forEach((cartItem) => {
        total += cartItem.quantity;
    })
    return total;
}

export function updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem;

    cart.forEach((item) => {
        if (productId === item.Id) {
            matchingItem = item;
        }
    })

    matchingItem.deliveryOptionId = deliveryOptionId;
    localStorage.setItem('cart', JSON.stringify(cart));


}