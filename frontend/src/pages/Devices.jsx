import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { devicesAPI } from '../api/devices';
import { 
  MdAdd, 
  MdEdit, 
  MdDelete, 
  MdDeviceHub, 
  MdWifi, 
  MdRefresh, 
  MdPersonAdd, 
  MdSignalWifi4Bar, 
  MdSignalWifiOff 
} from 'react-icons/md';

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [refreshingId, setRefreshingId] = useState(null);
  
  // Form State
  const [editingDevice, setEditingDevice] = useState(null);
  const [formData, setFormData] = useState({
    device_name: '',
    device_type: 'kiosk',
    status: 'offline',
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchDevices();
    // Auto-refresh list every 10 seconds to keep status live
    const interval = setInterval(fetchDevices, 10000); 
    return () => clearInterval(interval);
  }, []);

  const fetchDevices = async () => {
    try {
      const data = await devicesAPI.getAll();
      setDevices(data);
    } catch (error) {
      console.error('Failed to fetch devices:', error);
    } finally {
      setLoading(false);
    }
  };

  // Manual Refresh for a single card
  const handleRefresh = async (e, id) => {
    e.stopPropagation();
    setRefreshingId(id);
    await fetchDevices();
    setTimeout(() => setRefreshingId(null), 500); // Small visual delay
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDevice) {
        await devicesAPI.update(editingDevice.id, formData);
      } else {
        await devicesAPI.create(formData);
      }
      fetchDevices();
      setShowModal(false);
      resetForm();
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: error.response?.data?.error || 'Failed to save device',
        background: '#FFE7D0',
        color: '#1B1B1B',
        confirmButtonColor: '#FC6E20',
        cancelButtonColor: '#323232',
      });
    }
  };

  const handleEdit = (e, device) => {
    e.stopPropagation();
    setEditingDevice(device);
    setFormData({
      device_name: device.device_name,
      device_type: device.device_type,
      status: device.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete device?',
      text: 'Are you sure you want to delete this device?',
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
      await devicesAPI.delete(id);
      fetchDevices();
      await Swal.fire({
        icon: 'success',
        title: 'Deleted',
        text: 'Device has been removed.',
        background: '#FFE7D0',
        color: '#1B1B1B',
        confirmButtonColor: '#FC6E20',
        cancelButtonColor: '#323232',
      });
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: error.response?.data?.error || 'Failed to delete device',
        background: '#FFE7D0',
        color: '#1B1B1B',
        confirmButtonColor: '#FC6E20',
        cancelButtonColor: '#323232',
      });
    }
  };

  const handleRegisterClick = (e, deviceId) => {
    e.stopPropagation();
    // Navigate to students page, potentially passing the device ID to pre-select it
    // or to a specific registration page for that kiosk
    navigate('/students', { state: { targetDeviceId: deviceId } });
  };

  const resetForm = () => {
    setFormData({ device_name: '', device_type: 'kiosk', status: 'offline' });
    setEditingDevice(null);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading devices...</div>;
  }

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark">Device Management</h1>
          <p className="text-brand-charcoal/70 mt-1">Manage your kiosks and RFID scanners</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 bg-brand-orange text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-brand-orange/40 hover:bg-brand-orange/90 transition-all transform hover:-translate-y-0.5"
        >
          <MdAdd className="text-xl" />
          <span className="font-semibold">Add Device</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {devices.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border-2 border-dashed border-brand-orange/30">
            <div className="w-16 h-16 bg-brand-beige rounded-full flex items-center justify-center mx-auto mb-4">
              <MdDeviceHub className="text-3xl text-brand-orange" />
            </div>
            <h3 className="text-lg font-semibold text-brand-dark">No devices found</h3>
            <p className="text-brand-charcoal/70 mt-1">Add a new device to get started</p>
          </div>
        ) : (
          devices.map((device) => {
            const isOnline = device.status === 'online';
            return (
              <motion.div 
                key={device.id}
                onClick={() => navigate(`/devices/${device.id}`)}
                className={`
                  group relative bg-white rounded-2xl p-6 border border-brand-orange/30 cursor-pointer shadow-sm
                `}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              >
                {/* Status Badge */}
                <div className={`
                  absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1.5
                  ${isOnline ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}
                `}>
                  <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></span>
                  {device.status}
                </div>

                {/* Device Icon & Name */}
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className={`
                    p-4 rounded-xl border border-brand-orange/20 bg-brand-beige 
                    ${isOnline ? 'text-green-600' : 'text-brand-charcoal'}
                  `}
                  >
                    {device.device_type === 'kiosk' ? <MdDeviceHub size={32} /> : <MdWifi size={32} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-brand-dark group-hover:text-brand-orange transition-colors">
                      {device.device_name}
                    </h3>
                    <p className="text-sm text-brand-charcoal/70 font-medium uppercase tracking-wider mt-1">
                      {device.device_type}
                    </p>
                  </div>
                </div>

                {/* Stats / Info */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-brand-charcoal">
                    {isOnline ? <MdSignalWifi4Bar className="mr-2 text-green-500" /> : <MdSignalWifiOff className="mr-2 text-amber-500" />}
                    <span>{isOnline ? 'Signal Strength: Good' : 'No Signal'}</span>
                  </div>
                  <div className="flex items-center text-sm text-brand-charcoal/70">
                    <span className="font-mono text-xs bg-brand-beige px-2 py-1 rounded border border-brand-orange/30">ID: {device.id}</span>
                    <span className="mx-2">•</span>
                    <span>Last Sync: {device.last_sync ? new Date(device.last_sync).toLocaleTimeString() : 'Never'}</span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-brand-beige">
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => handleRefresh(e, device.id)}
                      className={`p-2 rounded-lg hover:bg-brand-beige text-brand-charcoal transition-colors ${refreshingId === device.id ? 'animate-spin text-brand-orange' : ''}`}
                      title="Sync Status"
                    >
                      <MdRefresh size={20} />
                    </button>
                    <button 
                      onClick={(e) => handleEdit(e, device)}
                      className="p-2 rounded-lg hover:bg-brand-beige text-brand-charcoal hover:text-brand-dark transition-colors"
                      title="Edit Settings"
                    >
                      <MdEdit size={20} />
                    </button>
                    <button 
                      onClick={(e) => handleDelete(e, device.id)}
                      className="p-2 rounded-lg hover:bg-brand-beige text-brand-charcoal hover:text-red-600 transition-colors"
                      title="Delete Device"
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>

                  {/* Register Button (Only if Online) */}
                  {isOnline && (
                    <button
                      onClick={(e) => handleRegisterClick(e, device.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-orange/10 text-brand-orange rounded-lg text-sm font-semibold hover:bg-brand-orange/20 transition-colors"
                    >
                      <MdPersonAdd size={18} />
                      Register
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Modal - Same as before but cleaner */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className="bg-brand-dark px-6 py-4">
              <h2 className="text-xl font-bold text-brand-beige">
                {editingDevice ? 'Edit Device' : 'Add New Device'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-brand-charcoal mb-1">Device Name</label>
                <input
                  type="text"
                  value={formData.device_name}
                  onChange={(e) => setFormData({ ...formData, device_name: e.target.value })}
                  className="w-full px-4 py-2 border border-brand-charcoal/20 rounded-lg focus:ring-2 focus:ring-brand-orange outline-none bg-white text-brand-dark"
                  placeholder="e.g., Kiosk 1 (Main Entrance)"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-brand-charcoal mb-1">Type</label>
                  <select
                    value={formData.device_type}
                    onChange={(e) => setFormData({ ...formData, device_type: e.target.value })}
                    className="w-full px-4 py-2 border border-brand-charcoal/20 rounded-lg focus:ring-2 focus:ring-brand-orange outline-none bg-white text-brand-dark"
                  >
                    <option value="kiosk">Kiosk (RPi)</option>
                    <option value="esp">ESP Scanner</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-charcoal mb-1">Initial Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-brand-charcoal/20 rounded-lg focus:ring-2 focus:ring-brand-orange outline-none bg-white text-brand-dark"
                  >
                    <option value="offline">Offline</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="flex-1 px-4 py-2 text-brand-charcoal bg-brand-beige hover:bg-brand-charcoal/10 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-brand-orange text-white hover:bg-brand-orange/90 rounded-lg font-semibold transition-colors shadow-lg shadow-brand-orange/30"
                >
                  {editingDevice ? 'Update Device' : 'Create Device'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Devices;