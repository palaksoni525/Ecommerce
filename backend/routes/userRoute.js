const express= require("express");
const { RegisterUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getSingleUser, updateUserRole, deleteUser } = require("../controllers/userController");
const router= express.Router();

const {isAuthenticatedUser,authorizedroles} = require("../middleware/auth");
router.route("/register").post(RegisterUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticatedUser,getUserDetails);
router.route("/password/update").put(isAuthenticatedUser,updatePassword);

router.route("/me/update").put(isAuthenticatedUser,updateProfile);
router.route("/admin/users").get(getAllUsers);
router.route("/admin/user/:id")
.get(isAuthenticatedUser,authorizedroles("admin"),getSingleUser)
.put(isAuthenticatedUser,authorizedroles("admin"),updateUserRole)
.delete(isAuthenticatedUser,authorizedroles("admin"),deleteUser);
module.exports= router;