"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const db_1 = __importDefault(require("../config/db"));
const jsonwebtoken_1 = require("jsonwebtoken");
class authController {
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const result = yield db_1.default.query(query, [email, password, first_name, last_name]);
                return res.status(201).json({
                    status: 0,
                    message: 'Registrasi berhasil silahkan login',
                    data: result.rows[0],
                });
            }
            catch (error) {
                if (error.code === '23505') {
                    return res.status(409).json({ status: 102, message: 'Paramter email tidak sesuai format' });
                }
                return res.status(500).json({ status: 102, message: 'Internal server error', error: error.message });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const result = yield db_1.default.query(`SELECT * FROM users WHERE email = $1`, [email]);
                const user = result.rows[0];
                if (!user) {
                    return res.status(401).json({ status: 1, message: 'Email tidak ditemukan' });
                }
                if (user.password !== password) {
                    return res.status(401).json({ status: 1, message: 'Password salah' });
                }
                const payload = { id: user.id, role: "user" };
                const token = (0, jsonwebtoken_1.sign)(payload, process.env.KEY_JWT, {
                    expiresIn: "1h"
                });
                return res.json({
                    status: 0,
                    message: 'Login sukses',
                    data: { token }
                });
            }
            catch (error) {
                return res.status(500).json({ status: 102, message: 'Paramter email tidak sesuai format', error: error.message });
            }
        });
    }
}
exports.authController = authController;
