const {Router} = require('express');
const router = Router();

const getOrder = require('../../controllers/order/getOrder')
const postOrder = require('../../controllers/order/postOrder.js');
const postOrderTomi= require('../../controllers/order/postOrderTomi');

 router.get('/', getOrder);
router.post('/createOrder', postOrder);
router.post('/createOrderTomi', postOrderTomi);

module.exports = router