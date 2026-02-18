import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { activityLogger } from '@/lib/activityLogger';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Edit2, Trash2, Shield } from 'lucide-react';

interface StaffMember {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'staff' | 'viewer';
  department: string;
  is_active: boolean;
  created_at: string;
}

const StaffManagement = () => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<'admin' | 'staff' | 'viewer'>('staff');
  const [editingDepartment, setEditingDepartment] = useState('');
  const { staffMember } = useAuth();

  useEffect(() => {
    fetchStaffMembers();
  }, []);

  const fetchStaffMembers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('staff_members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStaffMembers(data || []);

      if (staffMember?.id) {
        await activityLogger.log(
          staffMember.id,
          'View Staff Members',
          'staff_members'
        ).catch(console.error);
      }
    } catch (error) {
      console.error('Error fetching staff members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (member: StaffMember) => {
    setEditingId(member.id);
    setEditingRole(member.role);
    setEditingDepartment(member.department);
  };

  const saveChanges = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('staff_members')
        .update({
          role: editingRole,
          department: editingDepartment,
          updated_at: new Date().toISOString(),
        })
        .eq('id', memberId);

      if (error) throw error;

      setStaffMembers(
        staffMembers.map((member) =>
          member.id === memberId
            ? { ...member, role: editingRole, department: editingDepartment }
            : member
        )
      );

      setEditingId(null);

      if (staffMember?.id) {
        await activityLogger.log(
          staffMember.id,
          'Update Staff Member',
          'staff_members',
          memberId,
          { new_role: editingRole, new_department: editingDepartment }
        ).catch(console.error);
      }
    } catch (error) {
      console.error('Error updating staff member:', error);
    }
  };

  const toggleActive = async (memberId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('staff_members')
        .update({
          is_active: !currentStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', memberId);

      if (error) throw error;

      setStaffMembers(
        staffMembers.map((member) =>
          member.id === memberId ? { ...member, is_active: !currentStatus } : member
        )
      );

      if (staffMember?.id) {
        await activityLogger.log(
          staffMember.id,
          'Toggle Staff Status',
          'staff_members',
          memberId,
          { new_status: !currentStatus }
        ).catch(console.error);
      }
    } catch (error) {
      console.error('Error updating staff status:', error);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'staff':
        return 'bg-blue-100 text-blue-800';
      case 'viewer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Staff Management</h2>
        <Button onClick={fetchStaffMembers} variant="outline">
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading staff members...</div>
      ) : staffMembers.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            No staff members found
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {staffMembers.map((member) => (
            <Card key={member.id} className={!member.is_active ? 'opacity-60' : ''}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {member.full_name}
                      {member.role === 'admin' && <Shield className="w-4 h-4 text-red-600" />}
                    </CardTitle>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                  <div className="flex gap-2 items-start">
                    <Badge className={`${getRoleBadgeColor(member.role)}`}>
                      {member.role.toUpperCase()}
                    </Badge>
                    {!member.is_active && (
                      <Badge variant="destructive">INACTIVE</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Department</p>
                    <p className="font-semibold">{member.department}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Joined</p>
                    <p className="font-semibold">
                      {new Date(member.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {editingId === member.id ? (
                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className="text-sm font-medium">Role</label>
                      <Select value={editingRole} onValueChange={(value) => setEditingRole(value as any)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Department</label>
                      <Input
                        value={editingDepartment}
                        onChange={(e) => setEditingDepartment(e.target.value)}
                        placeholder="Enter department"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => saveChanges(member.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => setEditingId(null)}
                        variant="outline"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => startEditing(member)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => toggleActive(member.id, member.is_active)}
                      variant={member.is_active ? 'destructive' : 'default'}
                      size="sm"
                      className="flex-1"
                    >
                      {member.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
