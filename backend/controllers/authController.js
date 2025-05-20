import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
  const { firstname, lastname, email, phone, password } = req.body;

  // Validate required fields
  const missingFields = [];
  if (!firstname) missingFields.push('firstname');
  if (!lastname) missingFields.push('lastname');
  if (!email) missingFields.push('email');
  if (!phone) missingFields.push('phone');
  if (!password) missingFields.push('password');

  if (missingFields.length > 0) {
    res.status(400).json({ 
      message: `Missing required field(s): ${missingFields.join(', ')}` 
    });
    return;
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstname,
      lastname,
      email,
      phone,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, phone, password } = req.body;

  // Validate input
  if ((!email && !phone) || !password) {
    return res.status(400).json({
      message: 'Either email or phone, and password are required.',
    });
  }

  try {
    // Normalize email to lowercase if provided
    const query = email ? { email: email.toLowerCase() } : { phone };
    const user = await User.findOne(query);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    if (!user.isApproved) {
      return res.status(403).json({ message: 'Account not approved by admin yet.' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'Your account is blocked by admin.' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

