// routes/auth.js
import express from "express";
import { protect } from "../middleware/verifyToken.js";
import { loginUser, forgotPassword, resetPassword, confirmEmailChange, getDashboard, updateProfile, 
    changePassword, changeEmail,
    refreshToken,
    logout,
    logoutAll
 } from "../controllers/adminController.js";

 import * as productCtrl from '../controllers/productController.js';
import * as serviceCtrl from '../controllers/serviceController.js';
import * as galleryCtrl from '../controllers/galleryController.js';

const router = express.Router();

router.post("/login", loginUser);

router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get("/verify-email-change/:token", confirmEmailChange); // token-based, no auth

// Protected routes (require JWT)
router.use(protect);

router.get("/dashboard", getDashboard);
router.put("/profile", updateProfile);              // Update own profile
router.post("/change-password", changePassword);
router.post("/change-email", changeEmail);

// routes/auth.js (example)
router.post('/login', loginUser);
router.post('/refresh-token', refreshToken);
router.post('/logout',  logout);
router.post('/logout-all',  logoutAll);



// Products
router.post('/products',  productCtrl.createProduct);
router.get('/products',  productCtrl.getAllProducts);
router.get('/products/:id',  productCtrl.getProductById);
router.put('/products/:id',  productCtrl.updateProduct);
router.delete('/products/:id',  productCtrl.deleteProduct);

// Services
router.post('/services',  serviceCtrl.createService);
router.get('/services',  serviceCtrl.getAllServices);
router.get('/services/:id',  serviceCtrl.getServiceById);
router.put('/services/:id',  serviceCtrl.updateService);
router.delete('/services/:id',  serviceCtrl.deleteService);

// Gallery
router.post('/gallery',  galleryCtrl.createGalleryItem);
router.get('/gallery',  galleryCtrl.getAllGalleryItems);
router.get('/gallery/:id',  galleryCtrl.getGalleryItemById);
router.put('/gallery/:id',  galleryCtrl.updateGalleryItem);
router.delete('/gallery/:id',  galleryCtrl.deleteGalleryItem);

export default router;



