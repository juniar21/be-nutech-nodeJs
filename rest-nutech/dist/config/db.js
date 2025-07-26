"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
require("dotenv/config");
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Penting untuk Supabase & Railway
    },
    // user: process.env.DB_USER,
    // host: process.env.DB_HOST,
    // database: process.env.DB_DATABASE,
    // password: process.env.DB_PASSWORD,
    // port:5432,
});
exports.default = pool;
