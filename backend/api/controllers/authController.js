/**
 * AuthController
 *
 * @description :: Server-side logic for authentication, user profiles & user management
 */

const AuthService = require('../services/AuthService');

module.exports = {

  registerUser: async function (req, res) {
    try {
      const user = await AuthService.registerUser(req.body);
      return res.status(201).send({
        status: 201,
        success: true,
        message: 'User registered successfully',
        data: user
      });
    } catch (e) {
      console.error('@AuthController registerUser err:', e);
      return res.status(400).send({ status: 400, success: false, message: e.message });
    }
  },

  authUser: async function (req, res) {
    try {
      const user = await AuthService.authUser(req.body);
      return res.send({
        status: 200,
        success: true,
        message: 'Login successful',
        data: user
      });
    } catch (e) {
      console.error('@AuthController authUser err:', e);
      return res.status(401).send({ status: 401, success: false, message: e.message });
    }
  },

  googleLogin: async function (req, res) {
    try {
      const user = await AuthService.googleLogin(req.body);
      return res.send({
        status: 200,
        success: true,
        message: 'Google login successful',
        data: user
      });
    } catch (e) {
      console.error('@AuthController googleLogin err:', e);
      return res.status(401).send({ status: 401, success: false, message: e.message });
    }
  },

  getUsers: async function (req, res) {
    try {
      const users = await AuthService.getUsers();
      return res.send({
        status: 200,
        success: true,
        message: 'success',
        data: users
      });
    } catch (e) {
      console.error('@AuthController getUsers err:', e);
      return res.status(400).send({ status: 400, success: false, message: e.message });
    }
  },

  updateUserRole: async function (req, res) {
    try {
      const { role } = req.body;
      const updatedBy = req.user ? req.user.email || req.user.id : 'admin';
      const updatedUser = await AuthService.updateUserRole({ userId: req.params.id, role, updatedBy });

      return res.send({
        status: 200,
        success: true,
        message: 'User role updated',
        data: updatedUser
      });
    } catch (e) {
      console.error('@AuthController updateUserRole err:', e);
      return res.status(400).send({ status: 400, success: false, message: e.message });
    }
  },

  getProfile: async function (req, res) {
    try {
      const user = await AuthService.getProfile(req.user.id);
      return res.send({
        status: 200,
        success: true,
        message: 'success',
        data: user
      });
    } catch (e) {
      console.error('@AuthController getProfile err:', e);
      return res.status(404).send({ status: 404, success: false, message: e.message });
    }
  },

  updateProfile: async function (req, res) {
    try {
      const updatedBy = req.user ? req.user.email || req.user.id : req.user.id;
      const updatedUser = await AuthService.updateProfile(req.user.id, { ...req.body, updatedBy });

      return res.send({
        status: 200,
        success: true,
        message: 'Profile updated successfully',
        data: updatedUser
      });
    } catch (e) {
      console.error('@AuthController updateProfile err:', e);
      return res.status(400).send({ status: 400, success: false, message: e.message });
    }
  }
};
