// Import Data from other parts
import {cart, removeFromCart, calculateTotal, updateDeliveryOption, saveNewQuantity} from '../../data/carts.js';
import {products, getProduct} from '../../data/products.js';
import formatCurrency from '../utils/money.js'
import {deliveryOptions, getDeliveryOption} from '../../data/deliveryOptions.js'
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import {renderPaymentSummary} from './paymentSummary.js';


renderOrderSummary();

export function renderOrderSummary() {
    let cartSummaryHTML = '';
    displayTotalItems(cart);



    cart.forEach((cartItem) => {
        const productId = cartItem.Id;

        const matchingProduct = getProduct(productId);

        if (!matchingProduct) {
            console.warn('Product not found for cart item:', cartItem);
            return
        }

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
                        ${matchingProduct.getPrice()}
                    </div>
                    <div class="product-quantity js-product-quantity">
                        <span class="js-quantity-value">
                        Quantity: <span class="quantity-label js-quantity-label">${cartItem.quantity}</span>
                        </span>
                        <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
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
            renderPaymentSummary();
        });

    });

    document.querySelectorAll('.js-delivery-option').forEach((element) => {
        element.addEventListener('click', () => {
            const {productId, deliveryOptionId} = element.dataset;
            updateDeliveryOption(productId, deliveryOptionId);
            renderOrderSummary();
            renderPaymentSummary();
        })
    });

    document.querySelectorAll('.js-update-link').forEach((update) => {
        update.addEventListener('click', () => {
            const productId = update.dataset.productId;
            const quantityLabel = update.closest('.js-product-quantity')?.querySelector('.js-quantity-label');
        
            // read current quantity (fallback to 1)
            const currentQuantity = quantityLabel ? Number(quantityLabel.innerText.trim()) || 1 : 1;
        
            // create a real input element
            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.min = '1';
            quantityInput.value = currentQuantity;
            quantityInput.className = 'js-quantity-input quantity-input';
        
            // put input into DOM and focus
            if (quantityLabel) {
            quantityLabel.innerHTML = '';
            quantityLabel.appendChild(quantityInput);
            quantityInput.focus();
            }
        
            // stop clicks on input from bubbling to the update button
            quantityInput.addEventListener('click', (ev) => ev.stopPropagation());
        
            // helper to commit changes
            const commit = (value) => {
            const newQty = Math.max(1, Number(value) || 1);
            saveNewQuantity(productId, newQty);
            // re-render UI and payment summary to reflect changes
            renderOrderSummary();
            renderPaymentSummary();
            };
        
            // commit on Enter, cancel on Escape
            quantityInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                commit(quantityInput.value);
            } else if (event.key === 'Escape') {
                renderOrderSummary(); // cancel edit
            }
            });
        
            // Blur: defer commit to avoid re-entrancy issues (fixes NotFoundError)
            quantityInput.addEventListener('blur', () => {
                // schedule after current event stack so browser finishes processing blur
                setTimeout(() => commit(quantityInput.value), 0);
            }, { once: true });
        });
        });
}



// Functions

function displayTotalItems(cart) {
    // Allowed the checkout to update
    let totalItems = calculateTotal(cart);
    if (totalItems > 1) {
        document.querySelector('.js-total-checkout-items').innerText = `${calculateTotal(cart)} items`;
    } 
    else if (totalItems <= 1 && totalItems >= 0) {
        document.querySelector('.js-total-checkout-items').innerText = `${calculateTotal(cart)} item`;
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

function displayExpectedDeliveryDate(deliveryOptionId) {

    let deliveryOption = getDeliveryOption(deliveryOptionId)

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    return deliveryDate.format(('dddd, D MMMM YYYY'));
}



