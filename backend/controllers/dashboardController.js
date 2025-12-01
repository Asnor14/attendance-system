import supabase from '../config/supabaseClient.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const { count: students } = await supabase.from('students').select('*', { count: 'exact', head: true });
    const { count: kiosks } = await supabase.from('devices').select('*', { count: 'exact', head: true }).eq('device_type', 'kiosk');
    const { count: schedules } = await supabase.from('schedules').select('*', { count: 'exact', head: true });
    const { count: pending } = await supabase.from('pending_registrations').select('*', { count: 'exact', head: true }).eq('status', 'pending');

    res.json({
      totalStudents: students || 0,
      totalKiosks: kiosks || 0,
      totalSchedules: schedules || 0,
      pendingRegistrations: pending || 0
    });
  } catch (error) { next(error); }
};