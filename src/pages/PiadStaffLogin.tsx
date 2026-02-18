import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { supabaseAuth } from "@/lib/supabaseAuth";
import { activityLogger } from "@/lib/activityLogger";

const PiadStaffLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabaseAuth.getSession();
      if (data.session) {
        setIsLoggedIn(true);
        // Redirect to dashboard immediately
        navigate("/dashboard");
      }
    };
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!email || !password) {
        setError("Please fill in all fields");
        setIsLoading(false);
        return;
      }

      // Sign in with Supabase
      const { data, error: signInError } = await supabaseAuth.signIn(email, password);

      if (signInError) {
        setError(signInError.message);
        setIsLoading(false);
      } else if (data.session) {
        // Log successful login
        await activityLogger.log(
          data.session.user.id,
          activityLogger.actions.LOGIN,
          'auth',
          undefined,
          { email, login_time: new Date().toISOString() }
        ).catch(console.error);
        
        localStorage.setItem("piad_staff_email", email);
        
        // Redirect to dashboard immediately (no delay)
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError("Authentication failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    // Log logout before signing out
    try {
      const { data } = await supabaseAuth.getSession();
      if (data.session?.user.id) {
        await activityLogger.log(
          data.session.user.id,
          activityLogger.actions.LOGOUT,
          'auth',
          undefined,
          { logout_time: new Date().toISOString() }
        ).catch(console.error);
      }
    } catch (err) {
      console.error('Error logging logout:', err);
    }
    
    const { error } = await supabaseAuth.signOut();
    if (!error) {
      setIsLoggedIn(false);
      setEmail("");
      setPassword("");
      localStorage.removeItem("piad_staff_email");
      navigate("/piad-staff-login");
    } else {
      setError("Logout failed");
    }
    setIsLoading(false);
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircleIcon className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">Logged In Successfully</CardTitle>
              <CardDescription>Welcome, {email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  You are now authenticated as a PIAD staff member. You can now access restricted features.
                </p>
                <Button onClick={handleLogout} variant="outline" className="w-full">
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-green-800 border-green-800 shadow-lg">
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white p-3 rounded-lg">
                <LogIn className="w-6 h-6 text-green-800" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center text-white">PIAD Staff Login</CardTitle>
            <CardDescription className="text-center text-green-100">
              Secure access for PIAD staff members only
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-white">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="bg-white border-white text-gray-900 placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-white">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="bg-white border-white text-gray-900 placeholder:text-gray-500"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-gray-900 font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>

            <div className="mt-4 p-3 bg-green-700 rounded-lg border border-green-600">
              <p className="text-xs text-white">
                <span className="font-semibold">Demo Account:</span>
                <br />
                Email: demo@piad.com
                <br />
                Password: password123
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

// Icon component
const CheckCircleIcon = ({ className }: { className: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export default PiadStaffLogin;
