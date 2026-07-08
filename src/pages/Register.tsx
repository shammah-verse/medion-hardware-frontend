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
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.register(formData);
      
      // Auto-login after registration
      login(response.token, response.user);
      
      // Navigate to home or dashboard
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'We could not create your account. Please check your details and try again.');
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
