import supabase from '../config/supabaseClient.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generatePassword = (length = 10) => {
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

// 2. Create Admin (Strict Security)
export const createAdmin = async (req, res, next) => {
  try {
    const { full_name, email, username, current_password } = req.body;
    const initiatorId = req.user.id; // ID of the admin making the request

    // A. Validate
    if (!full_name || !email || !username || !current_password) {
      return res.status(400).json({ error: 'All fields and YOUR password are required' });
    }

    // B. Verify Initiator's Password
    const { data: initiator, error: fetchError } = await supabase
      .from('admins')
      .select('password_hash')
      .eq('id', initiatorId)
      .single();

    if (fetchError || !initiator) return res.status(401).json({ error: 'Authorization failed' });

    const isMatch = await bcrypt.compare(current_password, initiator.password_hash);
    if (!isMatch) return res.status(403).json({ error: 'Incorrect password. Access denied.' });

    // C. Generate New Admin Credentials
    const newPlainPassword = generatePassword();
    const newPasswordHash = await bcrypt.hash(newPlainPassword, 10);

    // D. Create Account
    const { data: newAdmin, error: createError } = await supabase
      .from('admins')
      .insert([{
        username,
        password_hash: newPasswordHash,
        full_name,
        email,
        role: 'admin'
      }])
      .select()
      .single();

    if (createError) throw createError;

    // E. Send Email
    let emailStatus = 'sent';
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Admin Access Granted',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #FC6E20;">Admin Access Granted</h2>
            <p>Hello <strong>${full_name}</strong>,</p>
            <p>You are now an Administrator.</p>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Username:</strong> ${username}</p>
              <p><strong>Password:</strong> ${newPlainPassword}</p>
            </div>
          </div>
        `
      });
    } catch (err) {
      console.error("Email failed:", err);
      emailStatus = 'failed';
    }

    // F. Return Credentials (Backup)
    res.status(201).json({ 
      message: 'Admin created successfully', 
      admin: newAdmin,
      credentials: {
        username,
        password: newPlainPassword,
        emailStatus
      }
    });

  } catch (error) { next(error); }
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
