import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabaseAuth } from '@/lib/supabaseAuth';
import { supabase } from '@/lib/supabase';

interface StaffMember {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'staff' | 'viewer';
  department: string;
  is_active: boolean;
}

interface AuthContextType {
  user: any | null;
  staffMember: StaffMember | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [staffMember, setStaffMember] = useState<StaffMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data } = await supabaseAuth.getSession();
        if (data.session) {
          setUser(data.session.user);
          setIsLoggedIn(true);
          
          // Set loading to false immediately, then fetch staff data in background
          setIsLoading(false);
          
          // Fetch staff member details asynchronously (doesn't block navigation)
          (async () => {
            try {
              const { data: staffData } = await supabase
                .from('staff_members')
                .select('*')
                .eq('id', data.session.user.id)
                .single();

              if (staffData) {
                setStaffMember(staffData);
              }
            } catch (error) {
              console.error('Error fetching staff data:', error);
            }
          })();
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: listener } = supabaseAuth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user);
        setIsLoggedIn(true);
        
        // Fetch staff data in background without blocking
        (async () => {
          try {
            const { data: staffData } = await supabase
              .from('staff_members')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (staffData) {
              setStaffMember(staffData);
            }
          } catch (error) {
            console.error('Error fetching staff data:', error);
          }
        })();
      } else {
        setUser(null);
        setStaffMember(null);
        setIsLoggedIn(false);
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabaseAuth.signOut();
    setUser(null);
    setStaffMember(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, staffMember, isLoading, isLoggedIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
