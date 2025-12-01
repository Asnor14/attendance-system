import supabase from '../config/supabaseClient.js';

// 1. Get All Schedules (Filtered by Role)
export const getAllSchedules = async (req, res, next) => {
  try {
    // req.user comes from the authenticateToken middleware
    const { role, id } = req.user;

    // Build the query: Fetch schedules + Teacher Name
    let query = supabase
      .from('schedules')
      .select(`
        *,
        admins:teacher_id ( full_name )
      `)
      .order('time_start');

    // IF TEACHER: Only show THEIR subjects
    if (role === 'teacher') {
      query = query.eq('teacher_id', id);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Format data (Flatten the structure for easier frontend use)
    const formatted = data.map(s => ({
      ...s,
      teacher_name: s.admins?.full_name || 'Unassigned'
    }));

    res.json(formatted);
  } catch (error) { next(error); }
};

// 2. Sync Schedules (For Kiosk Download)
export const syncSchedules = async (req, res, next) => {
  try {
    // Select only the fields the Kiosk needs for validation
    const { data, error } = await supabase
      .from('schedules')
      .select('subject_code, time_start, time_end, days, grace_period');

    if (error) throw error;
    res.json(data);
  } catch (error) { next(error); }
};

// 3. Create Schedule
export const createSchedule = async (req, res, next) => {
  try {
    const { subject_code, subject_name, time_start, time_end, days, grace_period, teacher_id } = req.body;

    // Basic Validation
    if (!subject_code || !subject_name || !time_start || !time_end) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data, error } = await supabase
      .from('schedules')
      .insert([{
        subject_code,
        subject_name,
        time_start,
        time_end,
        days,
        grace_period: parseInt(grace_period) || 0,
        // Handle teacher_id: Convert empty string "" to null
        teacher_id: teacher_id && teacher_id !== '' ? teacher_id : null
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) { next(error); }
};

// 4. Update Schedule
export const updateSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { subject_code, subject_name, time_start, time_end, days, grace_period, teacher_id } = req.body;

    const { error } = await supabase
      .from('schedules')
      .update({
        subject_code,
        subject_name,
        time_start,
        time_end,
        days,
        grace_period: parseInt(grace_period) || 0,
        // Handle teacher_id: Convert empty string "" to null
        teacher_id: teacher_id && teacher_id !== '' ? teacher_id : null
      })
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) { next(error); }
};

// 5. Delete Schedule
export const deleteSchedule = async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) { next(error); }
};

// 6. Get Single Schedule (Optional Helper)
export const getScheduleById = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) return res.status(404).json({ error: "Schedule not found" });
    res.json(data);
  } catch (error) { next(error); }
};