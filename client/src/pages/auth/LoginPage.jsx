import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const LoginPage = () => {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});
    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back to RentKart!');
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      const resData = err.response?.data;

      // Handle unverified email redirection
      if (resData?.error?.code === 'EMAIL_NOT_VERIFIED' || resData?.error?.details?.requiresVerification) {
        toast.info('Please verify your email to activate your account.');
        navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
        return;
      }

      toast.error(resData?.error?.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-floating">
        
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto mb-4 shadow-md shadow-brand-500/20">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Log in to RentKart
          </h2>
          <p className="mt-2 text-xs text-slate-500">
            Rent gear or manage your peer listings in seconds
          </p>
        </div>

        {/* Demo Credentials Helper Pill */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600 space-y-1">
          <p className="font-semibold text-slate-800">Demo Accounts (Password: Demo@1234):</p>
          <div className="flex flex-wrap gap-2 text-[11px] pt-1">
            <button
              type="button"
              onClick={() => setFormData({ email: 'owner1@rentkart.com', password: 'Demo@1234' })}
              className="bg-white px-2 py-0.5 rounded border border-slate-200 hover:border-brand-500 text-slate-700 font-mono"
            >
              owner1@rentkart.com
            </button>
            <button
              type="button"
              onClick={() => setFormData({ email: 'renter1@rentkart.com', password: 'Demo@1234' })}
              className="bg-white px-2 py-0.5 rounded border border-slate-200 hover:border-brand-500 text-slate-700 font-mono"
            >
              renter1@rentkart.com
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            startIcon={Mail}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            startIcon={Lock}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full mt-2 font-semibold shadow-md"
          >
            <span>Sign In</span>
            {!isLoading && <ArrowRight className="w-4 h-4 ml-1" />}
          </Button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};
