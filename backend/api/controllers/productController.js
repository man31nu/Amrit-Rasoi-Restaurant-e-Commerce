/**
 * ProductController
 *
 * @description :: Server-side logic for managing food menu products & catalog search
 */

const ProductService = require('../services/ProductService');

module.exports = {

  getProducts: async function (req, res) {
    try {
      const products = await ProductService.getProducts(req.query);
      return res.send({
        status: 200,
        success: true,
        message: 'success',
        count: products.length,
        data: products
      });
    } catch (e) {
      console.error('@ProductController getProducts err:', e);
      return res.status(400).send({ status: 400, success: false, message: e.message });
    }
  },

  getProductById: async function (req, res) {
    try {
      const product = await ProductService.getProductById(req.params.id);
      return res.send({
        status: 200,
        success: true,
        message: 'success',
        data: product
      });
    } catch (e) {
      console.error('@ProductController getProductById err:', e);
      return res.status(404).send({ status: 404, success: false, message: e.message });
    }
  },

  createProduct: async function (req, res) {
    try {
      const imageUrl = req.file ? req.file.path : req.body.imageUrl;
      const createdBy = req.user ? req.user.email || req.user.id : 'admin';

      const newProduct = await ProductService.createProduct({
        ...req.body,
        imageUrl,
        createdBy
      });

      return res.status(201).send({
        status: 201,
        success: true,
        message: 'Product created successfully',
        data: newProduct
      });
    } catch (e) {
      console.error('@ProductController createProduct err:', e);
      return res.status(400).send({ status: 400, success: false, message: e.message });
    }
  },

  updateProduct: async function (req, res) {
    try {
      const imageUrl = req.file ? req.file.path : req.body.imageUrl;
      const updatedBy = req.user ? req.user.email || req.user.id : 'admin';

      const updatedProduct = await ProductService.updateProduct(req.params.id, {
        ...req.body,
        imageUrl,
        updatedBy
      });

      return res.send({
        status: 200,
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct
      });
    } catch (e) {
      console.error('@ProductController updateProduct err:', e);
      return res.status(400).send({ status: 400, success: false, message: e.message });
    }
  },

  deleteProduct: async function (req, res) {
    try {
      await ProductService.deleteProduct(req.params.id);
      return res.send({
        status: 200,
        success: true,
        message: 'Product removed successfully'
      });
    } catch (e) {
      console.error('@ProductController deleteProduct err:', e);
      return res.status(400).send({ status: 400, success: false, message: e.message });
    }
  }
};
