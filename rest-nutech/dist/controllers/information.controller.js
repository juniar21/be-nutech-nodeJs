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
exports.InformationController = void 0;
const db_1 = __importDefault(require("../config/db"));
class InformationController {
    getBanners(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `SELECT banner_name, banner_image, description FROM banners`;
                const result = yield db_1.default.query(query);
                return res.status(200).json({
                    status: 0,
                    message: "Sukses",
                    data: result.rows,
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
    getServices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
        SELECT service_code, service_name, service_icon, service_tariff
        FROM services
      `;
                const result = yield db_1.default.query(query);
                return res.status(200).json({
                    status: 0,
                    message: "Sukses",
                    data: result.rows,
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
exports.InformationController = InformationController;
