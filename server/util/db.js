import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    host: "localhost",
  }
);

export default sequelize;

// import mysql from "mysql2";

// export const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "0173794628",
//     database: "blog_1"
// });