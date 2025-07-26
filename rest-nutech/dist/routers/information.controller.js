"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InformationRoute = void 0;
const express_1 = require("express");
const information_controller_1 = require("../controllers/information.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
class InformationRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.informationController = new information_controller_1.InformationController();
        this.authMiddleware = new auth_middleware_1.AuthMiddleware();
        this.initializeRoute();
    }
    initializeRoute() {
        this.router.get("/banner", this.informationController.getBanners);
        this.router.get("/service", this.authMiddleware.verifyToken, this.informationController.getServices);
    }
    getRouter() {
        return this.router;
    }
}
exports.InformationRoute = InformationRoute;
