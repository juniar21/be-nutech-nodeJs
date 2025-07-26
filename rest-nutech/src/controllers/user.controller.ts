import { Request, Response } from "express";
import pool from "../config/db";

export class UserController {
  async GetProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const query = `
      SELECT email, first_name, last_name, profile_image
      FROM users
      WHERE id = $1
    `;

      const result = await pool.query(query, [userId]);

      return res.status(200).json({
        status: 0,
        message: "Sukses",
        data: result.rows[0],
      });
    } catch (error: any) {
      return res.status(500).json({
        status: 102,
        message: "Token tidak valid atau kadaluwarsa",
        error: error.message,
      });
    }
  }

  async UpdateProfile(req: Request, res: Response) {
    const userId = req.user?.id;
    const { first_name, last_name } = req.body;

    if (!first_name || !last_name) {
      return res
        .status(400)
        .json({ status: 1, message: "Nama depan dan belakang wajib diisi" });
    }

    try {
      const updateQuery = `
        UPDATE users
        SET first_name = $1,
            last_name = $2
        WHERE id = $3
        RETURNING email, first_name, last_name, profile_image
      `;

      const result = await pool.query(updateQuery, [
        first_name,
        last_name,
        userId,
      ]);

      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ status: 1, message: "User tidak ditemukan" });
      }

      return res.status(200).json({
        status: 0,
        message: "Update Profile berhasil",
        data: result.rows[0],
      });
    } catch (error: any) {
      return res.status(500).json({
        status: 108,
        message: "Token tidak valid atau kadaluwarsa",
        error: error.message,
      });
    }
  }

  async UpdateImg (req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          status: 102,
          message: "Format Image tidak sesuai",
          data: null,
        });
      }

      // Validasi ekstensi file
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          status: 102,
          message: "Format Image tidak sesuai",
          data: null,
        });
      }

      const imageUrl = `${req.protocol}://${req.get("host")}/public/profile/${
        file.filename
      }`;

      // Update image
      const result = await pool.query(
        `UPDATE users SET profile_image = $1 WHERE id = $2 RETURNING email, first_name, last_name`,
        [imageUrl, userId]
      );

      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ status: 1, message: "User tidak ditemukan", data: null });
      }

      const user = result.rows[0];

      return res.status(200).json({
        status: 0,
        message: "Update Profile Image berhasil",
        data: {
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          profile_image: imageUrl,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        status: 1,
        message: "Internal server error",
        data: null,
        error: error.message,
      });
    }
  };
}
