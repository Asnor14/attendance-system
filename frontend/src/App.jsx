import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Devices from './pages/Devices';
import DeviceDetails from './pages/DeviceDetails'; // 👈 ADD THIS LINE
import Schedules from './pages/Schedules';
import Students from './pages/Students';
import Pending from './pages/Pending';
import RFIDViewer from './pages/RFIDViewer';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Teachers from './pages/Teachers';
import Profile from './pages/Profile';
import Admins from './pages/Admins';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="devices" element={<Devices />} />
            <Route path="devices/:id" element={<DeviceDetails />} /> {/* 👈 Ensure this is here too */}
            <Route path="schedules" element={<Schedules />} />
            <Route path="students" element={<Students />} />
            <Route path="pending" element={<Pending />} />
            <Route path="rfid" element={<RFIDViewer />} />
            <Route path="settings" element={<Settings />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="profile" element={<Profile />} />
            <Route path="admins" element={<Admins />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;