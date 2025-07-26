import { Router } from "express";
import { InformationController } from "../controllers/information.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";

export class InformationRoute {
    private router: Router;
    private informationController: InformationController ;
    private authMiddleware: AuthMiddleware;
  
    constructor() {
      this.router = Router();
      this.informationController = new InformationController();
      this.authMiddleware = new AuthMiddleware();
      this.initializeRoute();
    }
  
    private initializeRoute() {
      this.router.get("/banner", this.informationController.getBanners);
      this.router.get("/service",this.authMiddleware.verifyToken,this.informationController.getServices)
    }
  
    getRouter(): Router {
      return this.router;
    }
  }