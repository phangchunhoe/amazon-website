import {renderOrderSummary} from './checkout/orderSummary.js';
import {renderPaymentSummary} from './checkout/paymentSummary.js';
import {loadProducts} from '../data/products.js';
import {loadCart} from '../data/carts.js'

Promise.all([
    new Promise((resolve) => {
        loadProducts(() => {
            resolve('value1');
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

// new Promise((resolve) => {
//     loadProducts(() => {
//         resolve('value1');
//     });
// }).then((value) => {
//     return new Promise((resolve) => {
//         loadCart(() => {
//             resolve();
//         })
//     })
// }).then(() => {
//     renderOrderSummary(); 
//     renderPaymentSummary();
// });

// loadProducts(() => {
//     loadCart(() => {
//         renderOrderSummary(); 
//         renderPaymentSummary();
//     });
// });