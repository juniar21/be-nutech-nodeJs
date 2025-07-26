"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
class AuthRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.authCrontoller = new auth_controller_1.authController();
        this.initializeRoute();
    }
    initializeRoute() {
        this.router.post("/registration", this.authCrontoller.register);
        this.router.post("/login", this.authCrontoller.login);
    }
    getRouter() {
        return this.router;
    }
}
exports.AuthRouter = AuthRouter;
