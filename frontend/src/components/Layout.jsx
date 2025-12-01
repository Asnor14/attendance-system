import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-brand-beige text-brand-dark">
      <div className="flex h-screen overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 lg:hidden"
            onClick={closeSidebar}
            role="button"
            aria-label="Close sidebar overlay"
          />
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-brand-beige">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;

