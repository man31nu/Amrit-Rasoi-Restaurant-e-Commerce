/**
 * UserModel
 *
 * @description :: Data access model for users table
 */

const db = require('../config/poolConnection');

module.exports = {
  findByEmail: async (email) => {
    const clean = (email || '').trim().toLowerCase();
    const { rows } = await db.query(
      'SELECT user_id AS "id", user_id AS "userId", name, email, password, role, phone, address, city, pincode, avatar_url AS "avatarUrl", loyalty_points AS "loyaltyPoints", status, is_verified AS "isVerified", (EXTRACT(EPOCH FROM created_at) * 1000)::bigint AS "createdAt" FROM users WHERE LOWER(email) = LOWER($1)',
      [clean]
    );
    return rows[0] || null;
  },

  findById: async (id) => {
    const { rows } = await db.query(
      'SELECT user_id AS "id", user_id AS "userId", name, email, role, phone, address, city, pincode, avatar_url AS "avatarUrl", loyalty_points AS "loyaltyPoints", status, is_verified AS "isVerified", (EXTRACT(EPOCH FROM created_at) * 1000)::bigint AS "createdAt" FROM users WHERE user_id = $1',
      [id]
    );
    return rows[0] || null;
  },

  createUser: async (userData) => {
    const { name, email, password, phone, address, city, pincode, createdBy } = userData;
    const queryText = `
      INSERT INTO users (name, email, password, phone, address, city, pincode, created_by, updated_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8)
      RETURNING user_id AS "id", user_id AS "userId", name, email, role, phone, address, city, pincode, is_verified AS "isVerified", loyalty_points AS "loyaltyPoints", avatar_url AS "avatarUrl", status, (EXTRACT(EPOCH FROM created_at) * 1000)::bigint AS "createdAt"
    `;
    const { rows } = await db.query(queryText, [name, email, password, phone || null, address || null, city || 'Delhi', pincode || '110001', createdBy || 'self_register']);
    return rows[0];
  },

  createGoogleUser: async (userData) => {
    const { name, email, password, avatarUrl, createdBy } = userData;
    const insertQuery = `
      INSERT INTO users (name, email, password, avatar_url, is_verified, created_by, updated_by)
      VALUES ($1, $2, $3, $4, true, $5, $5)
      RETURNING user_id AS "id", user_id AS "userId", name, email, role, avatar_url AS "avatarUrl", (EXTRACT(EPOCH FROM created_at) * 1000)::bigint AS "createdAt"
    `;
    const { rows } = await db.query(insertQuery, [name || 'Google User', email, password, avatarUrl || null, createdBy || 'google_oauth']);
    return rows[0];
  },

  updateLastLogin: async (userId) => {
    await db.query('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE user_id = $1', [userId]);
  },

  getAllUsers: async () => {
    const { rows } = await db.query(
      'SELECT user_id AS "id", user_id AS "userId", name, email, role, phone, address, city, pincode, avatar_url AS "avatarUrl", loyalty_points AS "loyaltyPoints", status, is_verified AS "isVerified", (EXTRACT(EPOCH FROM created_at) * 1000)::bigint AS "createdAt" FROM users ORDER BY created_at DESC'
    );
    return rows;
  },

  updateUserRole: async (userId, role, updatedBy) => {
    const { rows } = await db.query(
      'UPDATE users SET role = $1, updated_by = $2, updated_at = CURRENT_TIMESTAMP WHERE user_id = $3 RETURNING user_id AS "id", user_id AS "userId", name, email, role, (EXTRACT(EPOCH FROM created_at) * 1000)::bigint AS "createdAt"',
      [role, updatedBy, userId]
    );
    return rows[0] || null;
  },

  updateProfile: async (userId, profileData) => {
    const { name, email, phone, address, city, pincode, avatarUrl, password, updatedBy } = profileData;
    const queryText = `
      UPDATE users
      SET name = COALESCE(NULLIF($1, ''), name),
          email = COALESCE(NULLIF($2, ''), email),
          phone = COALESCE($3, phone),
          address = COALESCE($4, address),
          city = COALESCE($5, city),
          pincode = COALESCE($6, pincode),
          avatar_url = COALESCE($7, avatar_url),
          password = COALESCE($8, password),
          updated_by = $9,
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $10
      RETURNING user_id AS "id", user_id AS "userId", name, email, role, phone, address, city, pincode, avatar_url AS "avatarUrl", loyalty_points AS "loyaltyPoints", status, is_verified AS "isVerified", (EXTRACT(EPOCH FROM created_at) * 1000)::bigint AS "createdAt"
    `;
    const { rows } = await db.query(queryText, [
      name || null,
      email || null,
      phone !== undefined ? phone : null,
      address !== undefined ? address : null,
      city !== undefined ? city : null,
      pincode !== undefined ? pincode : null,
      avatarUrl !== undefined ? avatarUrl : null,
      password || null,
      updatedBy,
      userId
    ]);
    return rows[0] || null;
  }
};
