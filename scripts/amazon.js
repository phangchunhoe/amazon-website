// Import Datas from JSON or JS files
import {cart, addToCart, calculateTotal} from '../data/carts.js';
import {products, loadProducts} from '../data/products.js';

loadProducts(renderProductGrid);

// Starting Codes
displayInitialCartQuantity();
renderProductGrid();

function renderProductGrid() {
	let productsHTML = '';

	products.forEach((product) => {
		productsHTML += `        
			<div class="product-container">
				<div class="product-image-container">
				<img class="product-image"
					src="${product.image}">
				</div>

				<div class="product-name limit-text-to-2-lines">
				${product.name}
				</div>

				<div class="product-rating-container">
				<img class="product-rating-stars"
					src="${product.getStarsUrl()}">
				<div class="product-rating-count link-primary">
					${product.rating.count}
				</div>
				</div>

				<div class="product-price">
				${product.getPrice()}
				</div>

				<div class="product-quantity-container">
				<select class="js-quantity-selector-${product.id}">
					<option selected value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
					<option value="4">4</option>
					<option value="5">5</option>
					<option value="6">6</option>
					<option value="7">7</option>
					<option value="8">8</option>
					<option value="9">9</option>
					<option value="10">10</option>
				</select>
				</div>

				${product.extraInfoHTML()}

				<div class="product-spacer"></div>

				<div class="added-to-cart">
				<img src="images/icons/checkmark.png">
				Added
				</div>

				<button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
				Add to Cart
				</button>
			</div>
			`;
	});

	document.querySelector('.products-grid').innerHTML = productsHTML;

	// else document.querySelector

	// Functions for the 'Add to Cart' button
	document.querySelectorAll('.js-add-to-cart').forEach((button) => {
		button.addEventListener('click', () => {
			const productId = button.dataset.productId;
			const quantityValue = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);
			const addedToCart = button.closest('.product-container')?.querySelector('.added-to-cart');

			let totalItem = 0;

			// Check whether there is matching items
			addToCart(productId, quantityValue);
			console.log(cart);

			// Find the total number of items in cart
			document.querySelector('.cart-quantity').innerText = calculateTotal(cart);

			// Reset values nacl to original
			document.querySelector(`.js-quantity-selector-${productId}`).value = 1;

			// Display 'Added' check
			displayAdded(addedToCart)
		})
	})
}




function displayAdded(addedToCart) {
    addedToCart.classList.add('is-added-to-cart');

    setTimeout(() => {
        addedToCart.classList.remove('is-added-to-cart');
    }, 1500);
}

function displayInitialCartQuantity() {
	// Display total cart items 
	let initialTotalCartItem = 0;
	cart.forEach((cartItems) => {
		initialTotalCartItem += cartItems.quantity;
	})

	document.querySelector('.cart-quantity').innerText = initialTotalCartItem;
}