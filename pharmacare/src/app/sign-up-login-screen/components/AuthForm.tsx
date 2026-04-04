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
  User,
  Building2,
  Copy,
  Check,
  ShieldCheck,
  Pill,
  BarChart3,
  Package,
  ArrowRight,
  Loader2,
  ChevronDown,
} from 'lucide-react';

type LoginFormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type RegisterFormData = {
  fullName: string;
  pharmacyName: string;
  role: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
};

const demoCredentials = [
  { role: 'Head Pharmacist', email: 'abebe.bekele@pharmacare.et', password: 'Pharma@2026' },
  { role: 'Counter Staff', email: 'tigist.haile@pharmacare.et', password: 'Staff@2026' },
  { role: 'Inventory Manager', email: 'dawit.tesfaye@pharmacare.et', password: 'Invent@2026' },
];

const roleOptions = [
  { value: 'head_pharmacist', label: 'Head Pharmacist' },
  { value: 'pharmacist', label: 'Pharmacist' },
  { value: 'counter_staff', label: 'Counter Staff' },
  { value: 'inventory_manager', label: 'Inventory Manager' },
  { value: 'admin', label: 'Pharmacy Admin' },
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
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const loginForm = useForm<LoginFormData>({
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const registerForm = useForm<RegisterFormData>({
    defaultValues: {
      fullName: '',
      pharmacyName: '',
      role: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    },
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

  const handleRegisterSubmit = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      registerForm.setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }
    setIsLoading(true);
    try {
      const { api } = await import('@/lib/api');
      await api.register({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        pharmacyName: data.pharmacyName,
        role: data.role,
      });
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
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

          {/* Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
            {(['login', 'register'] as const).map((tab) => (
              <button
                key={`tab-${tab}`}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-white text-teal-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Login Form */}
          {activeTab === 'login' && (
            <div className="animate-fade-in">
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
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Create account</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Set up your pharmacy on PharmaCare
                </p>
              </div>

              <form
                onSubmit={registerForm.handleSubmit(handleRegisterSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full name */}
                  <div>
                    <label className="form-label">Full name</label>
                    <div className="relative">
                      <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                      <input
                        type="text"
                        placeholder="Abebe Bekele"
                        className={`form-input ${registerForm.formState.errors.fullName ? 'form-input-error' : ''}`}
                        style={{ paddingLeft: '2.5rem' }}
                        {...registerForm.register('fullName', {
                          required: 'Full name is required',
                          minLength: { value: 2, message: 'At least 2 characters' },
                        })}
                      />
                    </div>
                    {registerForm.formState.errors.fullName && (
                      <p className="form-error">{registerForm.formState.errors.fullName.message}</p>
                    )}
                  </div>

                  {/* Pharmacy name */}
                  <div>
                    <label className="form-label">Pharmacy name</label>
                    <div className="relative">
                      <Building2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                      <input
                        type="text"
                        placeholder="City Pharmacy"
                        className={`form-input ${registerForm.formState.errors.pharmacyName ? 'form-input-error' : ''}`}
                        style={{ paddingLeft: '2.5rem' }}
                        {...registerForm.register('pharmacyName', {
                          required: 'Pharmacy name is required',
                        })}
                      />
                    </div>
                    {registerForm.formState.errors.pharmacyName && (
                      <p className="form-error">{registerForm.formState.errors.pharmacyName.message}</p>
                    )}
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="form-label">Your role</label>
                  <p className="text-xs text-slate-400 mb-1.5">
                    Determines your access level within PharmaCare
                  </p>
                  <div className="relative">
                    <select
                      className={`form-input appearance-none pr-9 ${registerForm.formState.errors.role ? 'form-input-error' : ''}`}
                      {...registerForm.register('role', { required: 'Please select your role' })}
                    >
                      <option value="">Select your role...</option>
                      {roleOptions.map((r) => (
                        <option key={`role-${r.value}`} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                  {registerForm.formState.errors.role && (
                    <p className="form-error">{registerForm.formState.errors.role.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="form-label">Work email</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                    <input
                      type="email"
                      placeholder="abebe@pharmacy.et"
                      className={`form-input ${registerForm.formState.errors.email ? 'form-input-error' : ''}`}
                      style={{ paddingLeft: '2.5rem' }}
                      {...registerForm.register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Enter a valid email',
                        },
                      })}
                    />
                  </div>
                  {registerForm.formState.errors.email && (
                    <p className="form-error">{registerForm.formState.errors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="form-label">Password</label>
                  <p className="text-xs text-slate-400 mb-1.5">
                    Minimum 8 characters, include a number and symbol
                  </p>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      className={`form-input pr-10 ${registerForm.formState.errors.password ? 'form-input-error' : ''}`}
                      style={{ paddingLeft: '2.5rem' }}
                      {...registerForm.register('password', {
                        required: 'Password is required',
                        minLength: { value: 8, message: 'Minimum 8 characters' },
                        pattern: {
                          value: /^(?=.*[0-9])(?=.*[!@#$%^&*])/,
                          message: 'Include at least one number and one symbol',
                        },
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {registerForm.formState.errors.password && (
                    <p className="form-error">{registerForm.formState.errors.password.message}</p>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label className="form-label">Confirm password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Repeat your password"
                      className={`form-input pr-10 ${registerForm.formState.errors.confirmPassword ? 'form-input-error' : ''}`}
                      style={{ paddingLeft: '2.5rem' }}
                      {...registerForm.register('confirmPassword', {
                        required: 'Please confirm your password',
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {registerForm.formState.errors.confirmPassword && (
                    <p className="form-error">{registerForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Terms */}
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 mt-0.5"
                    {...registerForm.register('agreeTerms', {
                      required: 'You must agree to the terms',
                    })}
                  />
                  <label htmlFor="agreeTerms" className="text-sm text-slate-600 cursor-pointer leading-relaxed">
                    I agree to PharmaCare&apos;s{' '}
                    <span className="text-teal-600 hover:text-teal-700 font-medium cursor-pointer">
                      Terms of Service
                    </span>{' '}
                    and{' '}
                    <span className="text-teal-600 hover:text-teal-700 font-medium cursor-pointer">
                      Privacy Policy
                    </span>
                  </label>
                </div>
                {registerForm.formState.errors.agreeTerms && (
                  <p className="form-error">{registerForm.formState.errors.agreeTerms.message}</p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3"
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}