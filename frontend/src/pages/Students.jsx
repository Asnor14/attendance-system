import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { studentsAPI } from '../api/students';
import { MdAdd, MdEdit, MdDelete, MdPerson } from 'react-icons/md';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    student_id: '',
    course: '',
    rfid_uid: '',
    face_image_url: '',
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await studentsAPI.getAll();
      setStudents(data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await studentsAPI.update(editingStudent.id, formData);
      } else {
        await studentsAPI.create(formData);
      }
      fetchStudents();
      setShowModal(false);
      resetForm();
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: error.response?.data?.error || 'Failed to save student',
        background: '#FFE7D0',
        color: '#1B1B1B',
        confirmButtonColor: '#FC6E20',
        cancelButtonColor: '#323232',
      });
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      full_name: student.full_name,
      student_id: student.student_id,
      course: student.course,
      rfid_uid: student.rfid_uid || '',
      face_image_url: student.face_image_url || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete student?',
      text: 'Are you sure you want to delete this student?',
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
      await studentsAPI.delete(id);
      fetchStudents();
      await Swal.fire({
        icon: 'success',
        title: 'Deleted',
        text: 'Student has been removed.',
        background: '#FFE7D0',
        color: '#1B1B1B',
        confirmButtonColor: '#FC6E20',
        cancelButtonColor: '#323232',
      });
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: error.response?.data?.error || 'Failed to delete student',
        background: '#FFE7D0',
        color: '#1B1B1B',
        confirmButtonColor: '#FC6E20',
        cancelButtonColor: '#323232',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      student_id: '',
      course: '',
      rfid_uid: '',
      face_image_url: '',
    });
    setEditingStudent(null);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64 text-brand-charcoal">Loading...</div>;
  }

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-brand-dark">Students</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center space-x-2 bg-brand-orange text-white px-4 py-2 rounded-lg font-semibold shadow-lg shadow-brand-orange/30 hover:bg-brand-orange/90 transition-colors"
        >
          <MdAdd className="text-xl" />
          <span>Add Student</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-brand-orange/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead className="bg-brand-charcoal text-brand-beige uppercase tracking-wide text-sm">
              <tr>
                <th className="px-6 py-4 text-left">Full Name</th>
                <th className="px-6 py-4 text-left">Student ID</th>
                <th className="px-6 py-4 text-left">Course</th>
                <th className="px-6 py-4 text-left">RFID UID</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-brand-charcoal/70">
                    No students found. Add your first student!
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="border-b border-brand-beige hover:bg-brand-beige/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <MdPerson className="text-brand-orange" />
                        <span className="font-medium text-brand-dark">{student.full_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-brand-charcoal/80">{student.student_id}</td>
                    <td className="px-6 py-4 text-brand-charcoal/80">{student.course}</td>
                    <td className="px-6 py-4">
                      {student.rfid_uid ? (
                        <span className="px-3 py-1 bg-brand-beige text-brand-dark rounded-full text-sm font-mono border border-brand-orange/30">
                          {student.rfid_uid}
                        </span>
                      ) : (
                        <span className="text-brand-charcoal/50">Not assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(student)}
                          className="p-2 text-brand-dark hover:bg-brand-beige rounded-lg transition-colors"
                        >
                          <MdEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto border border-brand-orange/20"
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <h2 className="text-2xl font-bold text-brand-dark mb-4">
              {editingStudent ? 'Edit Student' : 'Add Student'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-brand-charcoal mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-2 border border-brand-charcoal/20 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none bg-white text-brand-dark"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-charcoal mb-2">
                  Student ID
                </label>
                <input
                  type="text"
                  value={formData.student_id}
                  onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                  className="w-full px-4 py-2 border border-brand-charcoal/20 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none bg-white text-brand-dark"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-charcoal mb-2">
                  Course
                </label>
                <input
                  type="text"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full px-4 py-2 border border-brand-charcoal/20 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none bg-white text-brand-dark"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-charcoal mb-2">
                  RFID UID
                </label>
                <input
                  type="text"
                  value={formData.rfid_uid}
                  onChange={(e) => setFormData({ ...formData, rfid_uid: e.target.value })}
                  className="w-full px-4 py-2 border border-brand-charcoal/20 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none font-mono bg-white text-brand-dark"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-charcoal mb-2">
                  Face Image URL
                </label>
                <input
                  type="url"
                  value={formData.face_image_url}
                  onChange={(e) => setFormData({ ...formData, face_image_url: e.target.value })}
                  className="w-full px-4 py-2 border border-brand-charcoal/20 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none bg-white text-brand-dark"
                  placeholder="Optional"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-brand-orange text-white py-2 rounded-lg font-semibold hover:bg-brand-orange/90 transition-colors shadow-lg shadow-brand-orange/30"
                >
                  {editingStudent ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 bg-brand-beige text-brand-charcoal py-2 rounded-lg hover:bg-brand-charcoal/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Students;

