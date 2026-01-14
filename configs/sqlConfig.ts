import { Sequelize } from 'sequelize';
import pg from 'pg';

const database = process.env.DB_URL;

if (!database) {
  throw new Error('db url was undefined or not a string');
}

const sequelize = new Sequelize(database, {
  dialect: 'postgres',
  dialectModule: pg,
});

// export const connectDb = async () => {
//     try {
//         console.log(database)
//         await sequelize.authenticate()
//         console.log("DB Connect Success")
//     } catch (error: any) {
//         console.error("db connect failed", error)
//     }
// }

export default sequelize;
