// Import Data from other parts
import {cart, removeFromCart, calculateTotal, updateDeliveryOption} from '../data/carts.js';
import {products} from '../data/products.js';
import formatCurrency from './utils/money.js'
import {deliveryOptions} from '../data/deliveryOptions.js'
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

// Stopped at 14.35 mins

let cartSummaryHTML = '';

cartSummaryHTML = '';
displayTotalItems(cart);

const today = dayjs();
const deliveryDate = today.add(7, 'days');
console.log(deliveryDate.format('dddd, D MMMM YYYY'));

cart.forEach((cartItem) => {
    const productId = cartItem.Id;

    let matchingProduct;

    products.forEach((product) => {
        if (productId === product.id) {
            matchingProduct = product;
        }
    });

    // This is used for the displayExpectedDeliveryDate(deliveryOptionId, deliveryOptions) function
    const deliveryOptionId = cartItem.deliveryOptionId;
    

    cartSummaryHTML += `<div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
            Delivery date: ${displayExpectedDeliveryDate(deliveryOptionId, deliveryOptions)}
        </div>

        <div class="cart-item-details-grid">
            <img class="product-image"
            src="${matchingProduct.image}">

            <div class="cart-item-details">
                <div class="product-name">
                    ${matchingProduct.name}
                </div>
                <div class="product-price">
                    $${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                    <span>
                    Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                    </span>
                    <span class="update-quantity-link link-primary">
                    Update
                    </span>
                    <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                    Delete
                    </span>
                </div>
            </div>

            <div class="delivery-options">
                <div class="delivery-options-title">
                    Choose a delivery option:
                </div>
                ${deliveryOptionsHTML(matchingProduct, cartItem)}
            </div>
        </div>
    </div>`;
});

// Renders the carts HTML of the entire page 
document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

// Added event listeners to delete the items 
document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId);
        const removingContainer = document.querySelector(`.js-cart-item-container-${productId}`);
        removingContainer.remove();
        displayTotalItems(cart);
    });

});

// Functions

function displayTotalItems(cart) {
    // Allowed the checkout to update
    let totalItems = calculateTotal(cart);
    if (totalItems > 1) {
        document.querySelector('.js-total-checkout-items').innerText = `${calculateTotal(cart)} items`;
        document.querySelector('.js-order-summary-items').innerText = `Items (${totalItems}):`;
    } 
    else if (totalItems <= 1 && totalItems >= 0) {
        document.querySelector('.js-total-checkout-items').innerText = `${calculateTotal(cart)} item`;
        document.querySelector('.js-order-summary-items').innerText = `Item (${totalItems}):`;
    }
}

function deliveryOptionsHTML(matchingProduct, cartItem) {
    const todayDate = dayjs();
    let html = '';

    deliveryOptions.forEach((deliveryOption) => {
        const deliveryDate = todayDate.add(deliveryOption.deliveryDays, 'days');
        const dateString = deliveryDate.format('dddd, D MMMM YYYY');
        const priceString = !deliveryOption.priceCents ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} - `;

        const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

        html += `
        <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
            <input type="radio"
            ${isChecked ? 'checked' : ''}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
            <div>
            <div class="delivery-option-date">
                ${dateString}
            </div>
            <div class="delivery-option-price">
                ${priceString} Shipping
            </div>
            </div>
        </div>

        `
    })

    return html;
}

function displayExpectedDeliveryDate(deliveryOptionId, deliveryOptions) {

    let deliveryOption;

    deliveryOptions.forEach((option) => {
        if (option.id === deliveryOptionId) {
            deliveryOption = option;
        }
    });

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    return deliveryDate.format(('dddd, D MMMM YYYY'));
}

document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
        const {productId, deliveryOptionId} = element.dataset;
        updateDeliveryOption(productId, deliveryOptionId);
    })
})

