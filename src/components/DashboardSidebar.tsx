import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  History,
  LogOut,
  Menu,
  X,
  User,
  Users,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { activityLogger } from '@/lib/activityLogger';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardSidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const { staffMember, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = async () => {
    if (staffMember?.id) {
      await activityLogger.log(staffMember.id, activityLogger.actions.LOGOUT);
    }
    await logout();
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, role: ['admin', 'staff', 'viewer'] },
    { id: 'forms', label: 'Submitted Forms', icon: FileText, role: ['admin', 'staff', 'viewer'] },
    { id: 'reports', label: 'Reports', icon: BarChart3, role: ['admin', 'staff', 'viewer'] },
    { id: 'staff', label: 'Manage Staff', icon: Users, role: ['admin'] },
    { id: 'logs', label: 'Activity Logs', icon: History, role: ['admin', 'staff'] },
  ];

  // Filter menu based on role
  const visibleItems = menuItems.filter((item) => {
    return item.role.includes(staffMember?.role || 'viewer');
  });

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 h-screen w-64 bg-green-800 text-white shadow-lg z-40 lg:static lg:translate-x-0 flex flex-col overflow-hidden"
      >
        <div className="p-6 border-b border-green-700 flex-shrink-0">
          <h2 className="text-xl font-bold">PIAD Staff</h2>
          <p className="text-sm text-green-200">{staffMember?.role.toUpperCase()}</p>
        </div>

        {/* User Info */}
        <div className="p-4 bg-green-700 m-4 rounded-lg flex-shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <User size={20} />
            <div className="text-sm">
              <p className="font-semibold">{staffMember?.full_name}</p>
              <p className="text-xs text-green-200">{staffMember?.email}</p>
            </div>
          </div>
          <p className="text-xs text-green-200">Dept: {staffMember?.department}</p>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 flex-1 overflow-y-auto">
          <div className="space-y-2">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    // Only close sidebar on mobile (small screens)
                    if (window.innerWidth < 1024) {
                      setIsOpen(false);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === item.id
                      ? 'bg-yellow-500 text-gray-900 font-semibold'
                      : 'text-white hover:bg-green-700'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-green-700 flex-shrink-0">
          <Button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </motion.div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        />
      )}
    </>
  );
};

export default DashboardSidebar;
