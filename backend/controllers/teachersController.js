import supabase from '../config/supabaseClient.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configure Email Transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Explicitly state the host
  port: 587,              // Use SSL Port (often allowed when 587 is blocked)
  secure: false,           // Must be true for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper: Generate Random Password
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

// 2. Create Teacher Account
export const createTeacher = async (req, res, next) => {
  try {
    const { full_name, email, teacher_id, rfid_uid } = req.body;

    if (!full_name || !email || !teacher_id) {
      return res.status(400).json({ error: 'Full Name, Email, and Teacher ID are required' });
    }

    // 1. Auto-Generate Credentials
    const username = teacher_id;
    const plainPassword = generatePassword(); // We need to send this back to frontend
    const password_hash = await bcrypt.hash(plainPassword, 10);

    // 2. Save to Database
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

    // 3. Try to Send Email (But don't crash if it fails)
    let emailStatus = 'sent';
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to Smart Attendance - Your Credentials',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Faculty Account Created</h2>
            <p>Username: <strong>${username}</strong></p>
            <p>Password: <strong>${plainPassword}</strong></p>
          </div>
        `
      };
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("⚠️ Email failed to send:", emailError);
      emailStatus = 'failed';
    }

    // 4. Return Success + PASSWORD (Critical Backup)
    res.status(201).json({ 
      message: 'Teacher created successfully', 
      teacher: data,
      credentials: {
        username,
        password: plainPassword, // Send this back so Admin can see it
        emailStatus
      }
    });

  } catch (error) { 
    next(error); 
  }
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

// 4. Delete Teacher (Safely)
export const deleteTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Step 1: Unassign this teacher from all schedules
    // We set 'teacher_id' to NULL for any schedule they are teaching
    const { error: unassignError } = await supabase
      .from('schedules')
      .update({ teacher_id: null })
      .eq('teacher_id', id);

    if (unassignError) throw unassignError;

    // Step 2: Now it is safe to delete the teacher
    const { error } = await supabase
      .from('admins')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) { next(error); }
};
