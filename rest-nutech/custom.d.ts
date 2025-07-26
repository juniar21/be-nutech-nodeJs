import "express";

export type UserPayload = {
    id:number,
    role: "admin"|"user";
};

export interface MulterRequest extends Request {
    file?: Express.Multer.File;
  }

declare global {
    namespace Express {
        export interface Request {
            user?: UserPayload;
        }
    }
}