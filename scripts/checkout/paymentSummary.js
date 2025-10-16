import {cart, calculateTotal} from '../../data/carts.js';
import {getProduct} from '../../data/products.js';
import {getDeliveryOption} from '../../data/deliveryOptions.js';
import formatCurrency from '../utils/money.js'



export function renderPaymentSummary() {
    let productPriceCents = 0;
    let shippingPriceCents = 0;
    cart.forEach((cartItem) => {
        const product = getProduct(cartItem.Id);
        if (!product) {
            console.warn('Product not found in your cart item:', cartItem)
            return
        }
        productPriceCents += product.priceCents * cartItem.quantity;

        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId)
        shippingPriceCents += deliveryOption.priceCents


    });

    const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
    const taxCents = totalBeforeTaxCents * 0.1;
    const totalCents = totalBeforeTaxCents + taxCents;

    const paymentSummaryHTML = `
        <div class="payment-summary-title">
            Order Summary
        </div>

        <div class="payment-summary-row">
            <div class="js-order-summary-items"></div>
            <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
        </div>

        <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(shippingPriceCents)}</div>
        </div>

        <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
        </div>

        <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
        </div>

        <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
        </div>

        <button class="place-order-button button-primary">
            Place your order
        </button>

    `;

    document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;
    displayTotalItems(cart);

}



function displayTotalItems(cart) {
    // Allowed the checkout to update
    let totalItems = calculateTotal(cart);
    if (totalItems > 1) {
        document.querySelector('.js-order-summary-items').innerText = `Items (${totalItems}):`;
    } 
    else if (totalItems <= 1 && totalItems >= 0) {
        document.querySelector('.js-order-summary-items').innerText = `Item (${totalItems}):`;
    }
}