const express= require("express");
const { getAllProducts,createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, DeleteReview, deleteReview } = require("../controllers/productController");

const {isAuthenticatedUser,authorizedroles} = require("../middleware/auth");

const router= express.Router();
 router.route("/products").get(getAllProducts);
 router.route("/admin/product/new").post(isAuthenticatedUser,authorizedroles("admin"),createProduct);
 router.route("/admin/product/:id")
 .put(isAuthenticatedUser,authorizedroles("admin"),updateProduct)
 .delete(isAuthenticatedUser,authorizedroles("admin"),deleteProduct);

 router.route("/product/:id").get(getProductDetails);
 router.route("/review").put(isAuthenticatedUser,createProductReview);

 router.route("/reviews")
 .get(getProductReviews)
 .delete(isAuthenticatedUser,deleteReview);
module.exports= router;