import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

export const register = async (req, res, next) => {
  const { name, email, password, role } = req.body || {};

  if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string'
    || !name.trim() || !email.trim() || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  try {
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const user = await User.create({ name, email, password, role });
    res.status(201).json({ token: generateToken(user._id) });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    if (err.name === 'ValidationError') {
      err.statusCode = 400;
    }
    next(err);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body || {};

  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({ token: generateToken(user._id) });
  } catch (err) {
    next(err);
  }
};

export const getProfile = (req, res) => {
  res.json(req.user);
};
