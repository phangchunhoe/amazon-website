export const cart = [];

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