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
exports.TransactionController = void 0;
const db_1 = __importDefault(require("../config/db"));
const uuid_1 = require("uuid");
class TransactionController {
    getBalance(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const result = yield db_1.default.query("SELECT balance FROM users WHERE id = $1", [userId]);
                return res.json({
                    status: 0,
                    message: "Get Balance Berhasil",
                    data: { balance: result.rows[0].balance },
                });
            }
            catch (error) {
                return res
                    .status(500)
                    .json({ status: 1, message: "Internal error", error: error.message });
            }
        });
    }
    TopUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const { top_up_amount } = req.body;
                if (!top_up_amount ||
                    typeof top_up_amount !== "number" ||
                    top_up_amount < 0) {
                    return res
                        .status(400)
                        .json({ status: 1, message: "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0" });
                }
                yield db_1.default.query("BEGIN");
                // 1. Update saldo
                const updateBalance = `
        UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING balance
      `;
                const result = yield db_1.default.query(updateBalance, [top_up_amount, userId]);
                // 2. Insert transaksi
                const invoice = `INV-${(0, uuid_1.v4)().split("-")[0].toUpperCase()}`;
                yield db_1.default.query(`INSERT INTO transactions (user_id, transaction_type, amount, invoice_number)
         VALUES ($1, 'TOPUP', $2, $3)`, [userId, top_up_amount, invoice]);
                yield db_1.default.query("COMMIT");
                return res.json({
                    status: 0,
                    message: "Top Up Balance berhasil",
                    data: {
                        balance: result.rows[0].balance,
                    },
                });
            }
            catch (error) {
                yield db_1.default.query("ROLLBACK");
                return res
                    .status(500)
                    .json({ status: 1, message: "Top up gagal", error: error.message });
            }
        });
    }
    makeTransaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const { service_code } = req.body;
                if (!service_code) {
                    return res
                        .status(400)
                        .json({ status: 1, message: "Service code wajib diisi" });
                }
                // Ambil tarif layanan
                const serviceResult = yield db_1.default.query("SELECT service_tariff FROM services WHERE service_code = $1", [service_code]);
                if (serviceResult.rows.length === 0) {
                    return res
                        .status(404)
                        .json({ status: 1, message: "Service ataus Layanan tidak ditemukan" });
                }
                // Ambil saldo user
                const balanceResult = yield db_1.default.query("SELECT balance FROM users WHERE id = $1", [userId]);
                const tariff = Number(serviceResult.rows[0].service_tariff);
                const currentBalance = Number(balanceResult.rows[0].balance);
                if (currentBalance < tariff) {
                    return res
                        .status(400)
                        .json({ status: 1, message: "Saldo tidak mencukupi" });
                }
                const invoice = `INV-${(0, uuid_1.v4)().split("-")[0].toUpperCase()}`;
                yield db_1.default.query("BEGIN");
                // 1. Kurangi saldo
                yield db_1.default.query("UPDATE users SET balance = balance - $1 WHERE id = $2", [tariff, userId]);
                // 2. Insert transaksi
                yield db_1.default.query(`INSERT INTO transactions (user_id, transaction_type, amount, service_code, invoice_number)
             VALUES ($1, 'PAYMENT', $2, $3, $4)`, [userId, tariff, service_code, invoice]);
                yield db_1.default.query("COMMIT");
                const trxDetail = yield db_1.default.query(`
        SELECT 
          t.invoice_number,
          t.service_code,
          s.service_name,
          t.transaction_type,
          t.amount AS total_amount,
          t.created_at AS created_on
        FROM transactions t
        JOIN services s ON t.service_code = s.service_code
        WHERE t.invoice_number = $1
        LIMIT 1
      `, [invoice]);
                return res.json({
                    status: 0,
                    message: "Transaksi berhasil",
                    data: trxDetail.rows[0],
                });
            }
            catch (error) {
                yield db_1.default.query("ROLLBACK");
                return res
                    .status(500)
                    .json({ status: 1, message: "Transaksi gagal", error: error.message });
            }
        });
    }
    getTransactionHistory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
                const query = `
        SELECT 
          t.invoice_number,
          t.transaction_type,
          CASE 
            WHEN t.transaction_type = 'TOPUP' THEN 'Top Up balance'
            ELSE s.service_name
          END AS description,
          t.amount AS total_amount,
          t.created_at AS created_on
        FROM transactions t
        LEFT JOIN services s ON t.service_code = s.service_code
        WHERE t.user_id = $1
        ORDER BY t.created_at DESC
        LIMIT 3 OFFSET $2
      `;
                const params = [userId, offset];
                const result = yield db_1.default.query(query, params);
                return res.status(200).json({
                    status: 0,
                    message: "Get History Berhasil",
                    data: {
                        offset: offset,
                        limit: 3,
                        records: result.rows,
                    },
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: 1,
                    message: "Internal server error",
                    error: error.message,
                });
            }
        });
    }
}
exports.TransactionController = TransactionController;
