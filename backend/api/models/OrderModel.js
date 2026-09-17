/**
 * OrderModel
 *
 * @description :: Data access model for orders & order_items tables
 */

const db = require('../config/poolConnection');

module.exports = {
  createOrderTransaction: async (orderData) => {
    const {
      userId,
      orderNum,
      subtotal,
      taxAmount,
      deliveryFee,
      discountAmount,
      totalAmount,
      couponCode,
      paymentMethod,
      deliveryAddress,
      deliveryNotes,
      validatedItems
    } = orderData;

    const client = await db.pool.connect();
    let dbOrderId;

    try {
      await client.query('BEGIN');
      const orderRes = await client.query(
        `INSERT INTO orders (user_id, order_number, subtotal, tax_amount, delivery_fee, discount_amount, total_amount, coupon_code, payment_method, payment_status, delivery_address, delivery_notes, status, created_by, updated_by) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $14) RETURNING order_id AS "id"`,
        [
          userId,
          orderNum,
          subtotal,
          taxAmount,
          deliveryFee,
          discountAmount,
          totalAmount,
          couponCode,
          paymentMethod || 'Razorpay',
          'pending',
          deliveryAddress || null,
          deliveryNotes || null,
          'pending',
          userId
        ]
      );
      dbOrderId = orderRes.rows[0].id;

      for (const item of validatedItems) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, product_name, quantity, price, total_price) 
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [dbOrderId, item.productId, item.name, item.quantity, item.price, item.totalPrice]
        );
      }

      await client.query('COMMIT');
      return dbOrderId;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  updatePaymentStatus: async (dbOrderId, transactionId, userId) => {
    const updateResult = await db.query(
      `UPDATE orders SET status = 'paid', payment_status = 'paid', transaction_id = $1, updated_by = $2, updated_at = CURRENT_TIMESTAMP WHERE order_id = $3 RETURNING order_id AS "id", user_id AS "userId", order_number AS "orderNumber", total_amount AS "totalAmount", status, payment_status AS "paymentStatus", created_at AS "createdAt"`,
      [transactionId, userId, dbOrderId]
    );

    return updateResult.rows[0] || null;
  },

  getOrdersByUserId: async (userId) => {
    const query = `
      SELECT 
        o.order_id AS "id",
        o.order_id AS "orderId",
        o.user_id AS "userId",
        o.order_number AS "orderNumber",
        o.subtotal,
        o.tax_amount AS "taxAmount",
        o.delivery_fee AS "deliveryFee",
        o.discount_amount AS "discountAmount",
        o.total_amount AS "totalAmount",
        o.coupon_code AS "couponCode",
        o.payment_method AS "paymentMethod",
        o.payment_status AS "paymentStatus",
        o.delivery_address AS "deliveryAddress",
        o.status,
        o.created_at AS "createdAt",
        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.order_item_id,
              'orderId', oi.order_id,
              'productId', oi.product_id,
              'quantity', oi.quantity,
              'price', oi.price,
              'totalPrice', oi.total_price,
              'product', json_build_object(
                'id', p.product_id,
                'name', p.name,
                'description', p.description,
                'price', p.price,
                'category', p.category,
                'imageUrl', p.image_url,
                'isVeg', p.is_veg,
                'spiceLevel', p.spice_level
              )
            )
          ) FILTER (WHERE oi.order_item_id IS NOT NULL), '[]'::json
        ) AS items
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.product_id
      WHERE o.user_id = $1
      GROUP BY o.order_id
      ORDER BY o.created_at DESC
    `;

    const result = await db.query(query, [userId]);
    return result.rows;
  },

  getAllOrders: async () => {
    const query = `
      SELECT 
        o.order_id AS "id",
        o.order_id AS "orderId",
        o.user_id AS "userId",
        o.order_number AS "orderNumber",
        o.subtotal,
        o.tax_amount AS "taxAmount",
        o.delivery_fee AS "deliveryFee",
        o.discount_amount AS "discountAmount",
        o.total_amount AS "totalAmount",
        o.coupon_code AS "couponCode",
        o.payment_method AS "paymentMethod",
        o.payment_status AS "paymentStatus",
        o.delivery_address AS "deliveryAddress",
        o.status,
        o.created_at AS "createdAt",
        json_build_object(
          'name', u.name,
          'email', u.email,
          'phone', u.phone
        ) AS user,
        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.order_item_id,
              'orderId', oi.order_id,
              'productId', oi.product_id,
              'quantity', oi.quantity,
              'price', oi.price,
              'totalPrice', oi.total_price,
              'product', json_build_object(
                'id', p.product_id,
                'name', p.name,
                'description', p.description,
                'price', p.price,
                'category', p.category,
                'imageUrl', p.image_url,
                'isVeg', p.is_veg,
                'spiceLevel', p.spice_level
              )
            )
          ) FILTER (WHERE oi.order_item_id IS NOT NULL), '[]'::json
        ) AS items
      FROM orders o
      JOIN users u ON o.user_id = u.user_id
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.product_id
      GROUP BY o.order_id, u.user_id
      ORDER BY o.created_at DESC
    `;

    const result = await db.query(query);
    return result.rows;
  },

  updateOrderStatus: async (orderId, status, updatedBy) => {
    const updateResult = await db.query(
      `UPDATE orders SET status = $1, updated_by = $2, updated_at = CURRENT_TIMESTAMP WHERE order_id = $3 RETURNING order_id AS "id", user_id AS "userId", order_number AS "orderNumber", total_amount AS "totalAmount", status, payment_status AS "paymentStatus", created_at AS "createdAt"`,
      [status, updatedBy, orderId]
    );

    return updateResult.rows[0] || null;
  },

  getAnalyticsData: async () => {
    const statsRes = await db.query(
      `SELECT 
         COALESCE(SUM(total_amount), 0)::float AS "totalRevenue",
         COUNT(*)::int AS "totalOrders"
       FROM orders
       WHERE status != 'pending'`
    );

    const totalRevenue = statsRes.rows[0].totalRevenue || 0;
    const totalOrders = statsRes.rows[0].totalOrders || 0;

    const usersRes = await db.query(
      `SELECT COUNT(DISTINCT user_id)::int AS "activeUsers" FROM orders`
    );
    const activeUsers = usersRes.rows[0].activeUsers || 0;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesRes = await db.query(
      `SELECT 
         TO_CHAR(created_at, 'YYYY-MM-DD') AS date,
         SUM(total_amount)::float AS total
       FROM orders
       WHERE created_at >= $1 AND status NOT IN ('pending', 'cancelled')
       GROUP BY TO_CHAR(created_at, 'YYYY-MM-DD')
       ORDER BY date ASC`,
      [sevenDaysAgo]
    );

    const salesByDate = {};
    salesRes.rows.forEach((row) => {
      salesByDate[row.date] = row.total;
    });

    return {
      totalRevenue,
      totalOrders,
      activeUsers,
      salesByDate,
    };
  }
};
