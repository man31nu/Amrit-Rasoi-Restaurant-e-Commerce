const asyncHandler = require('express-async-handler');
const prisma = require('../prisma/client');

// @desc    Fetch all products with search and category filter
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const { search, category, sortBy, order, isVeg, spiceLevel } = req.query;

  const whereOptions = {};

  if (search) {
    whereOptions.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (category && category !== 'All') {
    whereOptions.category = category;
  }

  if (isVeg !== undefined && isVeg !== 'all') {
    whereOptions.isVeg = isVeg === 'true';
  }

  if (spiceLevel && spiceLevel !== 'all') {
    whereOptions.spiceLevel = spiceLevel;
  }

  // Handle sorting
  let orderBy = { createdAt: 'desc' }; // default
  
  if (sortBy === 'price') {
    orderBy = { price: order === 'desc' ? 'desc' : 'asc' };
  } else if (sortBy === 'newest') {
    orderBy = { createdAt: 'desc' };
  }

  const products = await prisma.product.findMany({
    where: whereOptions,
    orderBy: orderBy,
    include: {
      reviews: {
        select: {
          rating: true
        }
      }
    }
  });

  const formattedProducts = products.map((prod) => {
    const numReviews = prod.reviews.length;
    const avgRating = numReviews > 0
      ? Number((prod.reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews).toFixed(1))
      : 4.8; // default benchmark rating if none submitted yet
    const { reviews, ...rest } = prod;
    return {
      ...rest,
      numReviews,
      avgRating
    };
  });

  res.json(formattedProducts);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: {
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });

  if (product) {
    const numReviews = product.reviews.length;
    const avgRating = numReviews > 0
      ? Number((product.reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews).toFixed(1))
      : 4.8;
    res.json({
      ...product,
      numReviews,
      avgRating
    });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, isVeg, spiceLevel } = req.body;
  const imageUrl = req.file ? req.file.path : req.body.imageUrl;

  if (!imageUrl) {
    res.status(400);
    throw new Error('Please upload an image');
  }

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: parseFloat(price),
      category,
      imageUrl,
      isVeg: isVeg === 'true' || isVeg === true,
      spiceLevel: spiceLevel || 'Mild',
    },
  });

  res.status(201).json(product);
});

// @desc    Update a product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, imageUrl, isVeg, spiceLevel } = req.body;

  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
  });

  if (product) {
    const imageUrl = req.file ? req.file.path : req.body.imageUrl;

    const updatedProduct = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name: name || product.name,
        description: description || product.description,
        price: price ? parseFloat(price) : product.price,
        category: category || product.category,
        imageUrl: imageUrl || product.imageUrl,
        isVeg: isVeg !== undefined ? (isVeg === 'true' || isVeg === true) : product.isVeg,
        spiceLevel: spiceLevel || product.spiceLevel,
      },
    });

    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
  });

  if (product) {
    await prisma.product.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
