import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { dashboardAPI } from '../api/dashboard';
import { MdPeople, MdDevices, MdSchedule, MdPendingActions } from 'react-icons/md';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalStudents: 0, totalKiosks: 0, totalSchedules: 0, pendingRegistrations: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await dashboardAPI.getStats();
      setStats(data);
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  const statCards = [
    { title: 'Total Students', value: stats.totalStudents, icon: MdPeople },
    { title: 'Active Kiosks', value: stats.totalKiosks, icon: MdDevices },
    { title: 'Class Schedules', value: stats.totalSchedules, icon: MdSchedule },
    { title: 'Pending Requests', value: stats.pendingRegistrations, icon: MdPendingActions },
  ];

  if (loading) return <div className="p-10 text-center text-brand-charcoal animate-pulse">Loading Dashboard...</div>;

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-brand-dark">Dashboard</h1>
          <p className="text-brand-charcoal/70 mt-1">Overview of your attendance system</p>
        </div>
        <button className="bg-brand-orange text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-brand-orange/30 hover:bg-brand-orange/90 transition-colors">
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-lg border border-brand-orange/30"
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-brand-charcoal/60 text-sm font-bold uppercase tracking-wider">{card.title}</p>
                  <h3 className="text-4xl font-bold text-brand-dark mt-2">{card.value}</h3>
                </div>
                <div className="p-3 bg-brand-beige rounded-xl text-brand-orange">
                  <Icon size={28} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Placeholder for Charts or Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="bg-white p-6 rounded-2xl shadow-xl min-h-[300px]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4, ease: 'easeOut' }}
        >
           <h3 className="text-xl font-bold text-brand-dark mb-4">System Status</h3>
           <div className="flex items-center gap-4 p-4 bg-brand-beige/30 rounded-xl border border-brand-orange/20">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <div>
                 <p className="font-bold text-brand-dark">All Systems Operational</p>
                 <p className="text-xs text-brand-charcoal/60">Database and API are healthy</p>
              </div>
           </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;