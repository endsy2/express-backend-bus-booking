// controllers/authController.js
import bcrypt from 'bcryptjs';
// const bcrypt = require('bcryptjs');
import { PrismaClient } from '@prisma/client';
// const { PrismaClient } = require('@prisma/client');
// const { generateToken } = require('../../utils/jwt');
import { generateToken } from '../../utils/jwt.js';

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