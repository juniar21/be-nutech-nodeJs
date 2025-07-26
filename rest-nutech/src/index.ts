import express, { Application, Request, request, Response } from "express";
import path from "path";
import pool from "./config/db";
import cors from "cors";
import { AuthRouter } from "./routers/auth.routes";
import { UserRouter } from "./routers/user.routes";
import { InformationRoute } from "./routers/information.controller";
import { TransactionRouter } from "./routers/transaction.routes";

const PORT: number = 8000;

const app: Application = express();
app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.status(200).send({ message: "Welcome to My APi" });
});

const authRouter = new AuthRouter();
app.use("/", authRouter.getRouter());

const userRouter = new UserRouter;
app.use("", userRouter.getRouter());

const infoController = new InformationRoute;
app.use("/", infoController.getRouter());

const transController = new TransactionRouter;
app.use("/", transController.getRouter());

pool.connect((err, client, release) => {
    if (err) {
        return console.log("Error acquiring client", err.stack); 
    }
    console.log("Success Connection");
    release();
    
})

app.listen(PORT, () => {
  console.log(`server running on:: http://localhost:${PORT}`);
});
