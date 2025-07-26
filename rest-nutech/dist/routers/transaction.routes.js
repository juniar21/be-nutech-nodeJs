"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRouter = void 0;
const express_1 = require("express");
const transaction_controller_1 = require("../controllers/transaction.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
class TransactionRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.transController = new transaction_controller_1.TransactionController();
        this.authMiddleware = new auth_middleware_1.AuthMiddleware();
        this.initializeRoute();
    }
    initializeRoute() {
        this.router.get("/balance", this.authMiddleware.verifyToken, this.transController.getBalance);
        this.router.post("/topup", this.authMiddleware.verifyToken, this.transController.TopUp);
        this.router.post("/transaction", this.authMiddleware.verifyToken, this.transController.makeTransaction);
        this.router.get("/transaction/history", this.authMiddleware.verifyToken, this.transController.getTransactionHistory);
    }
    getRouter() {
        return this.router;
    }
}
exports.TransactionRouter = TransactionRouter;
