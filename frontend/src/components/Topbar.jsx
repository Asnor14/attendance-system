import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MdLogout, MdMenu } from 'react-icons/md';

const Topbar = ({ toggleSidebar = () => {} }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white/70 backdrop-blur-xl border-b border-brand-dark/5 sticky top-0 z-10 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 text-brand-dark hover:bg-brand-charcoal/10 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            <MdMenu size={24} />
          </button>
          <div>
            <p className="text-xs uppercase tracking-wide text-brand-dark/60 font-semibold">
              {new Date().toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <h2 className="text-lg font-bold text-brand-dark">
              Welcome, {user?.full_name?.split(' ')[0] || 'User'} 👋
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 pl-1 pr-3 py-1 rounded-full hover:bg-brand-charcoal/10 transition-all cursor-pointer border border-brand-dark/5"
          >
            <img
              src={
                user?.avatar_url ||
                `https://ui-avatars.com/api/?name=${user?.username}&background=FC6E20&color=fff`
              }
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover border-2 border-brand-orange"
            />
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-brand-dark leading-none">{user?.username}</p>
              <p className="text-[10px] text-brand-dark/60 uppercase mt-0.5">{user?.role}</p>
            </div>
          </button>

          <div className="h-6 w-px bg-brand-dark/10 mx-1" />

          <button
            onClick={handleLogout}
            className="p-2 text-brand-dark/70 hover:text-brand-dark hover:bg-brand-orange/10 rounded-lg transition-colors"
            title="Logout"
          >
            <MdLogout size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;