import { Router } from "express";
import { TransactionController } from "../controllers/transaction.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";

export class TransactionRouter {
    private router: Router;
    private transController : TransactionController;
    private authMiddleware: AuthMiddleware;
  
    constructor() {
      this.router = Router();
      this.transController = new TransactionController();
      this.authMiddleware = new AuthMiddleware();
      this.initializeRoute();
    }
  
    private initializeRoute() {
      this.router.get("/balance",this.authMiddleware.verifyToken,this.transController.getBalance);
      this.router.post("/topup",this.authMiddleware.verifyToken,this.transController.TopUp);
      this.router.post("/transaction",this.authMiddleware.verifyToken,this.transController.makeTransaction);
      this.router.get("/transaction/history",this.authMiddleware.verifyToken,this.transController.getTransactionHistory);
    }
  
    getRouter(): Router {
      return this.router;
    }
  }