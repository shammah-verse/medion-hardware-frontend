import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { authApi } from '../api/auth';
import { useAuthStore } from '../store/useAuthStore';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Execute API call
      const response = await authApi.login({ username, password });
      
      // Update global store
      login(response.token, response.user);
      
      // Navigate based on role
      const role = response.user.role;
      if (role === 'STORE_OWNER') {
        navigate('/vendor/dashboard');
      } else if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      console.error("Login error:", err);
      // Surface raw backend error to the UI
      const backendMessage = typeof err.response?.data === 'string' 
        ? err.response.data 
        : err.response?.data?.message;
        
      setError(backendMessage || err.message || 'We could not log you in. Please check your credentials.');
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
          <Input 
            label="Password"
            type="password" 
            placeholder="••••••••" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          {error && (
            <div className="p-4 bg-accent-terracotta/10 text-accent-terracotta rounded-xl text-sm border border-accent-terracotta/20">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
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
