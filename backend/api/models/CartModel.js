/**
 * CartModel
 *
 * @description :: Data access model for carts & cart_items tables
 */

const db = require('../config/poolConnection');

module.exports = {
  getCartByUserId: async (userId) => {
    let { rows: cartRows } = await db.query('SELECT cart_id AS "id", cart_id AS "cartId", user_id AS "userId", coupon_code AS "couponCode", created_at AS "createdAt", updated_at AS "updatedAt" FROM carts WHERE user_id = $1', [userId]);

    if (cartRows.length === 0) {
      const { rows: newCart } = await db.query(
        'INSERT INTO carts (user_id, created_by, updated_by) VALUES ($1, $2, $2) RETURNING cart_id AS "id", cart_id AS "cartId", user_id AS "userId", coupon_code AS "couponCode", created_at AS "createdAt", updated_at AS "updatedAt"',
        [userId, userId]
      );
      cartRows = newCart;
    }

    const cart = cartRows[0];

    const itemsQuery = `
      SELECT ci.cart_item_id AS "id", ci.cart_item_id AS "cartItemId", ci.cart_id AS "cartId", ci.product_id AS "productId", ci.quantity,
        json_build_object(
          'id', p.product_id,
          'productId', p.product_id,
          'name', p.name,
          'description', p.description,
          'price', p.price,
          'discountPrice', p.discount_price,
          'category', p.category,
          'imageUrl', p.image_url,
          'isVeg', p.is_veg,
          'spiceLevel', p.spice_level,
          'preparationTime', p.preparation_time
        ) as product
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.product_id
      WHERE ci.cart_id = $1
      ORDER BY ci.created_at ASC
    `;

    const { rows: itemRows } = await db.query(itemsQuery, [cart.id]);
    cart.items = itemRows;

    return cart;
  },

  addItem: async (userId, productId, quantity) => {
    let { rows: cartRows } = await db.query('SELECT cart_id AS "id" FROM carts WHERE user_id = $1', [userId]);
    if (cartRows.length === 0) {
      const { rows: newCart } = await db.query('INSERT INTO carts (user_id, created_by, updated_by) VALUES ($1, $2, $2) RETURNING cart_id AS "id"', [userId, userId]);
      cartRows = newCart;
    }

    const cartId = cartRows[0].id;

    const { rows: existingItems } = await db.query(
      'SELECT cart_item_id AS "id", quantity FROM cart_items WHERE cart_id = $1 AND product_id = $2',
      [cartId, productId]
    );

    if (existingItems.length > 0) {
      const newQty = existingItems[0].quantity + quantity;
      await db.query('UPDATE cart_items SET quantity = $1, updated_by = $2, updated_at = CURRENT_TIMESTAMP WHERE cart_item_id = $3', [newQty, userId, existingItems[0].id]);
    } else {
      await db.query('INSERT INTO cart_items (cart_id, product_id, quantity, created_by, updated_by) VALUES ($1, $2, $3, $4, $4)', [cartId, productId, quantity, userId]);
    }
  },

  updateItem: async (itemId, userId, quantity) => {
    const { rows: itemRows } = await db.query(
      'SELECT ci.cart_item_id AS "id", ci.cart_id AS "cartId", c.user_id AS "userId" FROM cart_items ci JOIN carts c ON ci.cart_id = c.cart_id WHERE ci.cart_item_id = $1',
      [itemId]
    );

    if (itemRows.length === 0 || itemRows[0].userId !== userId) {
      return null;
    }

    if (quantity <= 0) {
      await db.query('DELETE FROM cart_items WHERE cart_item_id = $1', [itemId]);
    } else {
      await db.query('UPDATE cart_items SET quantity = $1, updated_by = $2, updated_at = CURRENT_TIMESTAMP WHERE cart_item_id = $3', [quantity, userId, itemId]);
    }

    return true;
  },

  removeItem: async (itemId, userId) => {
    const { rows: itemRows } = await db.query(
      'SELECT ci.cart_item_id AS "id", ci.cart_id AS "cartId", c.user_id AS "userId" FROM cart_items ci JOIN carts c ON ci.cart_id = c.cart_id WHERE ci.cart_item_id = $1',
      [itemId]
    );

    if (itemRows.length === 0 || itemRows[0].userId !== userId) {
      return null;
    }

    await db.query('DELETE FROM cart_items WHERE cart_item_id = $1', [itemId]);
    return true;
  },

  clearCartByUserId: async (userId) => {
    await db.query(`
      DELETE FROM cart_items 
      WHERE cart_id IN (SELECT cart_id FROM carts WHERE user_id = $1)
    `, [userId]);
  }
};
