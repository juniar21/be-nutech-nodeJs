import { Request, Response } from "express";
import pool from "../config/db"; 

export class InformationController {
  async getBanners(req: Request, res: Response) {
    try {
      const query = `SELECT banner_name, banner_image, description FROM banners`;
      const result = await pool.query(query); 

      return res.status(200).json({
        status: 0,
        message: "Sukses",
        data: result.rows,
      });
    } catch (error: any) {
      return res.status(500).json({
        status: 1,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async getServices(req: Request, res: Response) {
    try {
      const query = `
        SELECT service_code, service_name, service_icon, service_tariff
        FROM services
      `;

      const result = await pool.query(query); 

      return res.status(200).json({
        status: 0,
        message: "Sukses",
        data: result.rows,
      });
    } catch (error: any) {
      return res.status(500).json({
        status: 1,
        message: "Internal server error",
        error: error.message,
      });
    }
  }


}