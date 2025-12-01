import supabase from '../config/supabaseClient.js';

// 1. Get All Students
export const getAllStudents = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) { next(error); }
};

// 2. Get Student by ID (This was the missing one!)
export const getStudentById = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) return res.status(404).json({ error: 'Student not found' });
    res.json(data);
  } catch (error) { next(error); }
};

// 3. Create Student
export const createStudent = async (req, res, next) => {
  try {
    const { full_name, student_id, course, rfid_uid, face_image_url } = req.body;
    
    const { data, error } = await supabase
      .from('students')
      .insert([{ full_name, student_id, course, rfid_uid, face_image_url }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) { next(error); }
};

// 4. Update Student
export const updateStudent = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) { next(error); }
};

// 5. Delete Student
export const deleteStudent = async (req, res, next) => {
  try {
    const { error } = await supabase.from('students').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Student deleted successfully' });
  } catch (error) { next(error); }
};

// 6. Sync Students (For Kiosk)
export const syncStudents = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('id, full_name, student_id, rfid_uid, face_image_url');
    
    if (error) throw error;
    res.json(data);
  } catch (error) { next(error); }
};