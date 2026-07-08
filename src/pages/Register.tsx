import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { authApi } from '../api/auth';
import { useAuthStore } from '../store/useAuthStore';

export function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    phoneNumber: '',
    isStoreOwner: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.register(formData);
      
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
        // If no token is returned (e.g. backend just returns 201 Created), force user to login manually.
        navigate('/login');
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      // Sometimes Spring Boot returns errors in err.response.data (if it's a string)
      const backendMessage = typeof err.response?.data === 'string' 
        ? err.response.data 
        : err.response?.data?.message;
        
      setError(backendMessage || err.message || 'We could not create your account. Please check your details and try again.');
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
            label="Phone number"
            name="phoneNumber"
            type="tel" 
            placeholder="+1 (555) 000-0000" 
            required 
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          <Input 
            label="Password"
            name="password"
            type="password" 
            placeholder="••••••••" 
            required 
            value={formData.password}
            onChange={handleChange}
            minLength={8}
          />

          <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-border-light dark:border-border-dark bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
            <input 
              type="checkbox" 
              name="isStoreOwner"
              checked={formData.isStoreOwner}
              onChange={handleChange}
              className="w-5 h-5 accent-accent-terracotta rounded"
            />
            <div className="flex flex-col">
              <span className="font-medium text-sm text-foreground">Register as a Store Vendor</span>
              <span className="text-xs text-muted">Create and manage your own hardware store on our platform.</span>
            </div>
          </label>
          
          {error && (
            <div className="p-4 bg-accent-terracotta/10 text-accent-terracotta rounded-xl text-sm border border-accent-terracotta/20">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
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
