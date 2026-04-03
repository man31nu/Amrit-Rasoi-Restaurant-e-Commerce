const asyncHandler = require('express-async-handler');
const prisma = require('../prisma/client');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  let cart = await prisma.cart.findUnique({
    where: { userId: req.user.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  // If no cart exists, create one
  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  res.json(cart);
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  let cart = await prisma.cart.findUnique({
    where: { userId: req.user.id },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: req.user.id },
    });
  }

  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId: productId,
    },
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + (quantity || 1) },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity: quantity || 1,
      },
    });
  }

  const updatedCart = await prisma.cart.findUnique({
    where: { id: cart.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  res.json(updatedCart);
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { itemId } = req.params;

  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true },
  });

  if (!item || item.cart.userId !== req.user.id) {
    res.status(404);
    throw new Error('Cart item not found');
  }

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
  } else {
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  const updatedCart = await prisma.cart.findUnique({
    where: { id: item.cartId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  res.json(updatedCart);
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true },
  });

  if (!item || item.cart.userId !== req.user.id) {
    res.status(404);
    throw new Error('Cart item not found');
  }

  await prisma.cartItem.delete({ where: { id: itemId } });

  const updatedCart = await prisma.cart.findUnique({
    where: { id: item.cartId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  res.json(updatedCart);
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
};
