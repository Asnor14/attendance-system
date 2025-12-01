import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { schedulesAPI } from '../api/schedules';
import { teachersAPI } from '../api/teachers'; // 👈 Import Teachers API
import { useAuth } from '../context/AuthContext'; // 👈 Import Auth
import { MdAdd, MdEdit, MdDelete, MdSchedule, MdPerson } from 'react-icons/md';

const daysOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const Schedules = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [schedules, setSchedules] = useState([]);
  const [teachers, setTeachers] = useState([]); // List for dropdown
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  
  const [formData, setFormData] = useState({
    subject_code: '', subject_name: '', time_start: '', time_end: '', 
    grace_period: 0, days: [], teacher_id: '' // Added teacher_id
  });

  useEffect(() => {
    fetchSchedules();
    if (isAdmin) fetchTeachers(); // Only admins need the teacher list
  }, []);

  const fetchSchedules = async () => {
    try {
      const data = await schedulesAPI.getAll();
      setSchedules(data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const fetchTeachers = async () => {
    try {
      const data = await teachersAPI.getAll();
      setTeachers(data);
    } catch (e) { console.error(e); }
  };

  const handleDayToggle = (day) => {
    setFormData(prev => {
      const currentDays = prev.days || [];
      if (currentDays.includes(day)) return { ...prev, days: currentDays.filter(d => d !== day) };
      else return { ...prev, days: [...currentDays, day] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, days: formData.days.join(',') };
    try {
      if (editingSchedule) await schedulesAPI.update(editingSchedule.id, payload);
      else await schedulesAPI.create(payload);
      fetchSchedules(); setShowModal(false); resetForm();
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: 'Failed to save schedule',
        background: '#FFE7D0',
        color: '#1B1B1B',
        confirmButtonColor: '#FC6E20',
        cancelButtonColor: '#323232',
      });
    }
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      ...schedule,
      days: schedule.days ? schedule.days.split(',') : [],
      teacher_id: schedule.teacher_id || '' // Load existing teacher
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete schedule?',
      text: 'Are you sure you want to delete this schedule?',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      background: '#FFE7D0',
      color: '#1B1B1B',
      confirmButtonColor: '#FC6E20',
      cancelButtonColor: '#323232',
    });
    if (!result.isConfirmed) return;
    try {
      await schedulesAPI.delete(id);
      fetchSchedules();
      await Swal.fire({
        icon: 'success',
        title: 'Deleted',
        text: 'Schedule has been removed.',
        background: '#FFE7D0',
        color: '#1B1B1B',
        confirmButtonColor: '#FC6E20',
        cancelButtonColor: '#323232',
      });
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: 'Failed to delete schedule',
        background: '#FFE7D0',
        color: '#1B1B1B',
        confirmButtonColor: '#FC6E20',
        cancelButtonColor: '#323232',
      });
    }
  };

  const resetForm = () => {
    setFormData({ subject_code: '', subject_name: '', time_start: '', time_end: '', grace_period: 0, days: [], teacher_id: '' });
    setEditingSchedule(null);
  };

  if (loading) return <div className="flex justify-center p-10">Loading...</div>;

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-brand-dark">
          {isAdmin ? 'Class Schedules' : 'My Classes'}
        </h1>
        
        {/* Only Admins can ADD schedules */}
        {isAdmin && (
          <button onClick={() => { resetForm(); setShowModal(true); }} className="flex items-center gap-2 bg-brand-orange text-white px-4 py-2 rounded-lg font-semibold shadow-lg shadow-brand-orange/30 hover:bg-brand-orange/90 transition-colors">
            <MdAdd size={20} /> Add Schedule
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-brand-orange/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-brand-charcoal text-brand-beige">
            <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold tracking-wide uppercase">Subject</th>
                <th className="px-6 py-4 text-left text-sm font-semibold tracking-wide uppercase">Days</th>
                <th className="px-6 py-4 text-left text-sm font-semibold tracking-wide uppercase">Time</th>
                {isAdmin && <th className="px-6 py-4 text-left text-sm font-semibold tracking-wide uppercase">Assigned Teacher</th>}
                {isAdmin && <th className="px-6 py-4 text-left text-sm font-semibold tracking-wide uppercase">Actions</th>}
            </tr>
            </thead>
            <tbody className="divide-y divide-brand-beige/80">
                {schedules.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-brand-charcoal/60">No schedules found.</td>
                </tr>
              ) : (
                schedules.map((s) => (
                  <tr key={s.id} className="hover:bg-brand-beige/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-brand-dark">{s.subject_code}</div>
                      <div className="text-sm text-brand-charcoal/70">{s.subject_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 flex-wrap">
                        {s.days ? s.days.split(',').map(d => (
                          <span key={d} className="px-3 py-1 bg-brand-orange/10 text-brand-orange text-xs rounded-full font-bold">
                            {d}
                          </span>
                        )) : <span className="text-brand-charcoal/50 text-xs">No days</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-brand-charcoal flex items-center gap-2">
                      <MdSchedule className="text-brand-orange" /> {s.time_start} - {s.time_end}
                    </td>
                    
                    {/* Show Teacher Name (Admin View) */}
                    {isAdmin && (
                      <td className="px-6 py-4">
                        {s.teacher_name ? (
                          <span className="flex items-center gap-1 text-sm text-brand-dark bg-brand-beige px-3 py-1 rounded-full w-fit border border-brand-orange/30">
                            <MdPerson className="text-brand-charcoal" /> {s.teacher_name}
                          </span>
                        ) : <span className="text-xs text-red-500 italic">Unassigned</span>}
                      </td>
                    )}

                    {/* Actions (Admin Only) */}
                    {isAdmin && (
                      <td className="px-6 py-4 flex gap-2">
                        <button onClick={() => handleEdit(s)} className="text-brand-dark p-2 rounded-lg hover:bg-brand-beige transition-colors" title="Edit schedule"><MdEdit size={20}/></button>
                        <button onClick={() => handleDelete(s.id)} className="text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors" title="Delete schedule"><MdDelete size={20}/></button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL (Admin Only) */}
      {showModal && isAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className="bg-brand-dark px-6 py-4">
              <h2 className="text-xl font-bold text-brand-beige">{editingSchedule ? 'Edit Schedule' : 'New Schedule'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-brand-charcoal mb-1">Subject Code</label>
                  <input className="w-full p-2 border border-brand-charcoal/20 rounded focus:ring-2 focus:ring-brand-orange outline-none bg-white text-brand-dark" value={formData.subject_code} onChange={e => setFormData({...formData, subject_code: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-charcoal mb-1">Subject Name</label>
                  <input className="w-full p-2 border border-brand-charcoal/20 rounded focus:ring-2 focus:ring-brand-orange outline-none bg-white text-brand-dark" value={formData.subject_name} onChange={e => setFormData({...formData, subject_name: e.target.value})} required />
                </div>
              </div>
              
              {/* Teacher Assignment Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-brand-charcoal mb-1">Assign Teacher</label>
                <select 
                  className="w-full p-2 border border-brand-charcoal/20 rounded bg-white focus:ring-2 focus:ring-brand-orange outline-none text-brand-dark"
                  value={formData.teacher_id}
                  onChange={e => setFormData({...formData, teacher_id: e.target.value})}
                >
                  <option value="">-- Unassigned --</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.full_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-charcoal mb-2">Class Days</label>
                <div className="flex gap-2 flex-wrap">
                  {daysOptions.map(day => (
                    <button
                      key={day} type="button"
                      onClick={() => handleDayToggle(day)}
                      className={`px-3 py-1 rounded text-sm font-bold border transition-colors ${
                        formData.days.includes(day) ? 'bg-brand-orange text-white border-brand-orange' : 'bg-white text-brand-charcoal border-brand-charcoal/20 hover:bg-brand-beige'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-brand-charcoal mb-1">Start Time</label>
                  <input type="time" className="w-full p-2 border border-brand-charcoal/20 rounded bg-white text-brand-dark" value={formData.time_start} onChange={e => setFormData({...formData, time_start: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-charcoal mb-1">End Time</label>
                  <input type="time" className="w-full p-2 border border-brand-charcoal/20 rounded bg-white text-brand-dark" value={formData.time_end} onChange={e => setFormData({...formData, time_end: e.target.value})} required />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-brand-charcoal mb-1">Grace Period (Minutes)</label>
                <input type="number" className="w-full p-2 border border-brand-charcoal/20 rounded bg-white text-brand-dark" value={formData.grace_period} onChange={e => setFormData({...formData, grace_period: e.target.value})} />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 bg-brand-beige text-brand-charcoal rounded font-medium hover:bg-brand-charcoal/10">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-brand-orange text-white rounded font-semibold hover:bg-brand-orange/90 shadow-lg shadow-brand-orange/30">Save Schedule</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Schedules;