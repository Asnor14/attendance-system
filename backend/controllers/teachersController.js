import supabase from '../config/supabaseClient.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configure Email Transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
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

// 1. Get All Teachers
export const getAllTeachers = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('id, username, full_name, email, rfid_uid, created_at')
      .eq('role', 'teacher')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) { next(error); }
};

// 2. Create Teacher (Auto-Gen Password & Email)
export const createTeacher = async (req, res, next) => {
  try {
    const { full_name, email, teacher_id, rfid_uid } = req.body;

    if (!full_name || !email || !teacher_id) {
      return res.status(400).json({ error: 'Full Name, Email, and Teacher ID are required' });
    }

    // Auto-Generate Credentials
    const username = teacher_id;
    const plainPassword = generatePassword();
    const password_hash = await bcrypt.hash(plainPassword, 10);

    // Insert into DB
    const { data, error } = await supabase
      .from('admins')
      .insert([{ 
        username, 
        password_hash, 
        full_name, 
        email,
        rfid_uid, 
        role: 'teacher' 
      }])
      .select()
      .single();

    if (error) throw error;

    // Send Email (Fail-safe)
    let emailStatus = 'sent';
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Faculty Account Created',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #4F46E5;">Welcome Faculty</h2>
            <p>Hello <strong>${full_name}</strong>,</p>
            <p>Your account has been created.</p>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Username:</strong> ${username}</p>
              <p><strong>Password:</strong> ${plainPassword}</p>
            </div>
            <p>Please login and change your password immediately.</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error("Email failed:", emailError);
      emailStatus = 'failed';
    }

    // Return credentials so Admin can see them if email fails
    res.status(201).json({ 
      message: 'Teacher created successfully', 
      teacher: data,
      credentials: { username, password: plainPassword, emailStatus }
    });

  } catch (error) { next(error); }
};

// 3. Update Teacher
export const updateTeacher = async (req, res, next) => {
  try {
    const { full_name, email, rfid_uid, password } = req.body;
    const updates = { full_name, email, rfid_uid };

    if (password) {
      updates.password_hash = await bcrypt.hash(password, 10);
    }

    const { data, error } = await supabase
      .from('admins')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) { next(error); }
};

// 4. Delete Teacher (Safe Delete)
export const deleteTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Unassign from schedules first
    await supabase
      .from('schedules')
      .update({ teacher_id: null })
      .eq('teacher_id', id);

    // Delete account
    const { error } = await supabase.from('admins').delete().eq('id', id);
    if (error) throw error;

    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) { next(error); }
};
