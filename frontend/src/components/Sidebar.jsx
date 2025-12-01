import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdSecurity } from 'react-icons/md';
import {
  MdDashboard,
  MdDevices,
  MdSchedule,
  MdPeople,
  MdPendingActions,
  MdQrCodeScanner,
  MdSettings,
  MdSchool,
  MdClose,
} from 'react-icons/md';

const Sidebar = ({ isOpen, onClose = () => {} }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const menuItems = [
    { path: '/dashboard', icon: MdDashboard, label: 'Dashboard' },
    ...(isAdmin
      ? [
          { path: '/devices', icon: MdDevices, label: 'Devices' },
          { path: '/teachers', icon: MdSchool, label: 'Faculty' },
          { path: '/admins', icon: MdSecurity, label: 'Admins' },
        ]
      : []),
    { path: '/schedules', icon: MdSchedule, label: 'Schedules' },
    { path: '/students', icon: MdPeople, label: 'Students' },
    ...(isAdmin ? [{ path: '/pending', icon: MdPendingActions, label: 'Pending' }] : []),
    { path: '/rfid', icon: MdQrCodeScanner, label: 'RFID Scanner' },
    ...(isAdmin ? [{ path: '/settings', icon: MdSettings, label: 'Settings' }] : []),
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-72 transform bg-brand-dark text-brand-beige shadow-2xl transition-transform duration-300
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:static lg:translate-x-0 lg:flex lg:flex-col lg:w-64`}
    >
      <div className="flex items-center justify-between px-6 py-5 border-b border-brand-charcoal/40">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-beige">Attendance</h1>
          <p className="text-sm text-brand-beige/70 mt-1 font-medium">
            {isAdmin ? 'Admin Console' : 'Faculty Portal'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-2 text-brand-beige/80 hover:text-brand-orange transition-colors rounded-full"
          aria-label="Close sidebar"
        >
          <MdClose size={20} />
        </button>
      </div>

      <nav className="mt-6 px-3 space-y-1 overflow-y-auto pb-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl border border-transparent transition-all
                ${
                  isActive
                    ? 'bg-brand-orange/10 text-brand-orange border-brand-orange/30 shadow-inner'
                    : 'text-brand-beige/80 hover:text-brand-beige hover:bg-brand-charcoal/60'
                }`
              }
            >
              <Icon className="text-lg" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;