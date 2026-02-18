import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { activityLogger } from '@/lib/activityLogger';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Download } from 'lucide-react';

interface Report {
  id: string;
  title: string;
  description: string;
  report_type: string;
  status: string;
  created_by: string;
  created_at: string;
  data?: Record<string, any>;
}

const ReportsTracking = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newReport, setNewReport] = useState({
    title: '',
    description: '',
    report_type: 'summary',
  });
  const { staffMember } = useAuth();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      // Viewers see only published reports
      if (staffMember?.role === 'viewer') {
        query = query.eq('status', 'published');
      }

      const { data, error } = await query;

      if (error) throw error;
      setReports(data || []);

      if (staffMember?.id) {
        await activityLogger.log(
          staffMember.id,
          activityLogger.actions.VIEW_REPORT,
          'reports'
        );
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateReport = async () => {
    if (!newReport.title || !staffMember?.id) return;

    try {
      const { error } = await supabase.from('reports').insert({
        title: newReport.title,
        description: newReport.description,
        report_type: newReport.report_type,
        created_by: staffMember.id,
        status: 'draft',
        data: {},
      });

      if (error) throw error;

      setNewReport({ title: '', description: '', report_type: 'summary' });
      setIsDialogOpen(false);
      fetchReports();

      await activityLogger.log(
        staffMember.id,
        activityLogger.actions.CREATE_REPORT,
        'reports',
        undefined,
        { report_title: newReport.title }
      );
    } catch (error) {
      console.error('Error creating report:', error);
    }
  };

  const updateReportStatus = async (reportId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({ status: newStatus })
        .eq('id', reportId);

      if (error) throw error;

      setReports(
        reports.map((report) =>
          report.id === reportId ? { ...report, status: newStatus } : report
        )
      );

      if (staffMember?.id && newStatus === 'published') {
        await activityLogger.log(
          staffMember.id,
          activityLogger.actions.PUBLISH_REPORT,
          'reports',
          reportId
        );
      }
    } catch (error) {
      console.error('Error updating report:', error);
    }
  };

  const downloadReport = (report: Report) => {
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.title}.json`;
    link.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reports</h2>
        {staffMember?.role !== 'viewer' && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                New Report
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Report</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Report Title</label>
                  <Input
                    value={newReport.title}
                    onChange={(e) =>
                      setNewReport({ ...newReport, title: e.target.value })
                    }
                    placeholder="Enter report title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newReport.description}
                    onChange={(e) =>
                      setNewReport({ ...newReport, description: e.target.value })
                    }
                    placeholder="Enter report description"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Report Type</label>
                  <Select
                    value={newReport.report_type}
                    onValueChange={(value) =>
                      setNewReport({ ...newReport, report_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summary">Summary</SelectItem>
                      <SelectItem value="detailed">Detailed</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCreateReport} className="w-full">
                  Create Report
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading reports...</div>
      ) : reports.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            No reports found
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{report.title}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                  </div>
                  <Badge className={`${getStatusColor(report.status)}`}>
                    {report.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Type</p>
                    <p className="font-semibold">{report.report_type}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Created</p>
                    <p className="font-semibold">
                      {new Date(report.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className="font-semibold">{report.status}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {staffMember?.role !== 'viewer' && (
                    <>
                      <Select
                        value={report.status}
                        onValueChange={(value) => updateReportStatus(report.id, value)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </>
                  )}
                  <Button
                    onClick={() => downloadReport(report)}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportsTracking;
