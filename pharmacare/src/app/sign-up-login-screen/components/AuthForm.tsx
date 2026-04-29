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
  { role: 'Administrator', email: 'admin@pharmacare.et', password: 'Pharma@2026' },
  { role: 'Pharmacist', email: 'tigist.haile@pharmacare.et', password: 'Staff@2026' },
  { role: 'Inventory Manager', email: 'dawit.tesfaye@pharmacare.et', password: 'Invent@2026' },
  { role: 'Cashier', email: 'meron.bekele@pharmacare.et', password: 'Cashier@2026' },
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

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-700 flex-col p-10 relative overflow-hidden">
        {/* Animated background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-emerald-600/30 blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute -bottom-10 -left-10 w-80 h-80 rounded-full bg-teal-700/40 blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-white/5 blur-2xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }} />
        </div>

        {/* Logo with animation */}
        <div className="relative flex items-center gap-3 mb-12 animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-xl blur-xl animate-pulse" style={{ animationDuration: '3s' }} />
            <AppLogo size={40} />
          </div>
          <span className="text-white font-bold text-2xl tracking-tight drop-shadow-lg">PharmaCare</span>
        </div>

        {/* Hero text with staggered animation */}
        <div className="relative flex-1 flex flex-col justify-center">
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6 animate-slide-up">
            Complete Pharmacy
            <br />
            <span className="text-emerald-200 bg-gradient-to-r from-emerald-200 to-teal-100 bg-clip-text text-transparent">
              Management
            </span>{' '}
            in
            <br />
            one place.
          </h1>
          <p className="text-emerald-50 text-lg leading-relaxed mb-12 max-w-md animate-slide-up" style={{ animationDelay: '0.1s' }}>
            From counter sales to batch expiry tracking — PharmaCare keeps your pharmacy running smoothly and compliantly.
          </p>

          {/* Feature list with staggered animations */}
          <div className="space-y-5">
            {[
              {
                icon: <Pill size={20} />,
                title: 'Medicine Inventory',
                desc: 'Track stock, batches, and expiry dates',
              },
              {
                icon: <BarChart3 size={20} />,
                title: 'Sales Analytics',
                desc: 'Daily revenue, margin, and trend reports',
              },
              {
                icon: <Package size={20} />,
                title: 'Batch Management',
                desc: 'FIFO dispensing, expiry alerts, recalls',
              },
              {
                icon: <ShieldCheck size={20} />,
                title: 'Compliance Ready',
                desc: 'Prescription logs, audit trails, GST support',
              },
            ].map((f, i) => (
              <div
                key={i}
                className="flex items-start gap-4 animate-slide-up group hover:translate-x-2 transition-transform duration-300"
                style={{ animationDelay: `${0.2 + i * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0 text-emerald-100 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300 shadow-lg">
                  {f.icon}
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-base mb-1">{f.title}</p>
                  <p className="text-emerald-100 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom badge with animation */}
        <div className="relative mt-10 flex items-center gap-2 text-emerald-100 text-sm animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <ShieldCheck size={16} className="flex-shrink-0" />
          <span>HIPAA-aligned data handling · End-to-end encrypted</span>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10 bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden animate-fade-in">
            <AppLogo size={32} />
            <span className="font-bold text-slate-800 text-lg">PharmaCare</span>
          </div>

          {/* Login Form Card */}
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 animate-slide-up">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome back</h2>
              <p className="text-base text-slate-500">
                Sign in to your PharmaCare account
              </p>
            </div>

            <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-5">
              {/* Email */}
              <div className="group">
                <label className="form-label text-sm font-semibold text-slate-700">Email address</label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10 group-focus-within:text-emerald-600 transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="abebe@pharmacare.et"
                    className={`form-input pl-12 h-12 text-base border-2 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all ${
                      loginForm.formState.errors.email ? 'form-input-error border-red-300' : 'border-slate-200'
                    }`}
                    {...loginForm.register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: emailPattern,
                        message: 'Enter a valid email address',
                      },
                    })}
                  />
                </div>
                {loginForm.formState.errors.email && (
                  <p className="form-error mt-1.5 text-sm">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="group">
                <div className="flex items-center justify-between mb-2">
                  <label className="form-label text-sm font-semibold text-slate-700 mb-0">Password</label>
                  <button
                    type="button"
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10 group-focus-within:text-emerald-600 transition-colors"
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className={`form-input pl-12 pr-12 h-12 text-base border-2 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all ${
                      loginForm.formState.errors.password ? 'form-input-error border-red-300' : 'border-slate-200'
                    }`}
                    {...loginForm.register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Minimum 6 characters' },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="form-error mt-1.5 text-sm">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 focus:ring-2 cursor-pointer"
                  {...loginForm.register('rememberMe')}
                />
                <label htmlFor="rememberMe" className="text-sm text-slate-600 cursor-pointer select-none">
                  Keep me signed in for 30 days
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base font-semibold mt-6 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Demo credentials */}
            <div className="mt-8 border-2 border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-3 border-b border-slate-200">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck size={14} />
                  Demo Accounts - Quick Access
                </p>
              </div>
              <div className="divide-y divide-slate-100 bg-white">
                {demoCredentials.map((cred, i) => (
                  <div
                    key={i}
                    className="px-4 py-3 flex items-center justify-between hover:bg-emerald-50/50 transition-all duration-200 group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 mb-1">{cred.role}</p>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs text-slate-600 font-mono truncate">
                          {cred.email}
                        </p>
                        <CopyButton text={cred.email} />
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-slate-500 font-mono">{cred.password}</p>
                        <CopyButton text={cred.password} />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => fillCredentials(cred)}
                      className="ml-4 text-sm bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-all flex-shrink-0 shadow-sm hover:shadow-md group-hover:scale-105 duration-200"
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
