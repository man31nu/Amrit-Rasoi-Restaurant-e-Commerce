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
    const currentUser = await UserModel.findById(userId);
    if (!currentUser) {
      throw new Error('User not found');
    }

    const { name, email, phone, address, city, pincode, avatarUrl, password, updatedBy } = payload;

    const updatedName = name || currentUser.name;
    const updatedEmail = email || currentUser.email;
    const updatedPhone = phone !== undefined ? phone : currentUser.phone;
    const updatedAddress = address !== undefined ? address : currentUser.address;
    const updatedCity = city !== undefined ? city : currentUser.city;
    const updatedPincode = pincode !== undefined ? pincode : currentUser.pincode;
    const updatedAvatarUrl = avatarUrl !== undefined ? avatarUrl : currentUser.avatarUrl;
    
    let updatedPass = currentUser.password;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedPass = await bcrypt.hash(password, salt);
    }

    return await UserModel.updateProfile(userId, {
      name: updatedName,
      email: updatedEmail,
      phone: updatedPhone,
      address: updatedAddress,
      city: updatedCity,
      pincode: updatedPincode,
      avatarUrl: updatedAvatarUrl,
      password: updatedPass,
      updatedBy
    });
  }
};
