import { Router } from "express";
import { register, login, refresh, logout, me } from "../controllers/auth.controller.js";
import { authRateLimiter } from "../middlewares/rate-limit.middleware.js";
import { authenticate, requireRole } from "../middlewares/auth.middleware.js";

// router
const router = Router();

// routes
router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', authenticate, me);

export default router;
