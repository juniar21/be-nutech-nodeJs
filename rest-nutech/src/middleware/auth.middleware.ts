import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { UserPayload } from "../../custom";


export class AuthMiddleware {
    verifyToken(req:Request, res:Response, next:NextFunction){
        try {
          const token = req.header("Authorization")?.replace("Bearer ", "");
          if (!token) throw {status: 108,
            message: "Token tidak valid atau kadaluwarsa"};
          
          const verifiedUser = verify(token, process.env.KEY_JWT!);

          req.user =verifiedUser as UserPayload;
          next()
        } catch (err) {
            console.log(err);
            res.status(400).send(err);
        }
    }
}