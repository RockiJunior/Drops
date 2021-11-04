const express = require('express');
const app = express.Router();

const reviewsRoutes = require('./reviews/reviewRoutes');
const users = require('../routes/User/User');
const products = require('./products/products.js');
const categories = require('./categories/categories.js');
const brands = require('./brands/brands.js');
const sizes = require('./sizes/sizes.js');
const productSizes = require('./productSize/productSize.js');
const newsletter = require('./newsletter/newsletter');
const orders = require('./order/order');

app.use('/',users);
app.use('/reviews', reviewsRoutes);
app.use('/products', products);
app.use('/categories', categories);
app.use('/brands', brands);
app.use('/productSizes', productSizes);
app.use('/sizes', sizes);
app.use('/newsletter', newsletter);
app.use('/orders', orders)

module.exports = app; 