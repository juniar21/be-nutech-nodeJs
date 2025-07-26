import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { uploader } from "../helpers/uploader";

export class UserRouter {
  private router: Router;
  private userCrontoller: UserController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.userCrontoller = new UserController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoute();
  }

  private initializeRoute() {
    this.router.get(
      "/profile",
      this.authMiddleware.verifyToken,
      this.userCrontoller.GetProfile
    );
    this.router.put(
      "/profile/update",
      this.authMiddleware.verifyToken,
      this.userCrontoller.UpdateProfile
    );
    this.router.put(
      "/profile/image",
      this.authMiddleware.verifyToken,
      uploader("diskStorage", "NU-").single("image"),
      this.userCrontoller.UpdateImg,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
