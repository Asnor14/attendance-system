import { useState, useRef } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/auth';
import { supabase } from '../supabaseClient'; 
import { MdCameraAlt, MdSave, MdPerson, MdEmail, MdLock, MdBadge } from 'react-icons/md';
const Profile = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.avatar_url || null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      await Swal.fire({
        icon: 'warning',
        title: 'Password mismatch',
        text: 'Passwords do not match!',
        background: '#FFE7D0',
        color: '#1B1B1B',
        confirmButtonColor: '#FC6E20',
        cancelButtonColor: '#323232',
      });
      return;
    }

    setLoading(true);
    try {
      let avatarUrl = user?.avatar_url;

      // 1. Upload new Avatar if selected
      if (avatarFile) {
        const fileName = `${user.username}_${Date.now()}`;
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatarFile);
        
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
        avatarUrl = data.publicUrl;
      }

      // 2. Update Backend
      const payload = {
        full_name: formData.full_name,
        email: formData.email,
        avatar_url: avatarUrl,
      };
      if (formData.password) payload.password = formData.password;

      const response = await authAPI.updateProfile(payload);
      
      // 3. Update Local State
      updateUser(response.user);
      await Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your profile changes have been saved.',
        background: '#FFE7D0',
        color: '#1B1B1B',
        confirmButtonColor: '#FC6E20',
        cancelButtonColor: '#323232',
      });
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));

    } catch (error) {
      console.error(error);
      await Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Failed to update profile.',
        background: '#FFE7D0',
        color: '#1B1B1B',
        confirmButtonColor: '#FC6E20',
        cancelButtonColor: '#323232',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-brand-dark">My Profile</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-brand-orange/20 overflow-hidden">
        
        {/* Header / Avatar Section */}
        <div className="bg-brand-dark px-8 py-10 text-center relative">
          <div className="relative inline-block group">
            <div className="w-32 h-32 rounded-full border-4 border-brand-beige bg-brand-orange overflow-hidden shadow-lg mx-auto">
              {previewUrl ? (
                <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-5xl font-bold">
                  {user?.full_name?.charAt(0) || user?.username?.charAt(0)}
                </div>
              )}
            </div>
            <button 
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-0 right-0 bg-white text-brand-orange p-2 rounded-full shadow-md hover:bg-brand-beige transition-colors"
            >
              <MdCameraAlt size={20} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
          </div>
          <h2 className="text-brand-beige text-xl font-bold mt-4">{user?.full_name}</h2>
          <p className="text-brand-beige/70 text-sm font-mono">@{user?.username}</p>
        </div>

        {/* Form Fields */}
        <div className="p-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-charcoal flex items-center gap-2"><MdPerson /> Full Name</label>
              <input 
                className="w-full p-3 bg-white border border-brand-charcoal/20 rounded-lg outline-none focus:ring-2 focus:ring-brand-orange"
                value={formData.full_name}
                onChange={e => setFormData({...formData, full_name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-charcoal flex items-center gap-2"><MdEmail /> Email</label>
              <input 
                className="w-full p-3 bg-white border border-brand-charcoal/20 rounded-lg outline-none focus:ring-2 focus:ring-brand-orange"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
             <label className="text-sm font-bold text-brand-charcoal flex items-center gap-2"><MdBadge /> Role</label>
             <input disabled className="w-full p-3 bg-brand-beige border border-brand-charcoal/20 rounded-lg text-brand-charcoal capitalize" value={user?.role} />
          </div>

          <div className="border-t border-brand-beige pt-6 mt-6">
            <h3 className="text-lg font-bold text-brand-dark mb-4">Change Password</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-brand-charcoal flex items-center gap-2"><MdLock /> New Password</label>
                <input 
                  type="password"
                  className="w-full p-3 bg-white border border-brand-charcoal/20 rounded-lg outline-none focus:ring-2 focus:ring-brand-orange"
                  placeholder="Leave blank to keep current"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-brand-charcoal flex items-center gap-2"><MdLock /> Confirm Password</label>
                <input 
                  type="password"
                  className="w-full p-3 bg-white border border-brand-charcoal/20 rounded-lg outline-none focus:ring-2 focus:ring-brand-orange"
                  placeholder="Re-type new password"
                  value={formData.confirmPassword}
                  onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-brand-orange text-white rounded-xl font-bold hover:bg-brand-orange/90 transition-colors shadow-lg shadow-brand-orange/30 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div> : <><MdSave size={20} /> Save Changes</>}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
};

export default Profile;