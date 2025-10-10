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
              src="images/ratings/rating-${product.rating.stars * 10}.png">
            <div class="product-rating-count link-primary">
              ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            $${(product.priceCents / 100).toFixed(2)}
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

document.querySelectorAll('.js-add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
        const productId = button.dataset.productId;
        const quantityValue = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);
        const addedToCart = button.closest('.product-container')?.querySelector('.added-to-cart');

        let matchingItem;
        let totalItem = 0;

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
        console.log(cart)

        // Find the total number of items in cart
        cart.forEach((item) => {
            totalItem += item.quantity;
        })

        if (totalItem) {
            document.querySelector('.cart-quantity').innerText = totalItem;
        } else {
            document.querySelector('.cart-quantity').innerText = '';
        };

        // Reset numbers back to their original form
        document.querySelector(`.js-quantity-selector-${productId}`).value = 1;

        // Display 'Added' check
        addedToCart.classList.add('is-added-to-cart');

        setTimeout(() => {
            addedToCart.classList.remove('is-added-to-cart');
        }, 1500);
    })
})