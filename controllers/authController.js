import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Car from '../models/Car.js';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const register = async (req, res, next) => {
  try {
    const { username, email, password, phone } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ success: false, message: 'Username, email and password are required' });

    if (password.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ success: false, message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed, phone: phone || '' });

    // Create default car for the new user
    await Car.create({ userId: user._id });

    const token = signToken(user._id);
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: { id: user._id, username: user.username, email: user.email, phone: user.phone }
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const token = signToken(user._id);
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username, email: user.email, phone: user.phone }
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const { username, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username, phone },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, message: 'Profile updated', user });
  } catch (err) {
    next(err);
  }
};

export const deleteMe = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    await Car.findOneAndDelete({ userId: req.user.id });
    res.json({ success: true, message: 'Account deleted' });
  } catch (err) {
    next(err);
  }
};
