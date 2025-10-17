import {cart, calculateTotal} from '../../data/carts.js';
import {getProduct} from '../../data/products.js';
import {getDeliveryOption} from '../../data/deliveryOptions.js';
import formatCurrency from '../utils/money.js';
import {addOrder} from '../../data/orders.js'



export function renderPaymentSummary() {
    let productPriceCents = 0;
    let shippingPriceCents = 0;
    cart.forEach((cartItem) => {
        const product = getProduct(cartItem.Id);
        if (!product) {
            // console.warn('Product not found in your cart item:', cartItem)
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

        <button class="place-order-button button-primary js-place-order">
            Place your order
        </button>

    `;

    document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;
    displayTotalItems(cart);

    // attach place-order handler (map Id -> productId and handle errors safely)
    const placeOrderButton = document.querySelector('.js-place-order');
    if (placeOrderButton) {
        placeOrderButton.addEventListener('click', async (event) => {
                event.preventDefault?.();
                placeOrderButton.disabled = true;

                // transform cart to API expected shape: productId (not Id)
                const payloadCart = cart.map(ci => ({
                productId: String(ci.Id),
                quantity: Number(ci.quantity) || 0,
                deliveryOptionId: ci.deliveryOptionId
            }));

            try {
                const response = await fetch('https://supersimplebackend.dev/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    // SEND the mapped payloadCart, not the original cart
                    body: JSON.stringify({ cart: payloadCart })
                });

                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(`Server error ${response.status}: ${text}`);
                }

                const orders = await response.json();
                addOrder(orders)

                // optional: clear cart and/or show success UI here
                // localStorage.removeItem('cart');
                // window.location.href = '/orders.html';
            } catch (err) {
                console.error('Place order failed', err);
                // re-enable button so user can retry
                placeOrderButton.disabled = false;
            };

            window.location.href = 'orders.html'
        });
    }

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