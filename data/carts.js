export const cart = [{
    Id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    quantity: 2
}, {
    Id: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    quantity: 1
}];

export function addToCart(matchingItem, productId, quantityValue) {
    // Check whether there is matching items
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
            quantity: quantityValue
        });  
    }
};

export function removeFromCart(productId) {
    cart.forEach((cartItem, index) => {
        if (productId === cartItem.Id) cart.splice(index, 1);
    })
}