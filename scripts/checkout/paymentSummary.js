import {cart} from '../../data/carts.js';
import {getProduct} from '../../data/products.js';


export function renderPaymentSummary() {
    let productPriceCents = 0;
    cart.forEach((cartItem) => {
        const product = getProduct(cartItem.Id);

        if (!product) {
            console.warn('product not found for cart item', cartItem);
            return;
        }
        productPriceCents += product.priceCents * cartItem.quantity;
    });

    console.log(productPriceCents);
}