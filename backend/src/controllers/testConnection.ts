import pool from '../config/DatabaseConfig'; // Đảm bảo bạn có file DatabaseConfig.ts với export default của Pool
import { QueryResult } from 'pg';

interface Product {
  name: string;
  image: string;
  quantity: number;
  price: string;
  drop: string;
  type: string;
  description: string;
  color: string;
  storage: string;
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const viewAllProducts = async (): Promise<any[]> => {
  const query = 'SELECT * FROM product WHERE product.id = $1;';

  try {
    const res = await pool.query(query);
   
    return res.rows;
  } catch (err) {
    console.error(err);
    throw err; // Thay đổi ở đây để phản hồi lỗi đúng cách
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const viewAllItems = async (): Promise<any[]> => {
  const query = 'SELECT * FROM item;';

  try {
    const res = await pool.query(query);
  
    return res.rows;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const insertProduct = async (product: Product): Promise<void> => {
  const { name, image, quantity, price, drop, type, description, color, storage } = product;
  const query = `
      INSERT INTO product(name, image, quantity, price, drop, type, description, color, storage)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
  const values : any = [name, image, quantity, price, drop, type, description, color, storage];
  
  try {
    const result: QueryResult = await pool.query(query, values);
    console.log('Product inserted successfully:', result.rows[0]);
  } catch (error) {
    console.error('Error inserting product:', error);
  } finally {
    // Close the connection pool after executing the query
    await pool.end();
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateProduct = async (id: number, product: Product): Promise<void> => {
  const { name, image, quantity, price, drop, type, description, color, storage } = product;
  const query = `
    UPDATE product
    SET name = $2, image = $3, quantity = $4, price = $5, drop = $6, type = $7, description = $8, color = $9, storage = $10
    WHERE id = $1
    RETURNING *;
  `;
  const values : any = { id, name, image, quantity, price, drop, type, description, color, storage };

  try {
    await pool.query(query, values);

  } catch (err) {
    console.error(err);
    throw err;
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteProductById = async (id: number): Promise<any> => {
  const query = 'DELETE FROM product WHERE id = $1 RETURNING *;';

  try {
    const res = await pool.query(query, [id]);
    if (res.rows.length > 0) {
      return res.rows[0];
    } else {
      console.log('Product not found or already deleted.');
      return null;
    }
  } catch (err) {
    console.error('Error deleting product:', err);
    throw err;
  }
};

const newProduct: Product = {
  name: 'Samsung Galaxy Z Fold 4',
  image: 'https://clickbuy.com.vn/uploads/2022/07/Z-Fold-Moon-Beige-640x640-2.png',
  quantity: 15,
  price: '20000000',
  drop: '2023-05-29',
  type: 'Iphone',
  description: 'This is Samsung Galaxy Z Fold 4',
  color: 'Black',
  storage: '256GB',
};

// viewAllItems();
// viewAllProducts();
insertProduct(newProduct);
// updateProduct(5, newProduct);
// deleteProductById(5);