import { Request, Response } from 'express';
import pool from '../config/db';
import {sign} from 'jsonwebtoken';

export class authController {
    async register(req: Request, res: Response) {
        try {
          const { email, password, first_name, last_name } = req.body;
      
          if (!email || !/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ status: 1, message: 'Email tidak valid' });
          }
      
          if (!password || password.length < 8) {
            return res.status(400).json({ status: 1, message: 'Password minimal 8 karakter' });
          }
      
          if (!first_name || !last_name) {
            return res.status(400).json({ status: 1, message: 'Nama depan dan belakang wajib diisi' });
          }
      
          const query = `
            INSERT INTO users (email, password, first_name, last_name)
            VALUES ($1, $2, $3, $4)
            RETURNING id, email, first_name, last_name
          `;
      
          const result = await pool.query(query, [email, password, first_name, last_name]);
      
          return res.status(201).json({
            status: 0,
            message: 'Registrasi berhasil silahkan login',
            data: result.rows[0],
          });
        } catch (error: any) {
          if (error.code === '23505') {
            return res.status(409).json({ status: 102, message: 'Paramter email tidak sesuai format' });
          }
          return res.status(500).json({ status: 102, message: 'Internal server error', error: error.message });
        }
      }
      

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
      const user = result.rows[0];

      if (!user) {
        return res.status(401).json({ status: 1, message: 'Email tidak ditemukan' });
      }

      if (user.password !== password) {
        return res.status(401).json({ status: 1, message: 'Password salah' });
      }

      const payload = { id: user.id, role: "user" };
      const token = sign(payload, process.env.KEY_JWT!, {
        expiresIn: "1h"
      });

      return res.json({
        status: 0,
        message: 'Login sukses',
        data: { token }
      });
    } catch (error: any) {
      return res.status(500).json({ status: 102, message: 'Paramter email tidak sesuai format', error: error.message });
    }
  }
}
    