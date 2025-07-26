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
exports.UserController = void 0;
const db_1 = __importDefault(require("../config/db"));
class UserController {
    GetProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const query = `
      SELECT email, first_name, last_name, profile_image
      FROM users
      WHERE id = $1
    `;
                const result = yield db_1.default.query(query, [userId]);
                return res.status(200).json({
                    status: 0,
                    message: "Sukses",
                    data: result.rows[0],
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: 102,
                    message: "Token tidak valid atau kadaluwarsa",
                    error: error.message,
                });
            }
        });
    }
    UpdateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
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
                const result = yield db_1.default.query(updateQuery, [
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
            }
            catch (error) {
                return res.status(500).json({
                    status: 108,
                    message: "Token tidak valid atau kadaluwarsa",
                    error: error.message,
                });
            }
        });
    }
    UpdateImg(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
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
                const imageUrl = `${req.protocol}://${req.get("host")}/public/profile/${file.filename}`;
                // Update image
                const result = yield db_1.default.query(`UPDATE users SET profile_image = $1 WHERE id = $2 RETURNING email, first_name, last_name`, [imageUrl, userId]);
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
            }
            catch (error) {
                return res.status(500).json({
                    status: 1,
                    message: "Internal server error",
                    data: null,
                    error: error.message,
                });
            }
        });
    }
    ;
}
exports.UserController = UserController;
