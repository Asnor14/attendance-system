import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion'; // <-- FIXED IMPORT
import { pendingAPI } from '../api/pending';
import { rfidAPI } from '../api/rfid';
import { 
  MdCheckCircle, 
  MdCancel, 
  MdRefresh, 
  MdSensors, 
  MdCreditCard, 
  MdClose,
  MdPerson
} from 'react-icons/md';

const Pending = () => {
  // Data State
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Live RFID State
  const [liveRfid, setLiveRfid] = useState(null);

  // Modal State
  const [selectedStudent, setSelectedStudent] = useState(null); // The student being approved
  const [rfidInput, setRfidInput] = useState(''); // The manual or scanned UID
  const [processing, setProcessing] = useState(false);

  // 1. Poll for Pending List & Live RFID
  useEffect(() => {
    fetchPending();
    
    const interval = setInterval(async () => {
      try {
        const data = await rfidAPI.getLive();
        setLiveRfid(data);
      } catch (error) {
        console.error('RFID Poll Error:', error);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [selectedStudent]);

  const fetchPending = async () => {
    try {
      const data = await pendingAPI.getAll();
      setPending(data);
    } catch (error) {
      console.error('Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Open Modal
  const openApproveModal = (student) => {
    setSelectedStudent(student);
    setRfidInput(''); // Clear previous input
  };

  // 3. Close Modal
  const closeModal = () => {
    setSelectedStudent(null);
    setRfidInput('');
    setProcessing(false);
  };

  // 4. Helper: Use the live scanned ID
  const useLiveId = () => {
    if (liveRfid?.uid) {
      setRfidInput(liveRfid.uid);
    }
  };

  // 5. Submit Approval
  const handleConfirmApprove = async (e) => {
    e.preventDefault();
    if (!rfidInput) {
      await Swal.fire({
        icon: 'warning',
        title: 'RFID Required',
        text: 'Please enter or scan an RFID UID.',
        background: '#FFE7D0',
        color: '#1B1B1B',
        confirmButtonColor: '#FC6E20',
        cancelButtonColor: '#323232',
      });
      return;
    }

    setProcessing(true);
    try {
      await pendingAPI.approve(selectedStudent.id, rfidInput);
      await Swal.fire({
        icon: 'success',
        title: 'Approved',
        text: `Success! ${selectedStudent.given_name} is now registered.`,
        background: '#FFE7D0',
        color: '#1B1B1B',
        confirmButtonColor: '#FC6E20',
        cancelButtonColor: '#323232',
      });
      closeModal();
      fetchPending();
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Approval Failed',
        text: error.response?.data?.error || 'Failed to approve.',
        background: '#FFE7D0',
        color: '#1B1B1B',
        confirmButtonColor: '#FC6E20',
        cancelButtonColor: '#323232',
      });
    } finally {
      setProcessing(false);
    }
  };

  // 6. Reject Student
  const handleReject = async (id) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Reject student?',
      text: 'Are you sure you want to REJECT this student?',
      showCancelButton: true,
      confirmButtonText: 'Yes, reject',
      cancelButtonText: 'Cancel',
      background: '#FFE7D0',
      color: '#1B1B1B',
      confirmButtonColor: '#FC6E20',
      cancelButtonColor: '#323232',
    });
    if (!result.isConfirmed) return;
    try {
      await pendingAPI.reject(id);
      fetchPending();
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Reject Failed',
        text: 'Failed to reject.',
        background: '#FFE7D0',
        color: '#1B1B1B',
        confirmButtonColor: '#FC6E20',
        cancelButtonColor: '#323232',
      });
    }
  };

  if (loading) return <div className="p-10 text-center text-brand-charcoal">Loading pending list...</div>;

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark">Pending Registrations</h1>
          <p className="text-brand-charcoal/70 text-sm mt-1">Review and assign RFID cards to new students</p>
        </div>
        <button
          onClick={fetchPending}
          className="flex items-center gap-2 bg-brand-orange text-white px-4 py-2 rounded-lg font-semibold shadow-lg shadow-brand-orange/30 hover:bg-brand-orange/90 transition-colors"
        >
          <MdRefresh className="text-xl" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-brand-orange/20 overflow-hidden">
        {pending.length === 0 ? (
          <div className="p-10 text-center text-brand-charcoal/70">
            <MdCheckCircle className="text-5xl text-green-400 mx-auto mb-3" />
            <p>All caught up! No pending registrations.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead className="bg-brand-charcoal text-brand-beige text-sm font-semibold uppercase tracking-wide">
                <tr>
                  <th className="p-4">Student Name</th>
                  <th className="p-4">ID Number</th>
                  <th className="p-4">Course</th>
                  <th className="p-4">Photo</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-beige">
                {pending.map((s) => (
                  <tr key={s.id} className="hover:bg-brand-beige/70 transition-colors">
                    <td className="p-4 font-semibold text-brand-dark">
                      {s.surname}, {s.given_name} {s.middle_name}
                    </td>
                    <td className="p-4 font-mono text-sm text-brand-charcoal/80">{s.student_id}</td>
                    <td className="p-4">
                      <span className="bg-brand-orange/10 text-brand-orange px-3 py-1 rounded-full text-xs font-bold">
                        {s.course}
                      </span>
                    </td>
                    <td className="p-4">
                      {s.face_image_url ? (
                        <a href={s.face_image_url} target="_blank" rel="noreferrer" className="text-brand-orange underline text-xs">
                          View
                        </a>
                      ) : <span className="text-brand-charcoal/50 text-xs">No Photo</span>}
                    </td>
                    <td className="p-4 flex justify-center gap-2">
                      <button 
                        onClick={() => openApproveModal(s)}
                        className="flex items-center gap-1 bg-brand-orange text-white px-3 py-1.5 rounded-lg hover:bg-brand-orange/90 text-sm font-semibold transition-colors shadow-sm"
                      >
                        <MdCheckCircle /> Approve
                      </button>
                      <button 
                        onClick={() => handleReject(s.id)}
                        className="flex items-center gap-1 border border-red-200 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 text-sm font-semibold transition-colors"
                      >
                        <MdCancel /> Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- APPROVAL MODAL --- */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            
            {/* Modal Header */}
            <div className="bg-brand-dark p-6 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-brand-beige">Approve Student</h2>
                <p className="text-brand-beige/70 text-sm mt-1">Assign an RFID Card to finish.</p>
              </div>
              <button onClick={closeModal} className="text-brand-beige/70 hover:text-brand-beige transition-colors">
                <MdClose size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              
              {/* Student Summary */}
              <div className="flex items-center gap-4 p-4 bg-brand-beige rounded-xl border border-brand-orange/20">
                <div className="bg-white p-3 rounded-full text-brand-orange shadow-inner">
                  <MdPerson size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-brand-dark">
                    {selectedStudent.surname}, {selectedStudent.given_name}
                  </h3>
                  <p className="text-xs text-brand-charcoal/70 font-mono">{selectedStudent.student_id}</p>
                </div>
              </div>

              {/* RFID Input Section */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-brand-charcoal flex items-center gap-2">
                  <MdCreditCard /> RFID UID
                </label>
                
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={rfidInput}
                    onChange={(e) => setRfidInput(e.target.value)}
                    placeholder="Scan card or type UID..."
                    className="flex-1 p-3 border border-brand-charcoal/20 rounded-lg outline-none focus:ring-2 focus:ring-brand-orange font-mono text-lg bg-white text-brand-dark"
                    autoFocus
                  />
                </div>

                {/* Live Scanner Indicator */}
                {liveRfid?.isActive ? (
                  <div className="bg-green-100 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
                      <MdSensors className="animate-pulse" />
                      <span>Scanner Active: <span className="font-mono">{liveRfid.uid}</span></span>
                    </div>
                    <button 
                      onClick={useLiveId}
                      className="text-xs bg-brand-dark text-white px-2 py-1 rounded hover:bg-brand-charcoal transition-colors"
                    >
                      Use This
                    </button>
                  </div>
                ) : (
                  <div className="text-xs text-brand-charcoal/60 flex items-center gap-1">
                    <MdSensors /> Scanner offline (Connect ESP8266 or Kiosk)
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={closeModal}
                  className="flex-1 py-3 text-brand-charcoal bg-brand-beige hover:bg-brand-charcoal/10 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmApprove}
                  disabled={processing || !rfidInput}
                  className="flex-1 py-3 bg-brand-orange text-white rounded-xl font-bold hover:bg-brand-orange/90 transition-colors shadow-lg shadow-brand-orange/30 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {processing ? "Saving..." : "Confirm & Save"}
                </button>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Pending;