const prisma = require('./client');

async function main() {
  const products = [
    // Veg Main Course
    {
      name: 'Paneer Tikka Masala',
      description: 'Charcoal grilled cottage cheese in a rich tomato and butter gravy with secret spices.',
      price: 320,
      category: 'Veg Main Course',
      imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=2000'
    },
    {
      name: 'Hyderabadi Veg Biryani',
      description: 'Slow-cooked basmati rice with seasonal vegetables, aromatic saffron, and exotic spices.',
      price: 280,
      category: 'Veg Main Course',
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?q=80&w=2000'
    },
    {
      name: 'Dal Makhani Artisan',
      description: 'Overnight slow-cooked black lentils, tempered with cream, butter, and smoked chilies.',
      price: 240,
      category: 'Veg Main Course',
      imageUrl: 'https://images.unsplash.com/photo-1585933334452-f1f034091986?q=80&w=2000'
    },
    {
      name: 'Shahi Malai Kofta',
      description: 'Velvety cottage cheese dumplings stuffed with nuts, served in a luscious white saffron gravy.',
      price: 350,
      category: 'Veg Main Course',
      imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=2000'
    },
    {
      name: 'Amritsari Chole Bhature',
      description: 'Traditional spiced chickpeas served with two oversized fluffy fried leavened breads.',
      price: 220,
      category: 'Veg Main Course',
      imageUrl: 'https://images.unsplash.com/photo-1626132646529-5006375325d7?q=80&w=2000'
    },
    {
      name: 'Tandoori Garlic Naan',
      description: 'Hand-stretched leavened bread with roasted garlic and fresh parsley, baked in clay oven.',
      price: 90,
      category: 'Veg Main Course',
      imageUrl: 'https://images.unsplash.com/photo-1601050694117-62d44aa04af4?q=80&w=2000'
    },

    // Non-Veg Main Course
    {
      name: 'Classic Butter Chicken',
      description: 'The legendary Moti Mahal style chicken in a luscious, velvety tomato cream gravy.',
      price: 450,
      category: 'Non-Veg Main Course',
      imageUrl: 'https://images.unsplash.com/photo-1603894584100-345376a9170a?q=80&w=2000'
    },
    {
      name: 'Kashmiri Mutton Rogan Josh',
      description: 'Tender mutton cooked in traditional Kashmiri style with yogurt and aromatic cloves.',
      price: 520,
      category: 'Non-Veg Main Course',
      imageUrl: 'https://images.unsplash.com/photo-1542362567-b03430c916be?q=80&w=2000'
    },
    {
      name: 'Old Delhi Chicken Tikka Masala',
      description: 'Smoked chicken tikka tossed in a spicy onion-tomato masala with fresh coriander.',
      price: 420,
      category: 'Non-Veg Main Course',
      imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=2000'
    },
    {
      name: 'Atlantic Grilled Salmon',
      description: 'Herbed fresh salmon fillet, pan-seared and served with roasted garlic butter.',
      price: 680,
      category: 'Non-Veg Main Course',
      imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=2000'
    },
    {
      name: 'Coastal Prawn Curry',
      description: 'Juicy prawns simmered in a coconut milk-based gravy with curry leaves and tamarind.',
      price: 580,
      category: 'Non-Veg Main Course',
      imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=2000'
    },
    {
      name: 'Smoked Chicken Tikka (6pcs)',
      description: 'Spiced yogurt-marinated chicken chunks, grilled to perfection over natural charcoal.',
      price: 360,
      category: 'Non-Veg Main Course',
      imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=2000'
    },

    // Pizza
    {
      name: 'Truffle Mushroom Pizza',
      description: 'Hand-stretched sourdough topped with wild mushrooms, truffle oil, and aged parmesan.',
      price: 490,
      category: 'Pizza',
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2000'
    },
    {
      name: 'Quattro Formaggi Artisan',
      description: 'A blend of Mozzarella, Gorgonzola, Parmesan, and Fontina on a garlic butter crust.',
      price: 460,
      category: 'Pizza',
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?q=80&w=2000'
    },
    {
      name: 'Smokehouse BBQ Chicken Pizza',
      description: 'Grilled chicken, red onions, and cilantro on a tangy BBQ sauce base with smoked gouda.',
      price: 450,
      category: 'Pizza',
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=2000'
    },
    {
      name: 'Garden Pesto & Sun-dried Tomato',
      description: 'Fresh basil pesto base, cherry tomatoes, kalamata olives, and baby spinach.',
      price: 390,
      category: 'Pizza',
      imageUrl: 'https://images.unsplash.com/photo-1593504049359-74330189a3be?q=80&w=2000'
    },
    {
      name: 'Fiery Pepperoni Burst',
      description: 'Spicy Italian pepperoni, fresh mozzarella, and hot honey on a crispy base.',
      price: 420,
      category: 'Pizza',
      imageUrl: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=2000'
    },
    {
      name: 'Mediterranean Veggie Delight',
      description: 'Roasted bell peppers, sun-dried tomatoes, artichokes, and feta cheese on a thin crust.',
      price: 410,
      category: 'Pizza',
      imageUrl: 'https://images.unsplash.com/photo-1528137871391-5fdfaba2b91d?q=80&w=2000'
    },
    {
      name: 'Tropical Hawaiian Fusion',
      description: 'Sweet pineapple chunks, smoked ham, and mozzarella with a spicy jalapeño kick.',
      price: 395,
      category: 'Pizza',
      imageUrl: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?q=80&w=2000'
    },

    // Burgers
    {
      name: 'The Wagyu Beast',
      description: 'Premium Wagyu beef patty, caramelized onions, smoked cheddar, and signature aioli.',
      price: 380,
      category: 'Burgers',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=2000'
    },
    {
      name: 'Paneer Tikka Fusion Burger',
      description: 'Spiced grilled paneer slab, mint chutney, and laccha onion in a toasted brioche bun.',
      price: 290,
      category: 'Burgers',
      imageUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=2000'
    },
    {
      name: 'Gourmet Lamb & Rosemary Burger',
      description: 'Juicy lamb patty infused with fresh rosemary, topped with feta cheese and harissa mayo.',
      price: 420,
      category: 'Burgers',
      imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5c1457add?q=80&w=2000'
    },
    {
      name: 'Classic Double Smash Burger',
      description: 'Two thin beef patties, American cheese, pickles, and our secret burger sauce.',
      price: 330,
      category: 'Burgers',
      imageUrl: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?q=80&w=2000'
    },
    {
      name: 'Crispy Falafel Burger',
      description: 'Homemade spiced falafel patty, hummus, pickled cabbage, and tahini dressing.',
      price: 270,
      category: 'Burgers',
      imageUrl: 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?q=80&w=2000'
    },
    {
      name: 'Buffalo Spicy Chicken Burger',
      description: 'Crispy chicken breast tossed in hot buffalo sauce with blue cheese dressing.',
      price: 340,
      category: 'Burgers',
      imageUrl: 'https://images.unsplash.com/photo-1610440042657-6dd2c4b89152?q=80&w=2000'
    },
    {
      name: 'Crispy Zinger Delight',
      description: 'Golden fried spicy chicken breast, iceberg lettuce, and zesty mayo on brioche.',
      price: 310,
      category: 'Burgers',
      imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=2000'
    },

    // Desserts
    {
      name: 'Belgian Choco Lava',
      description: 'Warm, gooey chocolate cake with a molten center, served with vanilla bean gelato.',
      price: 220,
      category: 'Desserts',
      imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c849a13e?q=80&w=2000'
    },
    {
      name: 'Italian Tiramisu Classico',
      description: 'Espresso-soaked ladyfingers layered with creamy mascarpone and cocoa dust.',
      price: 310,
      category: 'Desserts',
      imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=2000'
    },
    {
      name: 'Double Chocolate Walnut Brownie',
      description: 'Fudgy chocolate brownie with toasted walnuts, served warm with vanilla ice cream.',
      price: 240,
      category: 'Desserts',
      imageUrl: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=2000'
    },
    {
      name: 'Artisan Mango Cheesecake',
      description: 'New York style cheesecake topped with freshly pureed Alphonso mangoes and mint.',
      price: 280,
      category: 'Desserts',
      imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=2000'
    },
    {
      name: 'Royal Kulfi Falooda',
      description: 'Traditional slow-churned Indian ice cream served with vermicelli, rose syrup, and nuts.',
      price: 190,
      category: 'Desserts',
      imageUrl: 'https://images.unsplash.com/photo-1579954115545-a95591f28bee?q=80&w=2000'
    },
    {
      name: 'Classic Carrot Cake',
      description: 'Moist spiced carrot cake with toasted pecans and a smooth cream cheese frosting.',
      price: 260,
      category: 'Desserts',
      imageUrl: 'https://images.unsplash.com/photo-1607354201815-998877e8a1d7?q=80&w=2000'
    },
    {
      name: 'Kesari Gulab Jamun',
      description: 'Deep-fried milk dumplings soaked in saffron and cardamom scented rose syrup.',
      price: 150,
      category: 'Desserts',
      imageUrl: 'https://images.unsplash.com/photo-1605060050493-594a206a4b3d?q=80&w=2000'
    },
    {
      name: 'Hot Gulab Jamun with Vanilla',
      description: 'Two hot gulab jamuns served with a scoop of premium vanilla bean ice cream.',
      price: 180,
      category: 'Desserts',
      imageUrl: 'https://images.unsplash.com/photo-1591261738599-13da05e830e2?q=80&w=2000'
    },

    // Drinks
    {
      name: 'Fresh Mint Mojito',
      description: 'Refreshingly cool blend of fresh mint, lime, cane sugar, and sparkling water.',
      price: 180,
      category: 'Drinks',
      imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765898b5?q=80&w=2000'
    },
    {
      name: 'Zesty Mango Lassi',
      description: 'Creamy yogurt drink blended with handpicked Alphonso mangoes and dry fruits.',
      price: 160,
      category: 'Drinks',
      imageUrl: 'https://images.unsplash.com/photo-1571006682862-39c8ed740173?q=80&w=2000'
    }
  ];

  console.log('Clearing existing data (cascading)...');
  
  // High-performance cleanup in correct order to avoid FK violations
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.product.deleteMany({});
  
  console.log(`Seeding ${products.length} premium menu items...`);
  
  for (const product of products) {
    await prisma.product.create({
      data: product
    });
  }

  console.log('Successfully completed Artisan menu synchronization!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
