/**
 * CouponModel
 *
 * @description :: Data access model for coupons table
 */

const db = require('../config/poolConnection');

module.exports = {
  getCouponByCode: async (code) => {
    const queryText = `
      SELECT coupon_id AS "id", coupon_id AS "couponId", code, description, discount_percent AS "discountPercent", min_order_amount AS "minOrderAmount", max_discount AS "maxDiscount", usage_limit AS "usageLimit", times_used AS "timesUsed", expires_at AS "expiresAt", is_active AS "isActive" 
      FROM coupons 
      WHERE LOWER(code) = LOWER($1)
    `;

    const { rows } = await db.query(queryText, [code.trim()]);
    return rows[0] || null;
  },

  getAllActiveCoupons: async () => {
    const queryText = `
      SELECT coupon_id AS "id", coupon_id AS "couponId", code, description, discount_percent AS "discountPercent", min_order_amount AS "minOrderAmount", max_discount AS "maxDiscount", expires_at AS "expiresAt"
      FROM coupons
      WHERE is_active = true
      ORDER BY created_at DESC
    `;

    const { rows } = await db.query(queryText);
    return rows;
  }
};
