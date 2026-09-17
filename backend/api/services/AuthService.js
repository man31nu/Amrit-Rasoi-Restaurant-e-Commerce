/**
 * AuthService
 *
 * @description :: Business logic service for authentication & user profiles
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const UserModel = require('../models/UserModel');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  registerUser: async (payload) => {
    const { name, email, password, phone, address, city, pincode } = payload;

    if (!email || !password || !name) {
      throw new Error('Name, email, and password are required');
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingUser = await UserModel.findByEmail(cleanEmail);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await UserModel.createUser({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      phone,
      address,
      city,
      pincode,
      createdBy: 'self_register'
    });

    delete user.password;

    return {
      ...user,
      token: generateToken(user.id)
    };
  },

  authUser: async (payload) => {
    const { email, password } = payload;

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await UserModel.findByEmail(cleanEmail);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    await UserModel.updateLastLogin(user.id);
    delete user.password;

    return {
      ...user,
      token: generateToken(user.id)
    };
  },

  googleLogin: async (payload) => {
    const { idToken, credential } = payload;
    const tokenToVerify = idToken || credential;

    if (!tokenToVerify) {
      throw new Error('Google ID Token is required');
    }

    let ticketPayload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: tokenToVerify,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      ticketPayload = ticket.getPayload();
    } catch (error) {
      throw new Error('Invalid Google ID Token');
    }

    if (!ticketPayload || !ticketPayload.email) {
      throw new Error('Invalid Google ID Token payload');
    }

    const { email, name, picture } = ticketPayload;
    let user = await UserModel.findByEmail(email);

    if (user) {
      await UserModel.updateLastLogin(user.id);
    } else {
      const randomPassword = crypto.randomBytes(16).toString('hex');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      user = await UserModel.createGoogleUser({
        name: name || 'Google User',
        email,
        password: hashedPassword,
        avatarUrl: picture || null,
        createdBy: 'google_oauth'
      });
    }

    return {
      ...user,
      token: generateToken(user.id)
    };
  },

  getUsers: async () => {
    return await UserModel.getAllUsers();
  },

  updateUserRole: async (payload) => {
    const { userId, role, updatedBy } = payload;
    if (role !== 'customer' && role !== 'admin' && role !== 'user') {
      throw new Error('Invalid role');
    }

    const updatedUser = await UserModel.updateUserRole(userId, role, updatedBy);
    if (!updatedUser) {
      throw new Error('User not found');
    }
    return updatedUser;
  },

  getProfile: async (userId) => {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },

  updateProfile: async (userId, payload) => {
    const { name, email, phone, address, city, pincode, avatarUrl, password, updatedBy } = payload;

    let hashedPassword = null;
    if (password && password.trim()) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password.trim(), salt);
    }

    const updatedUser = await UserModel.updateProfile(userId, {
      name,
      email,
      phone,
      address,
      city,
      pincode,
      avatarUrl,
      password: hashedPassword,
      updatedBy
    });

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
  }
};
