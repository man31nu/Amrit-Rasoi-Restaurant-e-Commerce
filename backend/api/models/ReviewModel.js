/**
 * ReviewModel
 *
 * @description :: Data access model for reviews table
 */

const db = require('../config/poolConnection');

module.exports = {
  getReviewByUserAndProduct: async (productId, userId) => {
    const { rows } = await db.query(
      'SELECT review_id FROM reviews WHERE product_id = $1 AND user_id = $2',
      [productId, userId]
    );
    return rows[0] || null;
  },

  createReview: async (reviewData) => {
    const { productId, userId, userName, userAvatar, rating, title, comment, createdBy } = reviewData;

    const insertQuery = `
      INSERT INTO reviews (product_id, user_id, user_name, user_avatar, rating, title, comment, created_by, updated_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8)
      RETURNING review_id AS "id", review_id AS "reviewId", rating, title, comment, product_id AS "productId", user_id AS "userId", user_name AS "userName", user_avatar AS "userAvatar", is_verified_buyer AS "isVerifiedBuyer", created_at AS "createdAt"
    `;

    const { rows } = await db.query(insertQuery, [
      productId,
      userId,
      userName || 'Diner',
      userAvatar || null,
      rating,
      title || null,
      comment.trim(),
      createdBy
    ]);

    await db.query(`
      UPDATE products 
      SET rating = (SELECT ROUND(AVG(rating)::numeric, 1)::float FROM reviews WHERE product_id = $1),
          review_count = (SELECT COUNT(*)::int FROM reviews WHERE product_id = $1)
      WHERE product_id = $1
    `, [productId]);

    return rows[0];
  },

  getReviewsByProductId: async (productId) => {
    const queryText = `
      SELECT r.review_id AS "id", r.review_id AS "reviewId", r.rating, r.title, r.comment, r.product_id AS "productId", r.user_id AS "userId", 
        r.user_name AS "userName", r.user_avatar AS "userAvatar", r.is_verified_buyer AS "isVerifiedBuyer",
        r.created_at AS "createdAt",
        json_build_object('id', u.user_id, 'name', u.name, 'avatarUrl', u.avatar_url) as user
      FROM reviews r
      JOIN users u ON r.user_id = u.user_id
      WHERE r.product_id = $1
      ORDER BY r.created_at DESC
    `;

    const { rows } = await db.query(queryText, [productId]);
    return rows;
  }
};
