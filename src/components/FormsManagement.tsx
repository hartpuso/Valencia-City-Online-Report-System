import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { activityLogger } from '@/lib/activityLogger';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Check, Clock, XCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface SubmittedForm {
  id: string;
  full_name: string;
  email: string;
  contact_number: string;
  concern: string;
  status: string;
  barangay: string;
  street: string;
  created_at: string;
  image_url?: string;
  reference_number: string;
  referred_to?: string | null;
  referred_at?: string | null;
}

const DEPARTMENTS = [
  'City Admin Office',
  'Finance Department',
  'Social Services',
  'Public Health Office',
  'Tourism Office',
  'Legal Affairs',
  'Human Resources',
];

const FormsManagement = () => {
  const [forms, setForms] = useState<SubmittedForm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showReferralModal, setShowReferralModal] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [referralNote, setReferralNote] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { staffMember } = useAuth();
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('foi_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setForms(data || []);

      if (staffMember?.id) {
        await activityLogger.log(
          staffMember.id,
          activityLogger.actions.VIEW_FORM,
          'forms',
          undefined,
          { filter }
        );
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormStatus = async (formId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('foi_requests')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', formId);

      if (error) throw error;

      setForms(forms.map((form) => (form.id === formId ? { ...form, status: newStatus } : form)));

      if (staffMember?.id) {
        await activityLogger.log(
          staffMember.id,
          activityLogger.actions.UPDATE_FORM,
          'forms',
          formId,
          { new_status: newStatus }
        );
      }
    } catch (error) {
      console.error('Error updating form:', error);
    }
  };

  const handleReferToDepartment = async (formId: string, department: string, note: string) => {
    if (!department) {
      alert('Please select a department');
      return;
    }

    try {
      const { error } = await supabase
        .from('foi_requests')
        .update({
          referred_to: department,
          referred_at: new Date().toISOString(),
          status: 'in_review',
          notes: note || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', formId);

      if (error) throw error;

      setForms(forms.map((form) => 
        form.id === formId 
          ? { ...form, referred_to: department, status: 'in_review' } 
          : form
      ));
      
      setShowReferralModal(null);
      setSelectedDepartment('');
      setReferralNote('');

      if (staffMember?.id) {
        await activityLogger.log(
          staffMember.id,
          activityLogger.actions.UPDATE_FORM,
          'forms',
          formId,
          { action: 'referred', referred_to: department, note }
        );
      }
    } catch (error) {
      console.error('Error referring form:', error);
      alert('Error referring form. Please try again.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'in_review':
        return <AlertCircle className="w-4 h-4" />;
      case 'resolved':
        return <Check className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_review':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Submitted Forms</h2>
        <Select value={filter} onValueChange={(value) => { setFilter(value); setCurrentPage(1); fetchForms(); }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Forms</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_review">In Review</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading forms...</div>
      ) : forms.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            No forms found
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4">
            {(() => {
              const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
              const endIndex = startIndex + ITEMS_PER_PAGE;
              const paginatedForms = forms.slice(startIndex, endIndex);
              
              return paginatedForms.map((form) => (
                <Card key={form.id} className="hover:shadow-lg transition bg-blue-50 border-blue-100">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{form.full_name}</CardTitle>
                        <p className="text-sm text-gray-500">{form.email}</p>
                      </div>
                      <Badge className={`flex gap-1 ${getStatusColor(form.status)}`}>
                        {getStatusIcon(form.status)}
                        {form.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Contact Number</p>
                        <p className="font-semibold">{form.contact_number}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Submitted</p>
                        <p className="font-semibold">
                          {new Date(form.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-500 text-sm mb-1">Concern</p>
                      <p className="text-gray-700">{form.concern}</p>
                    </div>

                    {form.image_url && (
                      <div>
                        <p className="text-gray-500 text-sm mb-2">Attachment</p>
                        <img
                          src={form.image_url}
                          alt="Form attachment"
                          className="max-w-xs rounded-lg"
                        />
                      </div>
                    )}

                    {staffMember?.role !== 'viewer' && (
                      <div className="flex gap-2 flex-wrap">
                        <Select
                          value={form.status}
                          onValueChange={(value) => updateFormStatus(form.id, value)}
                        >
                          <SelectTrigger className="w-40 bg-white border-2 border-gray-300 text-gray-900 font-medium hover:border-gray-400">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-50">
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_review">In Review</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        {/* Refer to Department Button */}
                        <Button
                          onClick={() => setShowReferralModal(form.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Refer to Department
                        </Button>
                        
                        {form.referred_to && (
                          <p className="text-xs text-blue-600 self-center">
                            Referred to: <span className="font-semibold">{form.referred_to}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ));
            })()}
          </div>

          {/* Pagination Controls */}
          {forms.length > ITEMS_PER_PAGE && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="outline"
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.ceil(forms.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    variant={currentPage === page ? 'default' : 'outline'}
                    className={currentPage === page ? 'bg-green-600 hover:bg-green-700' : ''}
                    size="sm"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(forms.length / ITEMS_PER_PAGE)))}
                disabled={currentPage === Math.ceil(forms.length / ITEMS_PER_PAGE)}
                variant="outline"
              >
                Next
              </Button>
            </div>
          )}

          {/* Footer with Form Count */}
          {forms.length > 0 && (
            <div className="fixed bottom-0 left-0 right-0 bg-gray-50 border-t border-gray-200 p-4 text-center">
              <p className="text-sm text-gray-600">
                Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, forms.length)} to {Math.min(currentPage * ITEMS_PER_PAGE, forms.length)} of {forms.length} forms
              </p>
            </div>
          )}
        </>
      )}
      {showReferralModal && (
        <Dialog open={!!showReferralModal} onOpenChange={(open) => {
          if (!open) {
            setShowReferralModal(null);
            setSelectedDepartment('');
            setReferralNote('');
          }
        }}>
          <DialogContent className="sm:max-w-md bg-blue-50 border-blue-200">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Refer Form to Department</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Department Dropdown */}
              <div>
                <label className="text-sm font-medium text-gray-800 block mb-2">
                  Select Department
                </label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="bg-white border-2 border-gray-300 text-gray-900">
                    <SelectValue placeholder="Choose a department" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Note Input */}
              <div>
                <label className="text-sm font-medium text-gray-800 block mb-2">
                  Note (Optional)
                </label>
                <Textarea
                  placeholder="Add a note for the referred department..."
                  value={referralNote}
                  onChange={(e) => setReferralNote(e.target.value)}
                  className="border-2 border-gray-300 bg-white text-gray-900 placeholder:text-gray-500"
                  rows={4}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowReferralModal(null);
                  setSelectedDepartment('');
                  setReferralNote('');
                }}
                className="text-gray-200 border-gray-300"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleReferToDepartment(showReferralModal, selectedDepartment, referralNote)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Submit Referral
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default FormsManagement;
