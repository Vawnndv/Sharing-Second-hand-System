import { Pool } from 'pg';

interface PoolConfig {
  user: string;
  password: string;
  host: string;
  port: number; // Sử dụng number hoặc string tùy thuộc vào cách bạn muốn xử lý port
  database: string;
}

const poolConfig: PoolConfig = {
  user: 'DoAnTotNghiep',
  password: '12312345',
  host: 'demo-postgres.ctkww2m2atlj.ap-southeast-2.rds.amazonaws.com',
  port: 5432, // Nếu muốn sử dụng số, bạn cần chuyển '5432' thành 5432
  database: 'sampleDB',
};

const pool = new Pool(poolConfig);

export default pool;