import supabase from '../config/supabaseClient.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configure Email Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
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

// 2. Create Teacher (Auto-Gen & Email)
export const createTeacher = async (req, res, next) => {
  try {
    const { full_name, email, teacher_id, rfid_uid } = req.body;

    if (!full_name || !email || !teacher_id) {
      return res.status(400).json({ error: 'Full Name, Email, and Teacher ID are required' });
    }

    // Auto-Generate Credentials
    const username = teacher_id; // Use ID as username
    const plainPassword = generatePassword();
    const password_hash = await bcrypt.hash(plainPassword, 10);

    // Save to Database
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

    // Send Email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to Smart Attendance - Your Credentials',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #4F46E5; text-align: center;">Faculty Account Created</h2>
          <p>Hello <strong>${full_name}</strong>,</p>
          <p>Your account for the Smart Attendance System has been successfully created.</p>
          
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Username:</strong> ${username}</p>
            <p style="margin: 5px 0;"><strong>Password:</strong> ${plainPassword}</p>
          </div>
          
          <p>Please log in and change your password as soon as possible.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px; text-align: center;">This is an automated message. Please do not reply.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Teacher created and email sent', teacher: data });
  } catch (error) { 
    console.error("Error:", error);
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