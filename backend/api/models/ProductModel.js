/**
 * ProductModel
 *
 * @description :: Data access model for products table
 */

const db = require('../config/poolConnection');

module.exports = {
  getProducts: async (filters) => {
    const { search, category, sortBy, order, isVeg, spiceLevel } = filters;

    let queryText = `
      SELECT 
        p.product_id AS "id", p.product_id AS "productId", p.name, p.description, p.price, p.discount_price AS "discountPrice", 
        p.category, p.image_url AS "imageUrl", p.is_veg AS "isVeg", 
        p.spice_level AS "spiceLevel", p.preparation_time AS "preparationTime",
        p.rating, p.review_count AS "reviewCount", p.is_available AS "isAvailable",
        p.tags, p.created_at AS "createdAt", p.updated_at AS "updatedAt",
        ROUND(COALESCE(AVG(r.rating), p.rating)::numeric, 1)::float as "avgRating",
        COUNT(r.review_id)::int as "numReviews"
      FROM products p
      LEFT JOIN reviews r ON p.product_id = r.product_id
      WHERE 1=1
    `;

    const queryParams = [];

    if (search) {
      const sanitizedSearch = String(search).replace(/[%_\\]/g, '\\$&');
      queryParams.push(`%${sanitizedSearch}%`);
      queryText += ` AND (p.name ILIKE $${queryParams.length} OR p.description ILIKE $${queryParams.length})`;
    }

    if (category && category !== 'All') {
      queryParams.push(category);
      queryText += ` AND p.category = $${queryParams.length}`;
    }

    if (isVeg !== undefined && isVeg !== 'all') {
      queryParams.push(isVeg === 'true');
      queryText += ` AND p.is_veg = $${queryParams.length}`;
    }

    if (spiceLevel && spiceLevel !== 'all') {
      queryParams.push(spiceLevel);
      queryText += ` AND p.spice_level = $${queryParams.length}`;
    }

    queryText += ` GROUP BY p.product_id`;

    if (sortBy === 'price') {
      const dir = order === 'desc' ? 'DESC' : 'ASC';
      queryText += ` ORDER BY p.price ${dir}`;
    } else {
      queryText += ` ORDER BY p.created_at DESC`;
    }

    const { rows } = await db.query(queryText, queryParams);
    return rows;
  },

  getProductById: async (productId) => {
    const productQuery = `
      SELECT 
        p.product_id AS "id", p.product_id AS "productId", p.name, p.description, p.price, p.discount_price AS "discountPrice", 
        p.category, p.image_url AS "imageUrl", p.is_veg AS "isVeg", 
        p.spice_level AS "spiceLevel", p.preparation_time AS "preparationTime",
        p.rating, p.review_count AS "reviewCount", p.is_available AS "isAvailable",
        p.tags, p.created_at AS "createdAt", p.updated_at AS "updatedAt",
        ROUND(COALESCE(AVG(r.rating), p.rating)::numeric, 1)::float as "avgRating",
        COUNT(r.review_id)::int as "numReviews"
      FROM products p
      LEFT JOIN reviews r ON p.product_id = r.product_id
      WHERE p.product_id = $1
      GROUP BY p.product_id
    `;

    const { rows } = await db.query(productQuery, [productId]);
    return rows[0] || null;
  },

  createProduct: async (productData) => {
    const { name, description, price, discountPrice, category, imageUrl, isVeg, spiceLevel, preparationTime, tags, createdBy } = productData;
    const queryText = `
      INSERT INTO products (name, description, price, discount_price, category, image_url, is_veg, spice_level, preparation_time, tags, created_by, updated_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $11)
      RETURNING product_id AS "id", product_id AS "productId", name, description, price, discount_price AS "discountPrice", category, image_url AS "imageUrl", is_veg AS "isVeg", spice_level AS "spiceLevel", preparation_time AS "preparationTime", rating, review_count AS "reviewCount", is_available AS "isAvailable", tags, created_at AS "createdAt"
    `;

    const values = [
      name,
      description,
      parseFloat(price),
      discountPrice ? parseFloat(discountPrice) : null,
      category,
      imageUrl,
      isVeg === 'true' || isVeg === true,
      spiceLevel || 'Mild',
      preparationTime ? parseInt(preparationTime) : 20,
      tags ? (typeof tags === 'string' ? tags : JSON.stringify(tags)) : '["popular"]',
      createdBy || 'admin'
    ];

    const { rows } = await db.query(queryText, values);
    return rows[0];
  },

  updateProduct: async (productId, productData) => {
    const { name, description, price, discountPrice, category, imageUrl, isVeg, spiceLevel, preparationTime, isAvailable, tags, updatedBy } = productData;

    const queryText = `
      UPDATE products
      SET name = $1, description = $2, price = $3, discount_price = $4, category = $5, image_url = $6, is_veg = $7, spice_level = $8, preparation_time = $9, is_available = $10, tags = $11, updated_by = $12, updated_at = CURRENT_TIMESTAMP
      WHERE product_id = $13
      RETURNING product_id AS "id", product_id AS "productId", name, description, price, discount_price AS "discountPrice", category, image_url AS "imageUrl", is_veg AS "isVeg", spice_level AS "spiceLevel", preparation_time AS "preparationTime", rating, review_count AS "reviewCount", is_available AS "isAvailable", tags, created_at AS "createdAt", updated_at AS "updatedAt"
    `;

    const values = [name, description, price, discountPrice, category, imageUrl, isVeg, spiceLevel, preparationTime, isAvailable, tags, updatedBy, productId];

    const { rows } = await db.query(queryText, values);
    return rows[0] || null;
  },

  deleteProduct: async (productId) => {
    const { rows } = await db.query('DELETE FROM products WHERE product_id = $1 RETURNING product_id AS "id"', [productId]);
    return rows[0] || null;
  }
};
