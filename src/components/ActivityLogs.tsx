import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { activityLogger } from '@/lib/activityLogger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, FileText, BarChart3, LogIn, LogOut, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  details: Record<string, any> | null;
  created_at: string;
  staff_members?: {
    full_name: string;
    email: string;
    role: string;
    department: string;
  };
}

const ITEMS_PER_PAGE = 5;

const ActivityLogs = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { staffMember } = useAuth();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching logs for user:', staffMember);
      
      // Admins see all logs, staff see only their own
      if (staffMember?.role === 'admin') {
        console.log('Fetching all logs as admin...');
        const logs = await activityLogger.getActivityLogsWithStaff(200);
        console.log('Fetched logs:', logs);
        setLogs(logs as unknown as ActivityLog[]);
      } else {
        console.log('Fetching own logs for staff...');
        const logs = await activityLogger.getActivityLogs(staffMember?.id, 100);
        console.log('Fetched logs:', logs);
        setLogs(logs as unknown as ActivityLog[]);
      }
      setCurrentPage(1); // Reset to first page
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('Login')) return <LogIn className="w-4 h-4 text-green-600" />;
    if (action.includes('Logout')) return <LogOut className="w-4 h-4 text-red-600" />;
    if (action.includes('Form')) return <FileText className="w-4 h-4 text-blue-600" />;
    if (action.includes('Report')) return <BarChart3 className="w-4 h-4 text-purple-600" />;
    if (action.includes('Staff')) return <Users className="w-4 h-4 text-orange-600" />;
    return <AlertCircle className="w-4 h-4 text-gray-600" />;
  };

  const getActionColor = (action: string) => {
    if (action.includes('Create')) return 'bg-green-100 text-green-800';
    if (action.includes('Update') || action.includes('Edit')) return 'bg-blue-100 text-blue-800';
    if (action.includes('Delete')) return 'bg-red-100 text-red-800';
    if (action.includes('View')) return 'bg-gray-100 text-gray-800';
    if (action.includes('Login')) return 'bg-green-100 text-green-800';
    if (action.includes('Logout')) return 'bg-red-100 text-red-800';
    if (action.includes('Publish')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday ${date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Activity Logs</h2>
        <Button onClick={fetchLogs} variant="outline">
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading logs...</div>
      ) : logs.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            No activity logs found
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            {logs
              .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
              .map((log) => (
                <Card key={log.id} className="hover:shadow-md transition">
                  <CardContent className="py-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">{getActionIcon(log.action)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <Badge className={`${getActionColor(log.action)}`}>
                              {log.action}
                            </Badge>
                            {log.resource_type && (
                              <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                                {log.resource_type}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 font-mono">
                            {formatTime(log.created_at)}
                          </span>
                        </div>

                        <div className="text-sm mb-2">
                          {log.staff_members ? (
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-800">
                                {log.staff_members.full_name}
                              </span>
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-600">{log.staff_members.email}</span>
                              <span className="text-gray-500">•</span>
                              <Badge variant="outline" className="text-xs">
                                {log.staff_members.role}
                              </Badge>
                            </div>
                          ) : (
                            <span className="text-gray-600">{log.user_id}</span>
                          )}
                        </div>

                        {log.details && Object.keys(log.details).length > 1 && (
                          <div className="text-xs text-gray-600 mt-2">
                            <details className="cursor-pointer">
                              <summary className="font-semibold hover:text-gray-900">
                                View Details
                              </summary>
                              <pre className="bg-gray-50 p-3 rounded mt-2 text-xs overflow-auto max-h-48 border border-gray-200 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                {JSON.stringify(
                                  Object.entries(log.details)
                                    .filter(([key]) => key !== 'timestamp' && key !== 'user_agent')
                                    .reduce((acc, [key, value]) => {
                                      acc[key] = value;
                                      return acc;
                                    }, {} as Record<string, any>),
                                  null,
                                  2
                                )}
                              </pre>
                            </details>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Pagination Controls */}
          {logs.length > ITEMS_PER_PAGE && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                {Math.min(currentPage * ITEMS_PER_PAGE, logs.length)} of {logs.length} entries
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({
                    length: Math.ceil(logs.length / ITEMS_PER_PAGE),
                  }).map((_, i) => (
                    <Button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      variant={currentPage === i + 1 ? 'default' : 'outline'}
                      size="sm"
                      className="w-10"
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
                <Button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(
                        Math.ceil(logs.length / ITEMS_PER_PAGE),
                        prev + 1
                      )
                    )
                  }
                  disabled={
                    currentPage === Math.ceil(logs.length / ITEMS_PER_PAGE)
                  }
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivityLogs;
