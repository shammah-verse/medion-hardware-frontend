import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { authApi } from '../api/auth';
import { useAuthStore } from '../store/useAuthStore';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const location = useLocation();

  // Basic client-side validation
  const isFormValid = username.trim().length > 0 && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setError('');
    setLoading(true);

    try {
      // Execute API call
      const response = await authApi.login({ username, password });
      
      // Update global store
      login(response.accessToken, response.profile);
      
      // Navigate based on role or intended destination
      const from = (location.state as any)?.from?.pathname;
      const role = response.profile.role;
      
      if (from) {
        navigate(from);
      } else if (role === 'STORE_OWNER' || role === 'VENDOR') {
        navigate('/vendor/dashboard');
      } else if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      console.error("Login error:", err);
      // Surface raw backend error to the UI, sanitizing any stack traces or HTML
      let backendMessage = typeof err.response?.data === 'string' 
        ? err.response.data 
        : err.response?.data?.message;
      
      // Sanitize potential stack traces (basic check)
      if (backendMessage && (backendMessage.includes('java.lang') || backendMessage.includes('<html'))) {
        backendMessage = 'An internal server error occurred. Please try again later.';
      }
        
      setError(backendMessage || 'We could not log you in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center px-6 py-24">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif text-foreground mb-3">Welcome back</h1>
          <p className="text-muted">Enter your details to access your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Username"
            type="text" 
            placeholder="johndoe" 
            required 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          
          <div className="relative">
            <Input 
              label="Password"
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px] text-muted hover:text-foreground focus:outline-none p-1 rounded-md focus-ring transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
              <input 
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-border-light dark:border-border-dark accent-foreground"
              />
              Remember me
            </label>
            <a href="#" className="text-sm font-medium text-muted hover:text-foreground focus-ring rounded-sm transition-colors">
              Forgot password?
            </a>
          </div>
          
          {error && (
            <div className="p-4 bg-accent-terracotta/10 text-accent-terracotta rounded-xl text-sm border border-accent-terracotta/20 animate-in fade-in zoom-in-95 duration-200">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={!isFormValid || loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <p className="text-center text-muted mt-8 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-foreground font-medium hover:underline focus-ring rounded-sm">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
