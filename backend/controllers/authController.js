import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import supabase from '../config/supabaseClient.js';

// --- Login Function (Fixes initial login) ---
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // 1. Get user and explicitly select avatar_url
    const { data: user, error } = await supabase
      .from('admins')
      .select('id, username, password_hash, role, full_name, avatar_url') 
      .eq('username', username)
      .single();

    if (error || !user) return res.status(401).json({ error: 'Invalid credentials' });

    const validPass = await bcrypt.compare(password, user.password_hash);
    if (!validPass) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        full_name: user.full_name,
        avatar_url: user.avatar_url // <-- NOW INCLUDED
      }
    });
  } catch (error) { next(error); }
};

// --- Verify Token Function (Fixes page refresh) ---
export const verifyToken = async (req, res) => {
  try {
    const { id } = req.user; // ID from JWT payload

    // 1. Fetch the full profile again, including avatar_url
    const { data: user, error } = await supabase
      .from('admins')
      .select('id, username, role, full_name, email, avatar_url') // <-- ADDED avatar_url here
      .eq('id', id)
      .single();

    if (error || !user) return res.status(401).json({ error: 'User not found' });

    res.json({ user });
  } catch (error) { next(error); }
};

// --- Update Profile Function (Ensures correct data is returned after update) ---
export const updateProfile = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { full_name, email, password, avatar_url } = req.body;

    const updates = { full_name, email };
    if (avatar_url) updates.avatar_url = avatar_url;

    if (password) {
      const saltRounds = 10;
      updates.password_hash = await bcrypt.hash(password, saltRounds);
    }

    const { data: updatedUser, error } = await supabase
      .from('admins')
      .update(updates)
      .eq('id', id)
      .select('id, username, role, full_name, email, avatar_url') // <-- ENSURES AVATAR_URL IS RETURNED
      .single();

    if (error) throw error;

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) { next(error); }
};