import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { adminsAPI } from '../api/admins';
import { useAuth } from '../context/AuthContext';
import { MdAdd, MdDelete, MdPerson, MdEmail, MdSecurity, MdLock } from 'react-icons/md';

const Admins = () => {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    username: '',
    current_password: '' // Required for verification
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const data = await adminsAPI.getAll();
      setAdmins(data);
    } catch (error) {
      console.error('Failed to fetch admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Confirmation Alert before sending sensitive request
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Create Admin Access?',
      text: 'This will grant full system access. Confirm details?',
      showCancelButton: true,
      confirmButtonText: 'Yes, Create',
      cancelButtonText: 'Cancel',
      background: '#FFE7D0',
      color: '#1B1B1B',
      confirmButtonColor: '#FC6E20',
      cancelButtonColor: '#323232',
    });

    if (!result.isConfirmed) return;

    try {
      await adminsAPI.create(formData);
      
      await Swal.fire({
        icon: 'success',
        title: 'Admin Created',
        text: `Credentials sent to ${formData.email}`,
        background: '#FFE7D0',
        color: '#1B1B1B',
        confirmButtonColor: '#FC6E20'
      });
      
      fetchAdmins();
      setShowModal(false);
      setFormData({ full_name: '', email: '', username: '', current_password: '' });

    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: error.response?.data?.error || 'Operation failed',
        background: '#FFE7D0',
        color: '#1B1B1B',
        confirmButtonColor: '#FC6E20'
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Revoke Access?',
      text: 'This admin will lose access immediately.',
      showCancelButton: true,
      confirmButtonText: 'Yes, Revoke',
      background: '#FFE7D0',
      color: '#1B1B1B',
      confirmButtonColor: '#FC6E20',
    });

    if (!result.isConfirmed) return;

    try {
      await adminsAPI.delete(id);
      fetchAdmins();
      Swal.fire({ icon: 'success', title: 'Removed', background: '#FFE7D0', confirmButtonColor: '#FC6E20' });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.error, background: '#FFE7D0', confirmButtonColor: '#FC6E20' });
    }
  };

  if (loading) return <div className="flex justify-center p-10"><div className="animate-spin h-8 w-8 border-4 border-brand-orange rounded-full border-t-transparent"></div></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark">Admin Management</h1>
          <p className="text-brand-charcoal/70 text-sm mt-1">Manage system administrators</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-brand-orange text-white px-4 py-2 rounded-lg shadow-lg hover:bg-brand-orange/90 transition-all">
          <MdAdd size={24} /> Add Admin
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {admins.map((admin) => (
          <div key={admin.id} className="bg-white p-6 rounded-xl shadow-md border border-brand-orange/20 hover:shadow-lg transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-brand-charcoal text-brand-beige rounded-full">
                <MdSecurity size={24} />
              </div>
              <div>
                <h3 className="font-bold text-brand-dark">{admin.full_name}</h3>
                <p className="text-xs text-brand-charcoal/60 font-mono">@{admin.username}</p>
              </div>
            </div>
            
            <div className="text-sm text-brand-charcoal/80 mb-4 flex items-center gap-2">
              <MdEmail className="text-brand-orange" /> {admin.email}
            </div>

            {admin.id !== user?.id && (
              <button onClick={() => handleDelete(admin.id)} className="w-full py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <MdDelete /> Revoke Access
              </button>
            )}
            {admin.id === user?.id && (
              <div className="w-full py-2 text-center text-xs text-brand-charcoal/40 italic bg-brand-beige/20 rounded-lg">
                (You)
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="bg-brand-charcoal px-6 py-4">
              <h2 className="text-xl font-bold text-brand-beige">Grant Admin Access</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-brand-charcoal mb-1">Full Name</label>
                <input required className="w-full p-3 border border-brand-charcoal/20 rounded-lg bg-white" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} placeholder="e.g. Admin Name" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-brand-charcoal mb-1">Email Address</label>
                <input type="email" required className="w-full p-3 border border-brand-charcoal/20 rounded-lg bg-white" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="admin@school.edu" />
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-charcoal mb-1">Admin ID (Username)</label>
                <input required className="w-full p-3 border border-brand-charcoal/20 rounded-lg font-mono bg-white" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} placeholder="0000-0000" />
              </div>

              <div className="pt-4 mt-4 border-t border-brand-beige">
                <label className="block text-sm font-bold text-brand-orange mb-1 flex items-center gap-1">
                  <MdLock /> Confirm YOUR Password
                </label>
                <input type="password" required className="w-full p-3 border-2 border-brand-orange/50 rounded-lg bg-white focus:ring-2 focus:ring-brand-orange outline-none" value={formData.current_password} onChange={e => setFormData({...formData, current_password: e.target.value})} placeholder="Enter your password to authorize" />
                <p className="text-xs text-gray-400 mt-1">Required security step.</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 text-brand-charcoal bg-brand-beige hover:bg-brand-charcoal/10 rounded-xl font-medium">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-brand-orange text-white rounded-xl font-bold hover:bg-brand-orange/90 shadow-lg">Grant Access</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admins;