import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function Profile() {
  const { profile, login, accessToken } = useAuthStore();
  
  const [firstName, setFirstName] = useState(profile?.firstName || '');
  const [lastName, setLastName] = useState(profile?.lastName || '');
  const [email, setEmail] = useState(profile?.email || '');
  
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      // Mock API delay for profile update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (profile && accessToken) {
        // Update local state to reflect the mock success
        login(accessToken, {
          ...profile,
          firstName,
          lastName,
          email
        });
        setMessage('Profile updated successfully.');
      }
    } catch (err) {
      setMessage('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-24 lg:px-8 w-full min-h-[70vh]">
      <h1 className="text-4xl font-serif text-foreground mb-10">Personal Details</h1>
      
      <div className="bg-black/5 dark:bg-white/5 p-8 rounded-[32px] border border-border-light dark:border-border-dark">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <Input 
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          
          <Input 
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Input 
            label="Username"
            value={profile?.username || ''}
            disabled
          />
          
          {message && (
            <div className={`p-4 rounded-xl text-sm ${message.includes('success') ? 'bg-accent-sage/10 text-accent-sage border border-accent-sage/20' : 'bg-accent-terracotta/10 text-accent-terracotta border border-accent-terracotta/20'}`}>
              {message}
            </div>
          )}
          
          <div className="pt-6 border-t border-border-light dark:border-border-dark flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
