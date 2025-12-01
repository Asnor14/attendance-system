import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { teachersAPI } from '../api/teachers';
import { MdAdd, MdEdit, MdDelete, MdPerson, MdBadge, MdEmail, MdSchool } from 'react-icons/md';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    teacher_id: '',
    rfid_uid: ''
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const data = await teachersAPI.getAll();
      setTeachers(data);
    } catch (error) {
      console.error('Failed to fetch teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTeacher) {
        await teachersAPI.update(editingTeacher.id, formData);
        await Swal.fire({
          icon: 'success',
          title: 'Updated',
          text: 'Teacher updated successfully!',
          background: '#FFE7D0',
          color: '#1B1B1B',
          confirmButtonColor: '#FC6E20',
          cancelButtonColor: '#323232',
        });
      } else {
        // Create and capture response (contains credentials)
        const response = await teachersAPI.create(formData);
        
        // Check if email failed
        const { username, password, emailStatus } = response.credentials;
        let title = 'Teacher Added';
        let htmlMsg = 'Credentials have been sent to their email.';
        let icon = 'success';

        if (emailStatus === 'failed') {
          title = '⚠️ Email Failed';
          icon = 'warning';
          htmlMsg = `<span style="color:#ef4444">The server could not send the email.</span><br/>Please copy these credentials manually:`;
        }

        await Swal.fire({
          icon: icon,
          title: title,
          html: `
            ${htmlMsg}
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-top: 10px; text-align: left; border: 1px solid #ccc;">
              <p style="margin: 5px 0"><strong>Username:</strong> ${username}</p>
              <p style="margin: 5px 0"><strong>Password:</strong> <span style="color: #FC6E20; font-weight:bold">${password}</span></p>
            </div>
            <p style="font-size: 12px; color: #666; margin-top: 10px;">* Save this now! You won't see it again. *</p>
          `,
          background: '#FFE7D0',
          color: '#1B1B1B',
          confirmButtonColor: '#FC6E20',
          confirmButtonText: 'I have copied it'
        });
      }
      fetchTeachers();
      setShowModal(false);
      resetForm();
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: error.response?.data?.error || 'Failed to save teacher',
        background: '#FFE7D0',
        color: '#1B1B1B',
        confirmButtonColor: '#FC6E20',
        cancelButtonColor: '#323232',
      });
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      full_name: teacher.full_name,
      email: teacher.email || '',
      teacher_id: teacher.username, 
      rfid_uid: teacher.rfid_uid || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete teacher?',
      text: 'Are you sure? This cannot be undone.',
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
      await teachersAPI.delete(id);
      fetchTeachers();
      await Swal.fire({
        icon: 'success',
        title: 'Deleted',
        background: '#FFE7D0',
        color: '#1B1B1B',
        confirmButtonColor: '#FC6E20'
      });
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: error.response?.data?.error,
        background: '#FFE7D0',
        color: '#1B1B1B',
        confirmButtonColor: '#FC6E20'
      });
    }
  };

  const resetForm = () => {
    setFormData({ full_name: '', email: '', teacher_id: '', rfid_uid: '' });
    setEditingTeacher(null);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
    </div>
  );

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark">Faculty Management</h1>
          <p className="text-brand-charcoal/70 text-sm mt-1">Manage teacher accounts and assignments</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 bg-brand-orange text-white px-4 py-2 rounded-lg font-semibold shadow-lg shadow-brand-orange/30 hover:bg-brand-orange/90 transition-colors"
        >
          <MdAdd size={24} /> Add Teacher
        </button>
      </div>

      {teachers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm border-2 border-dashed border-brand-orange/30">
          <div className="p-4 bg-brand-beige rounded-full mb-4">
            <MdSchool className="text-4xl text-brand-orange" />
          </div>
          <h3 className="text-lg font-semibold text-brand-dark">No faculty members yet</h3>
          <button onClick={() => { resetForm(); setShowModal(true); }} className="text-brand-orange font-semibold hover:underline">Add New Teacher</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {teachers.map((t) => (
            <motion.div
              key={t.id}
              className="bg-white p-6 rounded-2xl shadow-md border border-brand-orange/20"
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-brand-beige text-brand-orange rounded-full">
                  <MdPerson size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-brand-dark">{t.full_name}</h3>
                  <p className="text-sm text-brand-charcoal/70">ID: {t.username}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-brand-charcoal mb-6">
                <div className="flex items-center gap-2">
                  <MdEmail className="text-brand-charcoal/60" />
                  <span className="truncate" title={t.email}>{t.email || 'No email'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MdBadge className="text-brand-charcoal/60" />
                  <span>{t.rfid_uid || 'No RFID Assigned'}</span>
                </div>
              </div>
              <div className="flex gap-2 pt-4 border-t border-brand-beige">
                <button onClick={() => handleEdit(t)} className="flex-1 py-2 text-brand-dark bg-brand-beige hover:bg-brand-orange/10 rounded-lg text-sm font-semibold transition-colors">Edit</button>
                <button onClick={() => handleDelete(t.id)} className="flex-1 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-semibold transition-colors">Delete</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <motion.div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="bg-brand-dark px-6 py-4">
              <h2 className="text-xl font-bold text-brand-beige">{editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div><label className="text-sm font-bold text-brand-charcoal">Full Name</label><input required className="w-full p-3 border rounded-lg bg-white text-brand-dark" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} /></div>
              <div><label className="text-sm font-bold text-brand-charcoal">Email</label><input type="email" required className="w-full p-3 border rounded-lg bg-white text-brand-dark" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
              <div><label className="text-sm font-bold text-brand-charcoal">Teacher ID</label><input required className="w-full p-3 border rounded-lg font-mono bg-white text-brand-dark" value={formData.teacher_id} onChange={e => setFormData({...formData, teacher_id: e.target.value})} disabled={!!editingTeacher} /></div>
              <div><label className="text-sm font-bold text-brand-charcoal">RFID UID (Optional)</label><input className="w-full p-3 border rounded-lg font-mono bg-white text-brand-dark" value={formData.rfid_uid} onChange={e => setFormData({...formData, rfid_uid: e.target.value})} /></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 bg-brand-beige text-brand-charcoal rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-brand-orange text-white rounded-lg font-bold">{editingTeacher ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Teachers;
