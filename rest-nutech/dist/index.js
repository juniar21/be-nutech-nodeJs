"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = require("./routers/auth.routes");
const user_routes_1 = require("./routers/user.routes");
const information_controller_1 = require("./routers/information.controller");
const transaction_routes_1 = require("./routers/transaction.routes");
const PORT = 8000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.status(200).send({ message: "Welcome to My APi" });
});
const authRouter = new auth_routes_1.AuthRouter();
app.use("/", authRouter.getRouter());
const userRouter = new user_routes_1.UserRouter;
app.use("", userRouter.getRouter());
const infoController = new information_controller_1.InformationRoute;
app.use("/", infoController.getRouter());
const transController = new transaction_routes_1.TransactionRouter;
app.use("/", transController.getRouter());
db_1.default.connect((err, client, release) => {
    if (err) {
        return console.log("Error acquiring client", err.stack);
    }
    console.log("Success Connection");
    release();
});
app.listen(PORT, () => {
    console.log(`server running on:: http://localhost:${PORT}`);
});
