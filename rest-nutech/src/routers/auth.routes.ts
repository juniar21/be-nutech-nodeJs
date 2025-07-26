import { Router } from "express";
import { authController } from "../controllers/auth.controller";


export class AuthRouter {
    private router: Router;
    private authCrontoller: authController;
    
  
    constructor() {
      this.router = Router();
      this.authCrontoller = new authController();
      this.initializeRoute();
    }
  
    private initializeRoute() {
      this.router.post("/registration", this.authCrontoller.register);
      this.router.post("/login",this.authCrontoller.login)
    }
  
    getRouter(): Router {
      return this.router;
    }
  }