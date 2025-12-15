// controllers/authController.js
import bcrypt from 'bcryptjs';
// const bcrypt = require('bcryptjs');
import { PrismaClient } from '@prisma/client';
// const { PrismaClient } = require('@prisma/client');
// const { generateToken } = require('../../utils/jwt');
import { generateToken } from '../../utils/jwt.js';
import jwt from 'jsonwebtoken';
import { ExtractJwt } from 'passport-jwt';

const prisma = new PrismaClient();

export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    // res.send({ fullName, email, password: hashedPassword });

    const user = await prisma.user.create({
      data: { fullName, email, passwordHash: hashedPassword }
    });
    const accessToken=generateToken(user)
    res.status(200).json({data: { message: "User registered", user, accessToken }});
    // res.json({ message: "User registered", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid password" });

    const token = generateToken(user);
    res.status(200).json({data: { token }});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const googleCallback = (req, res) => {
  const token = generateToken(req.user);
  res.status(200).json({data: { token }});
};

export const protectedRoute = (req, res) => {
  res.status(200).json({data: { message: "You are authenticated", user: req.user }});
};

export const logout = async (req, res) => {
  try {
    // Extract token from request
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    
    if (token) {
      // Decode token to get expiration
      const decoded = jwt.decode(token);
      const expiresAt = new Date(decoded.exp * 1000); // JWT exp is in seconds
      
      // Add token to blacklist (ignore if already exists)
      await prisma.tokenBlacklist.upsert({
        where: { token },
        update: { expiresAt },
        create: { token, expiresAt }
      });
    }
    
    res.status(200).json({data: { message: "Logged out successfully" }});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Optional: Cleanup expired blacklisted tokens
export const cleanupExpiredTokens = async () => {
  try {
    await prisma.tokenBlacklist.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
  } catch (err) {
    console.error('Error cleaning up expired tokens:', err);
  }
};