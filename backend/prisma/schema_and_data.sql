-- =========================================================
-- Amrit Rasoi - Production PostgreSQL Database Schema & Seed Data
-- =========================================================

-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clean up old tables if re-initialising
DROP TABLE IF EXISTS cart_items, carts, order_items, orders, reviews, coupons, products, users CASCADE;
DROP TABLE IF EXISTS "CartItem", "Cart", "OrderItem", "Order", "Review", "Coupon", "Product", "User" CASCADE;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  user_id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'customer',
  phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100) DEFAULT 'Delhi',
  pincode VARCHAR(20) DEFAULT '110001',
  avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=500',
  loyalty_points INTEGER DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  is_verified BOOLEAN NOT NULL DEFAULT false,
  last_login_at TIMESTAMP(3),
  created_by VARCHAR(255) DEFAULT 'system',
  updated_by VARCHAR(255) DEFAULT 'system',
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  product_id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DOUBLE PRECISION NOT NULL,
  discount_price DOUBLE PRECISION,
  category VARCHAR(100) NOT NULL,
  image_url TEXT NOT NULL,
  is_veg BOOLEAN NOT NULL DEFAULT true,
  spice_level VARCHAR(20) NOT NULL DEFAULT 'Mild',
  preparation_time INTEGER NOT NULL DEFAULT 20,
  rating DOUBLE PRECISION NOT NULL DEFAULT 4.5,
  review_count INTEGER NOT NULL DEFAULT 0,
  is_available BOOLEAN NOT NULL DEFAULT true,
  tags TEXT DEFAULT '["popular", "chef-special"]',
  created_by VARCHAR(255) DEFAULT 'system',
  updated_by VARCHAR(255) DEFAULT 'system',
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_veg ON products(is_veg);
CREATE INDEX IF NOT EXISTS idx_products_spice_level ON products(spice_level);

-- 3. CARTS & CART ITEMS TABLES
CREATE TABLE IF NOT EXISTS carts (
  cart_id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  user_id VARCHAR(36) UNIQUE NOT NULL,
  coupon_code VARCHAR(100),
  created_by VARCHAR(255) DEFAULT 'system',
  updated_by VARCHAR(255) DEFAULT 'system',
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cart_items (
  cart_item_id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  cart_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_by VARCHAR(255) DEFAULT 'system',
  updated_by VARCHAR(255) DEFAULT 'system',
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cart_id) REFERENCES carts(cart_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- 4. ORDERS & ORDER ITEMS TABLES
CREATE TABLE IF NOT EXISTS orders (
  order_id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  user_id VARCHAR(36) NOT NULL,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  subtotal DOUBLE PRECISION NOT NULL DEFAULT 0,
  tax_amount DOUBLE PRECISION NOT NULL DEFAULT 0,
  delivery_fee DOUBLE PRECISION NOT NULL DEFAULT 0,
  discount_amount DOUBLE PRECISION NOT NULL DEFAULT 0,
  total_amount DOUBLE PRECISION NOT NULL,
  coupon_code VARCHAR(100),
  payment_method VARCHAR(50) NOT NULL DEFAULT 'Razorpay',
  payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
  transaction_id VARCHAR(255),
  delivery_address TEXT,
  delivery_notes TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  estimated_delivery_time TIMESTAMP(3),
  created_by VARCHAR(255) DEFAULT 'system',
  updated_by VARCHAR(255) DEFAULT 'system',
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
  order_item_id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  order_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36) NOT NULL,
  product_name VARCHAR(255),
  quantity INTEGER NOT NULL,
  price DOUBLE PRECISION NOT NULL,
  total_price DOUBLE PRECISION NOT NULL DEFAULT 0,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- 5. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
  review_id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  product_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  user_name VARCHAR(255),
  user_avatar TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT NOT NULL,
  is_verified_buyer BOOLEAN NOT NULL DEFAULT true,
  created_by VARCHAR(255) DEFAULT 'system',
  updated_by VARCHAR(255) DEFAULT 'system',
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 6. COUPONS TABLE
CREATE TABLE IF NOT EXISTS coupons (
  coupon_id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  code VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  discount_percent DOUBLE PRECISION NOT NULL,
  min_order_amount DOUBLE PRECISION NOT NULL DEFAULT 0,
  max_discount DOUBLE PRECISION,
  usage_limit INTEGER DEFAULT 100,
  times_used INTEGER DEFAULT 0,
  starts_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP(3),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by VARCHAR(255) DEFAULT 'system',
  updated_by VARCHAR(255) DEFAULT 'system',
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- SEED DATA INSERTS
-- =========================================================

-- Insert Sample Test Users (Passwords: user123 for customer, admin123 for admins)
INSERT INTO users (user_id, name, email, password, role, phone, address, is_verified, created_by, updated_by) VALUES
('u1', 'Test Customer', 'user@example.com', '$2b$10$8SpkZwI4ZbCColQSEvM1f.vUCB6hY5xGK1HH3RnltyZ7ODYmQ4SFi', 'customer', '+919876543210', 'Connaught Place, New Delhi', true, 'seed_admin', 'seed_admin'),
('u2', 'Admin Master', 'admin@example.com', '$2b$10$SiWrYI7qd13RCA.VSm6QT.7jH2JkuL0TVTR/dulDnFZF/t2zGYmPq', 'admin', '+919876543211', 'Main Restaurant Hub, New Delhi', true, 'seed_admin', 'seed_admin'),
('u3', 'Mannu Kumar', 'mannuzadav21304@gmail.com', '$2b$10$SiWrYI7qd13RCA.VSm6QT.7jH2JkuL0TVTR/dulDnFZF/t2zGYmPq', 'admin', '+919876543212', 'New Delhi', true, 'seed_admin', 'seed_admin')
ON CONFLICT (user_id) DO UPDATE SET password = EXCLUDED.password, role = EXCLUDED.role;

-- Insert 60 Products (10 per category)
INSERT INTO products (product_id, name, description, price, discount_price, category, image_url, is_veg, spice_level, preparation_time, rating, review_count, created_by, updated_by) VALUES
-- 1. VEG MAIN COURSE (10 ITEMS)
('p1', 'Paneer Tikka Masala', 'Charcoal grilled cottage cheese in a rich tomato and butter gravy with secret spices.', 320, 290, 'Veg Main Course', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=2000', true, 'Medium', 25, 4.8, 124, 'seed_admin', 'seed_admin'),
('p2', 'Hyderabadi Veg Biryani', 'Slow-cooked basmati rice with seasonal vegetables, aromatic saffron, and exotic spices.', 280, 250, 'Veg Main Course', 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?q=80&w=2000', true, 'Spicy', 30, 4.7, 98, 'seed_admin', 'seed_admin'),
('p3', 'Dal Makhani Artisan', 'Overnight slow-cooked black lentils, tempered with cream, butter, and smoked chilies.', 240, 210, 'Veg Main Course', 'https://images.unsplash.com/photo-1585933334452-f1f034091986?q=80&w=2000', true, 'Mild', 20, 4.9, 210, 'seed_admin', 'seed_admin'),
('p4', 'Shahi Malai Kofta', 'Velvety cottage cheese dumplings stuffed with nuts, served in a luscious white saffron gravy.', 350, 320, 'Veg Main Course', 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=2000', true, 'Mild', 25, 4.6, 76, 'seed_admin', 'seed_admin'),
('p5', 'Amritsari Chole Bhature', 'Traditional spiced chickpeas served with two oversized fluffy fried leavened breads.', 220, 199, 'Veg Main Course', 'https://images.unsplash.com/photo-1626132646529-5006375325d7?q=80&w=2000', true, 'Medium', 15, 4.8, 310, 'seed_admin', 'seed_admin'),
('p6', 'Tandoori Garlic Naan', 'Hand-stretched leavened bread with roasted garlic and fresh parsley, baked in clay oven.', 90, 79, 'Veg Main Course', 'https://images.unsplash.com/photo-1601050694117-62d44aa04af4?q=80&w=2000', true, 'Mild', 10, 4.7, 180, 'seed_admin', 'seed_admin'),
('p20', 'Kadhai Paneer Special', 'Fresh cottage cheese tossed with bell peppers, tomatoes, and coarsely ground kadhai spices.', 330, 299, 'Veg Main Course', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=2000', true, 'Spicy', 20, 4.6, 65, 'seed_admin', 'seed_admin'),
('p21', 'Kashmiri Dum Aloo', 'Baby potatoes slow simmered in an aromatic fennel and ginger infused gravy.', 260, 230, 'Veg Main Course', 'https://images.unsplash.com/photo-1585933334452-f1f034091986?q=80&w=2000', true, 'Medium', 25, 4.5, 42, 'seed_admin', 'seed_admin'),
('p22', 'Smoked Baingan Bharta', 'Fire-roasted eggplant mashed and tempered with garlic, green chilies, and ripe tomatoes.', 230, 200, 'Veg Main Course', 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=2000', true, 'Spicy', 20, 4.4, 38, 'seed_admin', 'seed_admin'),
('p23', 'Navratan Korma Royal', 'Nine gem vegetables and dry fruits simmered in a mildly sweet cashew cream curry.', 360, 330, 'Veg Main Course', 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?q=80&w=2000', true, 'Mild', 25, 4.7, 54, 'seed_admin', 'seed_admin'),

-- 2. NON-VEG MAIN COURSE (10 ITEMS)
('p7', 'Classic Butter Chicken', 'The legendary Moti Mahal style chicken in a luscious, velvety tomato cream gravy.', 450, 399, 'Non-Veg Main Course', 'https://images.unsplash.com/photo-1603894584100-345376a9170a?q=80&w=2000', false, 'Medium', 25, 4.9, 450, 'seed_admin', 'seed_admin'),
('p8', 'Kashmiri Mutton Rogan Josh', 'Tender mutton cooked in traditional Kashmiri style with yogurt and aromatic cloves.', 520, 480, 'Non-Veg Main Course', 'https://images.unsplash.com/photo-1542362567-b03430c916be?q=80&w=2000', false, 'Spicy', 35, 4.8, 190, 'seed_admin', 'seed_admin'),
('p9', 'Old Delhi Chicken Tikka Masala', 'Smoked chicken tikka tossed in a spicy onion-tomato masala with fresh coriander.', 420, 380, 'Non-Veg Main Course', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=2000', false, 'Spicy', 25, 4.7, 160, 'seed_admin', 'seed_admin'),
('p10', 'Atlantic Grilled Salmon', 'Herbed fresh salmon fillet, pan-seared and served with roasted garlic butter.', 680, 620, 'Non-Veg Main Course', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=2000', false, 'Mild', 20, 4.9, 88, 'seed_admin', 'seed_admin'),
('p24', 'Hyderabadi Chicken Dum Biryani', 'Layered basmati rice and marinated chicken cooked on slow charcoal heat.', 390, 350, 'Non-Veg Main Course', 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?q=80&w=2000', false, 'Spicy', 30, 4.8, 230, 'seed_admin', 'seed_admin'),
('p25', 'Tandoori Whole Chicken', 'Whole chicken marinated in mustard oil, hung curd, and roasted in clay oven.', 480, 440, 'Non-Veg Main Course', 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=2000', false, 'Spicy', 30, 4.7, 140, 'seed_admin', 'seed_admin'),
('p26', 'Mutton Seekh Kabab Masala', 'Succulent minced lamb skewers tossed in a spicy kadhai gravy.', 510, 470, 'Non-Veg Main Course', 'https://images.unsplash.com/photo-1542362567-b03430c916be?q=80&w=2000', false, 'Spicy', 25, 4.6, 95, 'seed_admin', 'seed_admin'),
('p27', 'Fish Amritsari Curry', 'Crispy fried river fish steak cooked in tangy mustard and carom seed gravy.', 460, 420, 'Non-Veg Main Course', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=2000', false, 'Medium', 20, 4.5, 72, 'seed_admin', 'seed_admin'),
('p28', 'Mughlai Chicken Korma', 'Rich rich chicken curry cooked with cashews, poppy seeds, and rose water essence.', 440, 399, 'Non-Veg Main Course', 'https://images.unsplash.com/photo-1603894584100-345376a9170a?q=80&w=2000', false, 'Mild', 25, 4.7, 84, 'seed_admin', 'seed_admin'),
('p29', 'Kerala Pepper Prawn Fry', 'Juicy king prawns sauteed with crushed black pepper, curry leaves, and coconut oil.', 580, 530, 'Non-Veg Main Course', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=2000', false, 'Spicy', 20, 4.9, 110, 'seed_admin', 'seed_admin'),

-- 3. PIZZA (10 ITEMS)
('p11', 'Truffle Mushroom Pizza', 'Hand-stretched sourdough topped with wild mushrooms, truffle oil, and aged parmesan.', 490, 440, 'Pizza', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2000', true, 'Mild', 20, 4.8, 145, 'seed_admin', 'seed_admin'),
('p12', 'Smokehouse BBQ Chicken Pizza', 'Grilled chicken, red onions, and cilantro on a tangy BBQ sauce base with smoked gouda.', 450, 399, 'Pizza', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=2000', false, 'Medium', 20, 4.7, 165, 'seed_admin', 'seed_admin'),
('p30', 'Margherita Supreme Pizza', 'Classic San Marzano tomato sauce, fresh mozzarella fior di latte, and sweet basil.', 380, 340, 'Pizza', 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=2000', true, 'Mild', 15, 4.9, 280, 'seed_admin', 'seed_admin'),
('p31', 'Farmhouse Veggie Feast', 'Loaded with crisp bell peppers, sweet corn, black olives, onions, and jalapenos.', 420, 370, 'Pizza', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=2000', true, 'Medium', 20, 4.6, 120, 'seed_admin', 'seed_admin'),
('p32', 'Fiery Pepperoni Blast', 'Double layer of spicy Italian pepperoni with crushed red pepper flakes and mozzarella.', 520, 470, 'Pizza', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=2000', false, 'Spicy', 20, 4.8, 195, 'seed_admin', 'seed_admin'),
('p33', 'Paneer Makhani Fusion Pizza', 'Tandoori paneer cubes, makhani gravy drizzle, laccha onions, and green chilies.', 440, 399, 'Pizza', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2000', true, 'Medium', 20, 4.7, 130, 'seed_admin', 'seed_admin'),
('p34', 'Quattro Formaggi 4-Cheese', 'Gorgonzola, mozzarella, parmesan, and ricotta cheese blend with a honey drizzle.', 540, 490, 'Pizza', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=2000', true, 'Mild', 20, 4.8, 92, 'seed_admin', 'seed_admin'),
('p35', 'Spicy Chicken Peri Peri', 'Peri-peri marinated chicken tenders, flame-roasted red peppers, and spicy garlic drizzle.', 470, 420, 'Pizza', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=2000', false, 'Spicy', 20, 4.7, 115, 'seed_admin', 'seed_admin'),
('p36', 'Pesto Sundried Tomato Pizza', 'House-made basil pesto base, sun-dried tomatoes, pine nuts, and fresh goat cheese.', 480, 430, 'Pizza', 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=2000', true, 'Mild', 20, 4.6, 68, 'seed_admin', 'seed_admin'),
('p37', 'Ultimate Meat Lovers', 'Pepperoni, smoked bacon, spicy sausage, and pulled chicken on a thick crust.', 590, 540, 'Pizza', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=2000', false, 'Spicy', 25, 4.9, 175, 'seed_admin', 'seed_admin'),

-- 4. BURGERS (10 ITEMS)
('p13', 'The Wagyu Beast Burger', 'Premium Wagyu beef patty, caramelized onions, smoked cheddar, and signature aioli.', 380, 340, 'Burgers', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=2000', false, 'Medium', 15, 4.9, 210, 'seed_admin', 'seed_admin'),
('p14', 'Paneer Tikka Fusion Burger', 'Spiced grilled paneer slab, mint chutney, and laccha onion in a toasted brioche bun.', 290, 250, 'Burgers', 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=2000', true, 'Medium', 15, 4.6, 140, 'seed_admin', 'seed_admin'),
('p38', 'Classic Double Cheeseburger', 'Two smashed beef patties, melted American cheese, dill pickles, and house burger sauce.', 340, 299, 'Burgers', 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=2000', false, 'Mild', 15, 4.8, 185, 'seed_admin', 'seed_admin'),
('p39', 'Crispy Buttermilk Chicken', 'Fried chicken breast dipped in spicy oil, creamy slaw, and habanero mayo.', 320, 280, 'Burgers', 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?q=80&w=2000', false, 'Spicy', 15, 4.7, 160, 'seed_admin', 'seed_admin'),
('p40', 'Mushroom Swiss Truffle', 'Juicy patty layered with sautéed wild mushrooms, Swiss cheese, and truffle mayo.', 360, 320, 'Burgers', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=2000', false, 'Mild', 15, 4.8, 98, 'seed_admin', 'seed_admin'),
('p41', 'Smoky Jalapeno Veggie Burger', 'Black bean and quinoa patty, smoked gouda, pickled jalapenos, and chipotle cream.', 280, 240, 'Burgers', 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=2000', true, 'Spicy', 15, 4.5, 75, 'seed_admin', 'seed_admin'),
('p42', 'Spicy Lamb Crunch Burger', 'Spiced minced lamb patty, crispy onions, feta cheese crumble, and tzatziki.', 390, 350, 'Burgers', 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=2000', false, 'Spicy', 20, 4.7, 110, 'seed_admin', 'seed_admin'),
('p43', 'BBQ Bacon Cheddar Burger', 'Smoked bacon strips, sharp cheddar cheese, crispy onion rings, and hickory BBQ sauce.', 370, 330, 'Burgers', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=2000', false, 'Medium', 15, 4.8, 145, 'seed_admin', 'seed_admin'),
('p44', 'Avocado Spicy Bean Veggie', 'Avocado mash, spiced chickpea patty, heirloom tomatoes, and vegan garlic aioli.', 300, 260, 'Burgers', 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=2000', true, 'Medium', 15, 4.6, 62, 'seed_admin', 'seed_admin'),
('p45', 'Teriyaki Glazed Chicken', 'Grilled chicken thigh glazed in sweet teriyaki, grilled pineapple ring, and sesame slaw.', 330, 290, 'Burgers', 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?q=80&w=2000', false, 'Mild', 15, 4.7, 88, 'seed_admin', 'seed_admin'),

-- 5. DESSERTS (10 ITEMS)
('p15', 'Belgian Choco Lava Cake', 'Warm, gooey chocolate cake with a molten center, served with vanilla bean gelato.', 220, 190, 'Desserts', 'https://images.unsplash.com/photo-1563805042-7684c849a13e?q=80&w=2000', true, 'Mild', 10, 4.9, 340, 'seed_admin', 'seed_admin'),
('p16', 'Italian Tiramisu Classico', 'Espresso-soaked ladyfingers layered with creamy mascarpone and cocoa dust.', 310, 270, 'Desserts', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=2000', true, 'Mild', 10, 4.8, 170, 'seed_admin', 'seed_admin'),
('p17', 'Royal Kulfi Falooda', 'Traditional slow-churned Indian ice cream served with vermicelli, rose syrup, and nuts.', 190, 160, 'Desserts', 'https://images.unsplash.com/photo-1579954115545-a95591f28bee?q=80&w=2000', true, 'Mild', 10, 4.7, 210, 'seed_admin', 'seed_admin'),
('p46', 'Warm Gulab Jamun with Rabri', 'Golden fried milk dumplings soaked in cardamom syrup, served with thick saffron rabri.', 180, 150, 'Desserts', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=2000', true, 'Mild', 10, 4.9, 290, 'seed_admin', 'seed_admin'),
('p47', 'New York Baked Cheesecake', 'Classic dense creamy cheesecake on a graham cracker crust with berry compote.', 340, 299, 'Desserts', 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=2000', true, 'Mild', 10, 4.8, 140, 'seed_admin', 'seed_admin'),
('p48', 'Rasmalai Tres Leches', 'Spongy cottage cheese patties soaked in saffron milk, served as a cake slice.', 280, 240, 'Desserts', 'https://images.unsplash.com/photo-1579954115545-a95591f28bee?q=80&w=2000', true, 'Mild', 10, 4.8, 125, 'seed_admin', 'seed_admin'),
('p49', 'Saffron Phirni Matka', 'Traditional ground rice pudding flavored with cardamom, saffron, and silver leaf in clay pot.', 160, 130, 'Desserts', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=2000', true, 'Mild', 10, 4.7, 95, 'seed_admin', 'seed_admin'),
('p50', 'Molten Nutella Pancake Stack', 'Fluffy buttermilk pancakes layered with warm Nutella spread and caramelized bananas.', 260, 220, 'Desserts', 'https://images.unsplash.com/photo-1563805042-7684c849a13e?q=80&w=2000', true, 'Mild', 15, 4.8, 160, 'seed_admin', 'seed_admin'),
('p51', 'Crispy Churros & Dark Choco', 'Spanish fried pastry dusted with cinnamon sugar, served with warm 70% dark chocolate dip.', 240, 200, 'Desserts', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=2000', true, 'Mild', 10, 4.6, 115, 'seed_admin', 'seed_admin'),
('p52', 'Alphonso Mango Mousse', 'Light and airy fresh mango mousse topped with white chocolate curls.', 210, 180, 'Desserts', 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=2000', true, 'Mild', 10, 4.7, 85, 'seed_admin', 'seed_admin'),

-- 6. DRINKS (10 ITEMS)
('p18', 'Fresh Mint Mojito', 'Refreshingly cool blend of fresh mint, lime, cane sugar, and sparkling water.', 180, 150, 'Drinks', 'https://images.unsplash.com/photo-1513558161293-cdaf765898b5?q=80&w=2000', true, 'Mild', 5, 4.8, 250, 'seed_admin', 'seed_admin'),
('p19', 'Zesty Mango Lassi', 'Creamy yogurt drink blended with handpicked Alphonso mangoes and dry fruits.', 160, 130, 'Drinks', 'https://images.unsplash.com/photo-1571006682862-39c8ed740173?q=80&w=2000', true, 'Mild', 5, 4.9, 310, 'seed_admin', 'seed_admin'),
('p53', 'Iced Caramel Macchiato', 'Freshly pulled espresso shots layered with cold milk and sweet caramel drizzle.', 210, 180, 'Drinks', 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=2000', true, 'Mild', 5, 4.8, 140, 'seed_admin', 'seed_admin'),
('p54', 'Strawberry Basil Lemonade', 'Muddled fresh strawberries, basil leaves, freshly squeezed lemon juice, and soda.', 190, 160, 'Drinks', 'https://images.unsplash.com/photo-1513558161293-cdaf765898b5?q=80&w=2000', true, 'Mild', 5, 4.7, 105, 'seed_admin', 'seed_admin'),
('p55', 'Artisanal Kulhad Masala Chai', 'Slow brewed Indian black tea infused with ginger, cardamom, cloves, and whole milk.', 90, 75, 'Drinks', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=2000', true, 'Mild', 5, 4.9, 410, 'seed_admin', 'seed_admin'),
('p56', 'Virgin Blue Lagoon Mocktail', 'Blue Curacao syrup, fresh lemon juice, mint sprigs, and lemon-lime soda over crushed ice.', 170, 140, 'Drinks', 'https://images.unsplash.com/photo-1513558161293-cdaf765898b5?q=80&w=2000', true, 'Mild', 5, 4.6, 90, 'seed_admin', 'seed_admin'),
('p57', 'Cold Brew Hazelnut Shake', '12-hour steep cold brew coffee blended with hazelnut syrup and vanilla ice cream.', 230, 199, 'Drinks', 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=2000', true, 'Mild', 5, 4.8, 165, 'seed_admin', 'seed_admin'),
('p58', 'Peach Sparkling Iced Tea', 'Brewed Earl Grey tea infused with sweet peach puree and sparkling mineral water.', 180, 150, 'Drinks', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=2000', true, 'Mild', 5, 4.7, 80, 'seed_admin', 'seed_admin'),
('p59', 'Fresh Watermelon Mint Cooler', 'Cold pressed fresh watermelon juice with a splash of lime and pink salt.', 150, 120, 'Drinks', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=2000', true, 'Mild', 5, 4.8, 135, 'seed_admin', 'seed_admin'),
('p60', 'Kesar Badam Thandai', 'Traditional cooling milk beverage packed with almonds, pistachios, melon seeds, and saffron.', 220, 185, 'Drinks', 'https://images.unsplash.com/photo-1571006682862-39c8ed740173?q=80&w=2000', true, 'Mild', 5, 4.9, 190, 'seed_admin', 'seed_admin')
ON CONFLICT (product_id) DO NOTHING;

-- Insert Promo Coupons
INSERT INTO coupons (coupon_id, code, description, discount_percent, min_order_amount, max_discount, usage_limit, times_used, is_active, created_by, updated_by) VALUES
('c1', 'WELCOME20', '20% off on your first order above ₹200', 20, 200, 150, 500, 42, true, 'seed_admin', 'seed_admin'),
('c2', 'AMRIT10', '10% instant discount on all items', 10, 100, 100, 1000, 180, true, 'seed_admin', 'seed_admin'),
('c3', 'FEAST50', '15% mega feast discount on orders over ₹500', 15, 500, 200, 250, 35, true, 'seed_admin', 'seed_admin')
ON CONFLICT (code) DO NOTHING;
