import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardOverview from '@/components/DashboardOverview';
import FormsManagement from '@/components/FormsManagement';
import ReportsTracking from '@/components/ReportsTracking';
import ActivityLogs from '@/components/ActivityLogs';
import StaffManagement from '@/components/StaffManagement';
import { activityLogger } from '@/lib/activityLogger';

const Dashboard = () => {
  const { isLoggedIn, isLoading, staffMember } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Log dashboard visit (non-blocking)
    if (staffMember?.id) {
      activityLogger.log(staffMember.id, 'Dashboard Access').catch(console.error);
    }
  }, [staffMember?.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Loading...</h2>
          <p className="text-gray-600">Initializing your dashboard</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/piad-staff-login" replace />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;
      case 'forms':
        return <FormsManagement />;
      case 'reports':
        return <ReportsTracking />;
      case 'staff':
        return <StaffManagement />;
      case 'logs':
        return <ActivityLogs />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar - Always Fixed */}
      <div className="fixed left-0 top-0 h-screen w-64 z-40 hidden lg:block">
        <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden">
        <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Content - Scrollable with margin for fixed sidebar */}
      <main className="overflow-y-auto min-h-screen lg:ml-64">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
