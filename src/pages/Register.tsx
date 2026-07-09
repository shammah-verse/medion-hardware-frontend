import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { authApi } from '../api/auth';
import { useAuthStore } from '../store/useAuthStore';

export function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    isStoreOwner: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const validateForm = () => {
    if (formData.username.length < 3) return 'Username must be at least 3 characters long.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Please enter a valid email address.';
    if (formData.password.length < 8) return 'Password must be at least 8 characters long.';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match.';
    return null;
  };

  // Allow submission only if basic constraints are met (prevents empty submits)
  const isFormValid = 
    formData.username.trim().length > 0 && 
    formData.email.trim().length > 0 && 
    formData.password.length > 0 && 
    formData.confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Exclude confirmPassword from the API payload
      const { confirmPassword, ...payload } = formData;
      const response = await authApi.register(payload);
      
      // Auto-login after registration if the backend provides a token
      if (response && response.token && response.user) {
        login(response.token, response.user);
        
        // Navigate based on role
        const role = response.user.role;
        if (role === 'STORE_OWNER' || role === 'VENDOR') {
          navigate('/vendor/setup');
        } else {
          navigate('/');
        }
      } else {
        // If no token is returned, redirect to login page.
        navigate('/login');
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      let backendMessage = typeof err.response?.data === 'string' 
        ? err.response.data 
        : err.response?.data?.message;
        
      // Sanitize stack traces
      if (backendMessage && (backendMessage.includes('java.lang') || backendMessage.includes('<html'))) {
        backendMessage = 'An internal server error occurred. Please try again later.';
      }
        
      setError(backendMessage || 'We could not create your account. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center px-6 py-24">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif text-foreground mb-3">Join Medion</h1>
          <p className="text-muted">Create an account to track orders and save your preferences.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="First name"
              name="firstName"
              type="text" 
              placeholder="Jane" 
              required 
              value={formData.firstName}
              onChange={handleChange}
            />
            <Input 
              label="Last name"
              name="lastName"
              type="text" 
              placeholder="Doe" 
              required 
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          
          <Input 
            label="Username"
            name="username"
            type="text" 
            placeholder="janedoe" 
            required 
            value={formData.username}
            onChange={handleChange}
          />
          
          <Input 
            label="Email address"
            name="email"
            type="email" 
            placeholder="jane@example.com" 
            required 
            value={formData.email}
            onChange={handleChange}
          />
          
          <Input 
            label="Phone number (Optional)"
            name="phoneNumber"
            type="tel" 
            placeholder="+1 (555) 000-0000" 
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Input 
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                required 
                value={formData.password}
                onChange={handleChange}
                minLength={8}
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
            
            <div className="relative">
              <Input 
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="••••••••" 
                required 
                value={formData.confirmPassword}
                onChange={handleChange}
                minLength={8}
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-[34px] text-muted hover:text-foreground focus:outline-none p-1 rounded-md focus-ring transition-colors"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-border-light dark:border-border-dark bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors group">
            <input 
              type="checkbox" 
              name="isStoreOwner"
              checked={formData.isStoreOwner}
              onChange={handleChange}
              className="w-5 h-5 accent-accent-terracotta rounded cursor-pointer"
            />
            <div className="flex flex-col">
              <span className="font-medium text-sm text-foreground group-hover:text-accent-terracotta transition-colors">Register as a Store Vendor</span>
              <span className="text-xs text-muted">Create and manage your own hardware store on our platform.</span>
            </div>
          </label>
          
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
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        <p className="text-center text-muted mt-8 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-foreground font-medium hover:underline focus-ring rounded-sm">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
