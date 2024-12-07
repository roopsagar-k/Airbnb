import pg from "pg";
import url from "url";
import "@dotenv/config";

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync('./ca.pem').toString(),
    },
};

const db = new pg.Pool(config);

(async () => {
    try {
        await db.connect();
        console.log("🎉🚀 Database connected successfully!");
    } catch (error) {
        console.error("❌🔥 Error connecting to the database:", error.message);
        throw error
    }
})();

export default db;

