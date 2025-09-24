import * as dotenv from 'dotenv';
import * as path from 'path';
import { DataSource } from 'typeorm';

// 只在非生产环境加载 dotenv
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join(__dirname, '../../.env.local') });
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'role_playing_agent',
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  migrations: [],
  subscribers: [],
});

export const initializeDatabase = async () => {
  await AppDataSource.initialize();
  // eslint-disable-next-line no-console
  console.log('Database connection initialized');
};
