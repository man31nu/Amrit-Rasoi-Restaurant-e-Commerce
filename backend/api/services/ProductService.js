/**
 * ProductService
 *
 * @description :: Business logic service for food menu products
 */

const ProductModel = require('../models/ProductModel');
const ReviewModel = require('../models/ReviewModel');

module.exports = {
  getProducts: async (filters) => {
    return await ProductModel.getProducts(filters);
  },

  getProductById: async (productId) => {
    const product = await ProductModel.getProductById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const reviews = await ReviewModel.getReviewsByProductId(productId);
    product.reviews = reviews;
    return product;
  },

  createProduct: async (productData) => {
    if (!productData.imageUrl) {
      throw new Error('Please upload an image');
    }
    return await ProductModel.createProduct(productData);
  },

  updateProduct: async (productId, payload) => {
    const existing = await ProductModel.getProductById(productId);
    if (!existing) {
      throw new Error('Product not found');
    }

    const { name, description, price, discountPrice, category, imageUrl, isVeg, spiceLevel, preparationTime, isAvailable, tags, updatedBy } = payload;

    const updatedName = name || existing.name;
    const updatedDesc = description || existing.description;
    const updatedPrice = price ? parseFloat(price) : existing.price;
    const updatedDiscountPrice = discountPrice !== undefined ? parseFloat(discountPrice) : existing.discountPrice;
    const updatedCat = category || existing.category;
    const updatedImage = imageUrl || existing.imageUrl;
    const updatedVeg = isVeg !== undefined ? (isVeg === 'true' || isVeg === true) : existing.isVeg;
    const updatedSpice = spiceLevel || existing.spiceLevel;
    const updatedPrepTime = preparationTime ? parseInt(preparationTime) : existing.preparationTime;
    const updatedAvailable = isAvailable !== undefined ? (isAvailable === 'true' || isAvailable === true) : existing.isAvailable;
    const updatedTags = tags ? (typeof tags === 'string' ? tags : JSON.stringify(tags)) : existing.tags;

    return await ProductModel.updateProduct(productId, {
      name: updatedName,
      description: updatedDesc,
      price: updatedPrice,
      discountPrice: updatedDiscountPrice,
      category: updatedCat,
      imageUrl: updatedImage,
      isVeg: updatedVeg,
      spiceLevel: updatedSpice,
      preparationTime: updatedPrepTime,
      isAvailable: updatedAvailable,
      tags: updatedTags,
      updatedBy
    });
  },

  deleteProduct: async (productId) => {
    const deleted = await ProductModel.deleteProduct(productId);
    if (!deleted) {
      throw new Error('Product not found');
    }
    return true;
  }
};
