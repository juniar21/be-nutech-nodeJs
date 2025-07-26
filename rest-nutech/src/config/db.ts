import {Pool} from "pg";
import "dotenv/config";

const pool = new Pool ({
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

export default pool;



