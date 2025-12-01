import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdLock, MdPerson, MdArrowForward, MdVisibility, MdVisibilityOff } from 'react-icons/md';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👁️ State for visibility
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
      <motion.div
        className="bg-brand-charcoal w-full max-w-md p-8 rounded-3xl shadow-2xl border border-brand-beige/10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-beige mb-2">Welcome Back</h1>
          <p className="text-brand-beige/60 text-sm">Enter your credentials</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Input */}
          <div>
            <label className="block text-xs font-bold text-brand-beige/70 uppercase tracking-wider mb-2">Username</label>
            <div className="relative group">
              <MdPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-beige/40 group-focus-within:text-brand-orange transition-colors text-xl" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-brand-dark border border-brand-beige/10 rounded-xl text-brand-beige placeholder-brand-beige/30 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all"
                placeholder="Username"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-bold text-brand-beige/70 uppercase tracking-wider mb-2">Password</label>
            <div className="relative group">
              <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-beige/40 group-focus-within:text-brand-orange transition-colors text-xl" />
              
              <input
                type={showPassword ? "text" : "password"} // 👁️ Toggle Type
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 bg-brand-dark border border-brand-beige/10 rounded-xl text-brand-beige placeholder-brand-beige/30 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all"
                placeholder="••••••••"
                required
              />

              {/* 👁️ Toggle Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-beige/40 hover:text-brand-orange cursor-pointer transition-colors outline-none"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-orange text-white py-4 rounded-xl font-bold hover:bg-brand-orange-hover transition-all shadow-lg shadow-brand-orange/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>Sign In <MdArrowForward /></>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;