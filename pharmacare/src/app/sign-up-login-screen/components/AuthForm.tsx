'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Copy,
  Check,
  ShieldCheck,
  Pill,
  BarChart3,
  Package,
  ArrowRight,
  Loader2,
} from 'lucide-react';

type LoginFormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

const demoCredentials = [
  { role: 'Administrator', email: 'admin@pharmacare.et', password: 'password123' },
  { role: 'Pharmacist', email: 'pharmacist@pharmacare.et', password: 'password123' },
  { role: 'Inventory Manager', email: 'inventory@pharmacare.et', password: 'password123' },
  { role: 'Cashier', email: 'cashier@pharmacare.et', password: 'password123' },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded hover:bg-slate-200 transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check size={12} className="text-teal-600" />
      ) : (
        <Copy size={12} className="text-slate-400" />
      )}
    </button>
  );
}

export default function AuthForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const loginForm = useForm<LoginFormData>({
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const handleLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const { api } = await import('@/lib/api');
      await api.login(data.email, data.password);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      toast.success(`Welcome back, ${user.fullName}!`);
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const fillCredentials = (cred: (typeof demoCredentials)[0]) => {
    loginForm.setValue('email', cred.email);
    loginForm.setValue('password', cred.password);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 bg-gradient-to-br from-teal-800 via-teal-700 to-teal-600 flex-col p-10 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-teal-600/40" />
          <div className="absolute -bottom-10 -left-10 w-56 h-56 rounded-full bg-teal-800/60" />
          <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-white/5" />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3 mb-12">
          <AppLogo size={40} />
          <span className="text-white font-bold text-xl tracking-tight">PharmaCare</span>
        </div>

        {/* Hero text */}
        <div className="relative flex-1 flex flex-col justify-center">
          <h1 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-4">
            Complete Pharmacy
            <br />
            <span className="text-teal-200">Management</span> in
            <br />
            one place.
          </h1>
          <p className="text-teal-100 text-base leading-relaxed mb-10 max-w-sm">
            From counter sales to batch expiry tracking — PharmaCare keeps your pharmacy running smoothly and compliantly.
          </p>

          {/* Feature list */}
          <div className="space-y-4">
            {[
              {
                icon: <Pill size={18} />,
                title: 'Medicine Inventory',
                desc: 'Track stock, batches, and expiry dates',
              },
              {
                icon: <BarChart3 size={18} />,
                title: 'Sales Analytics',
                desc: 'Daily revenue, margin, and trend reports',
              },
              {
                icon: <Package size={18} />,
                title: 'Batch Management',
                desc: 'FIFO dispensing, expiry alerts, recalls',
              },
              {
                icon: <ShieldCheck size={18} />,
                title: 'Compliance Ready',
                desc: 'Prescription logs, audit trails, GST support',
              },
            ].map((f, i) => (
              <div key={`feature-${i}`} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0 text-teal-100">
                  {f.icon}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{f.title}</p>
                  <p className="text-teal-200 text-xs">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom badge */}
        <div className="relative mt-8 flex items-center gap-2 text-teal-200 text-xs">
          <ShieldCheck size={14} />
          <span>HIPAA-aligned data handling · End-to-end encrypted</span>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <AppLogo size={32} />
            <span className="font-bold text-slate-800 text-lg">PharmaCare</span>
          </div>

          {/* Login Form */}
          <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Welcome back</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Sign in to your PharmaCare account
                </p>
              </div>

              <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="form-label">Email address</label>
                  <div className="relative">
                    <Mail
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10"
                    />
                    <input
                      type="email"
                      placeholder="abebe@pharmacare.et"
                      className={`form-input ${
                        loginForm.formState.errors.email ? 'form-input-error' : ''
                      }`}
                      style={{ paddingLeft: '2.5rem' }}
                      {...loginForm.register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Enter a valid email address',
                        },
                      })}
                    />
                  </div>
                  {loginForm.formState.errors.email && (
                    <p className="form-error">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="form-label mb-0">Password</label>
                    <button
                      type="button"
                      className="text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10"
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className={`form-input pr-10 ${
                        loginForm.formState.errors.password ? 'form-input-error' : ''
                      }`}
                      style={{ paddingLeft: '2.5rem' }}
                      {...loginForm.register('password', {
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Minimum 6 characters' },
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="form-error">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                {/* Remember me */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    {...loginForm.register('rememberMe')}
                  />
                  <label htmlFor="rememberMe" className="text-sm text-slate-600 cursor-pointer">
                    Keep me signed in for 30 days
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2"
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              {/* Demo credentials */}
              <div className="mt-6 border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Demo Accounts
                  </p>
                </div>
                <div className="divide-y divide-slate-100">
                  {demoCredentials.map((cred, i) => (
                    <div
                      key={`demo-${i}`}
                      className="px-4 py-2.5 flex items-center justify-between hover:bg-teal-50/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-700">{cred.role}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <p className="text-xs text-slate-500 font-mono truncate">
                            {cred.email}
                          </p>
                          <CopyButton text={cred.email} />
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <p className="text-xs text-slate-400 font-mono">{cred.password}</p>
                          <CopyButton text={cred.password} />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => fillCredentials(cred)}
                        className="ml-3 text-xs bg-teal-50 text-teal-700 border border-teal-200 px-3 py-1.5 rounded-lg font-medium hover:bg-teal-100 transition-colors flex-shrink-0"
                      >
                        Use
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}