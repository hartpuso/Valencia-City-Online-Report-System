import { supabase } from '@/lib/supabase';

export const activityLogger = {
  log: async (
    userId: string,
    action: string,
    resourceType?: string,
    resourceId?: string,
    details?: Record<string, any>
  ) => {
    try {
      console.log('Attempting to log activity:', { userId, action, resourceType, resourceId });
      const { error } = await supabase.from('activity_logs').insert({
        user_id: userId,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        details: {
          ...details,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
        },
      });

      if (error) {
        console.error('Error logging activity:', error);
        return false;
      }
      console.log('Activity logged successfully');
      return true;
    } catch (error) {
      console.error('Activity logging failed:', error);
      return false;
    }
  },

  getActivityLogs: async (userId?: string, limit = 100) => {
    try {
      let query = supabase
        .from('activity_logs')
        .select('*, staff_members(full_name, email, role)')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching activity logs:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch activity logs:', error);
      return [];
    }
  },

  // Get logs with staff member info
  getActivityLogsWithStaff: async (limit = 100) => {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching activity logs:', error);
        return [];
      }

      // Now manually join with staff_members
      if (!data || data.length === 0) return [];

      const logsWithStaff = await Promise.all(
        data.map(async (log) => {
          const { data: staffData } = await supabase
            .from('staff_members')
            .select('full_name, email, role, department')
            .eq('id', log.user_id)
            .single();

          return {
            ...log,
            staff_members: staffData,
          };
        })
      );

      return logsWithStaff;
    } catch (error) {
      console.error('Failed to fetch activity logs:', error);
      return [];
    }
  },

  // Pre-defined actions
  actions: {
    LOGIN: 'User Login',
    LOGOUT: 'User Logout',
    VIEW_FORM: 'View Submitted Form',
    CREATE_FORM: 'Create Form',
    UPDATE_FORM: 'Update Form',
    DELETE_FORM: 'Delete Form',
    ASSIGN_FORM: 'Assign Form',
    VIEW_REPORT: 'View Report',
    CREATE_REPORT: 'Create Report',
    PUBLISH_REPORT: 'Publish Report',
    VIEW_LOGS: 'View Activity Logs',
    EXPORT_DATA: 'Export Data',
    EDIT_STAFF: 'Edit Staff Member',
    TOGGLE_STAFF_STATUS: 'Toggle Staff Status',
    DASHBOARD_ACCESS: 'Dashboard Access',
  },
};
