"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const uploader_1 = require("../helpers/uploader");
class UserRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.userCrontoller = new user_controller_1.UserController();
        this.authMiddleware = new auth_middleware_1.AuthMiddleware();
        this.initializeRoute();
    }
    initializeRoute() {
        this.router.get("/profile", this.authMiddleware.verifyToken, this.userCrontoller.GetProfile);
        this.router.put("/profile/update", this.authMiddleware.verifyToken, this.userCrontoller.UpdateProfile);
        this.router.put("/profile/image", this.authMiddleware.verifyToken, (0, uploader_1.uploader)("diskStorage", "NU-").single("image"), this.userCrontoller.UpdateImg);
    }
    getRouter() {
        return this.router;
    }
}
exports.UserRouter = UserRouter;
