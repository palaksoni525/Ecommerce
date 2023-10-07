const express= require("express");
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require("../controllers/orderController");
const{isAuthenticatedUser,authorizedroles}= require("../middleware/auth");
const router= express.Router();

router.route("/order/new").post(isAuthenticatedUser,newOrder);
router.route("/order/:id").get(isAuthenticatedUser,authorizedroles("admin"),getSingleOrder);
router.route("/orders/me").get(isAuthenticatedUser,myOrders);

router.route("/admin/orders").get(isAuthenticatedUser,authorizedroles("admin"),getAllOrders);
router.route("/admin/order/:id").put(isAuthenticatedUser,authorizedroles("admin"),updateOrder);
router.route("/admin/order/:id").delete(isAuthenticatedUser,authorizedroles("admin"),deleteOrder);


module.exports= router;