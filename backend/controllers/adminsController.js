import supabase from '../config/supabaseClient.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configure Email
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Explicitly state the host
  port: 587,              // Use SSL Port (often allowed when 587 is blocked)
  secure: false,           // Must be true for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generatePassword = (length = 8) => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$";
  let retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};

// 1. Get All Admins
export const getAllAdmins = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('id, username, full_name, email, created_at')
      .eq('role', 'admin')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) { next(error); }
};

// 2. Create New Admin (With Password Verification)
export const createAdmin = async (req, res, next) => {
  try {
    const { full_name, email, username, current_password } = req.body;
    const currentAdminId = req.user.id; // From Token

    // A. Validate Input
    if (!full_name || !email || !username || !current_password) {
      return res.status(400).json({ error: 'All fields including your password are required' });
    }

    // B. Verify Current Admin's Password
    const { data: currentAdmin, error: fetchError } = await supabase
      .from('admins')
      .select('password_hash')
      .eq('id', currentAdminId)
      .single();

    if (fetchError || !currentAdmin) return res.status(401).json({ error: 'Authorization failed' });

    const isMatch = await bcrypt.compare(current_password, currentAdmin.password_hash);
    if (!isMatch) return res.status(403).json({ error: 'Incorrect password. Access denied.' });

    // C. Generate New Admin Credentials
    const newPlainPassword = generatePassword();
    const newPasswordHash = await bcrypt.hash(newPlainPassword, 10);

    // D. Create Account
    const { data: newAdmin, error: createError } = await supabase
      .from('admins')
      .insert([{
        username,          // "0000-0000" format
        password_hash: newPasswordHash,
        full_name,
        email,
        role: 'admin'      // Role is Admin
      }])
      .select()
      .single();

    if (createError) throw createError;

    // E. Send Email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Admin Access Granted - Smart Attendance System',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #FC6E20;">Admin Access Granted</h2>
          <p>Hello <strong>${full_name}</strong>,</p>
          <p>You have been granted Administrator privileges for the Smart Attendance System.</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Username:</strong> ${username}</p>
            <p style="margin: 5px 0;"><strong>Password:</strong> ${newPlainPassword}</p>
          </div>
          <p>Please login and change your password immediately for security.</p>
        </div>
      `
    });

    res.status(201).json({ message: 'Admin created and credentials sent!', admin: newAdmin });

  } catch (error) {
    console.error("Admin Create Error:", error);
    next(error);
  }
};

// 3. Delete Admin
export const deleteAdmin = async (req, res, next) => {
  try {
    // Prevent self-deletion
    if (req.params.id == req.user.id) {
      return res.status(400).json({ error: 'You cannot delete your own account.' });
    }

    const { error } = await supabase.from('admins').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Admin removed successfully' });
  } catch (error) { next(error); }
};
