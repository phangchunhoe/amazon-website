import {renderOrderSummary} from './checkout/orderSummary.js';
import {renderPaymentSummary} from './checkout/paymentSummary.js';
import {loadProducts, loadProductsFetch} from '../data/products.js';
import {loadCart} from '../data/carts.js'

Promise.all([
    loadProductsFetch(),
    new Promise((resolve) => {
        loadCart(() => {
            resolve();
        });
    })
]).then(() => {
    renderOrderSummary(); 
    renderPaymentSummary();
})


/*

// Using Promise all

Promise.all([
    new Promise((resolve) => {
        loadProducts(() => {
            resolve();
        });
    }),
    new Promise((resolve) => {
        loadCart(() => {
            resolve();
        });
    })
]).then(() => {
    renderOrderSummary(); 
    renderPaymentSummary();
})

// Using individual Promises

new Promise((resolve) => {
    loadProducts(() => {
        resolve('value1');
    });
}).then((value) => {
    return new Promise((resolve) => {
        loadCart(() => {
            resolve();
        })
    })
}).then(() => {
    renderOrderSummary(); 
    renderPaymentSummary();
});

// Using Callbacks 

loadProducts(() => {
    loadCart(() => {
        renderOrderSummary(); 
        renderPaymentSummary();
    });
}); 

*/