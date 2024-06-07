'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import {
  Settings,
  Building2,
  Bell,
  Shield,
  Database,
  Printer,
  Mail,
  DollarSign,
  Clock,
  Users,
  FileText,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Upload,
  Download,
  Trash2,
  RefreshCw,
} from 'lucide-react';

// Types
interface PharmacySettings {
  name: string;
  licenseNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website: string;
  taxId: string;
  logo?: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  lowStockAlerts: boolean;
  expiryAlerts: boolean;
  expiryDaysThreshold: number;
  lowStockThreshold: number;
  dailyReports: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordExpiry: number;
  loginAttempts: number;
  ipWhitelist: string[];
  auditLog: boolean;
}

interface BusinessSettings {
  currency: string;
  taxRate: number;
  invoicePrefix: string;
  invoiceStartNumber: number;
  fiscalYearStart: string;
  businessHours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
}

interface PrintSettings {
  receiptTemplate: 'standard' | 'compact' | 'detailed';
  autoprint: boolean;
  printerName: string;
  paperSize: 'A4' | 'Letter' | 'Thermal';
  includeBarcode: boolean;
  includeLogo: boolean;
}

type SettingsTab = 'pharmacy' | 'notifications' | 'security' | 'business' | 'print' | 'backup';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('pharmacy');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    setMounted(true);
    const now = new Date();
    setCurrentDate(now.toLocaleDateString());
    setCurrentDateTime(`${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`);
  }, []);

  // Pharmacy Settings
  const [pharmacySettings, setPharmacySettings] = useState<PharmacySettings>({
    name: 'PharmaCare Medical Store',
    licenseNumber: 'PH-2024-12345',
    address: '123 Healthcare Avenue',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400001',
    phone: '+91 22 1234 5678',
    email: 'contact@pharmacare.com',
    website: 'www.pharmacare.com',
    taxId: 'GSTIN123456789',
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    lowStockAlerts: true,
    expiryAlerts: true,
    expiryDaysThreshold: 30,
    lowStockThreshold: 10,
    dailyReports: true,
    weeklyReports: true,
    monthlyReports: false,
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5,
    ipWhitelist: [],
    auditLog: true,
  });

  // Business Settings
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>({
    currency: 'INR',
    taxRate: 18,
    invoicePrefix: 'INV',
    invoiceStartNumber: 1001,
    fiscalYearStart: '04-01',
    businessHours: {
      monday: { open: '09:00', close: '21:00', closed: false },
      tuesday: { open: '09:00', close: '21:00', closed: false },
      wednesday: { open: '09:00', close: '21:00', closed: false },
      thursday: { open: '09:00', close: '21:00', closed: false },
      friday: { open: '09:00', close: '21:00', closed: false },
      saturday: { open: '09:00', close: '18:00', closed: false },
      sunday: { open: '10:00', close: '18:00', closed: false },
    },
  });

  // Print Settings
  const [printSettings, setPrintSettings] = useState<PrintSettings>({
    receiptTemplate: 'standard',
    autoprint: false,
    printerName: 'Default Printer',
    paperSize: 'A4',
    includeBarcode: true,
    includeLogo: true,
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSave = () => {
    // Simulate API call
    setTimeout(() => {
      showNotification('success', 'Settings saved successfully');
      setHasChanges(false);
    }, 500);
  };

  const handleReset = () => {
    showNotification('success', 'Settings reset to defaults');
    setHasChanges(false);
  };

  const handleBackup = () => {
    const data = {
      pharmacySettings,
      notificationSettings,
      securitySettings,
      businessSettings,
      printSettings,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pharmacare-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('success', 'Settings backup downloaded');
  };

  const tabs = [
    { id: 'pharmacy' as SettingsTab, label: 'Pharmacy Info', icon: <Building2 size={16} /> },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: <Bell size={16} /> },
    { id: 'security' as SettingsTab, label: 'Security', icon: <Shield size={16} /> },
    { id: 'business' as SettingsTab, label: 'Business', icon: <DollarSign size={16} /> },
    { id: 'print' as SettingsTab, label: 'Print', icon: <Printer size={16} /> },
    { id: 'backup' as SettingsTab, label: 'Backup', icon: <Database size={16} /> },
  ];

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage your pharmacy system configuration</p>
          </div>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors"
              >
                <RefreshCw size={16} />
                Reset
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-teal-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white border border-slate-200 rounded-xl p-6 overflow-y-auto">
          {/* Pharmacy Info Tab */}
          {activeTab === 'pharmacy' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-4">Pharmacy Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Pharmacy Name</label>
                    <input
                      type="text"
                      value={pharmacySettings.name}
                      onChange={(e) => {
                        setPharmacySettings({ ...pharmacySettings, name: e.target.value });
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">License Number</label>
                    <input
                      type="text"
                      value={pharmacySettings.licenseNumber}
                      onChange={(e) => {
                        setPharmacySettings({ ...pharmacySettings, licenseNumber: e.target.value });
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Address</label>
                    <input
                      type="text"
                      value={pharmacySettings.address}
                      onChange={(e) => {
                        setPharmacySettings({ ...pharmacySettings, address: e.target.value });
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">City</label>
                    <input
                      type="text"
                      value={pharmacySettings.city}
                      onChange={(e) => {
                        setPharmacySettings({ ...pharmacySettings, city: e.target.value });
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">State</label>
                    <input
                      type="text"
                      value={pharmacySettings.state}
                      onChange={(e) => {
                        setPharmacySettings({ ...pharmacySettings, state: e.target.value });
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">ZIP Code</label>
                    <input
                      type="text"
                      value={pharmacySettings.zipCode}
                      onChange={(e) => {
                        setPharmacySettings({ ...pharmacySettings, zipCode: e.target.value });
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Phone</label>
                    <input
                      type="tel"
                      value={pharmacySettings.phone}
                      onChange={(e) => {
                        setPharmacySettings({ ...pharmacySettings, phone: e.target.value });
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={pharmacySettings.email}
                      onChange={(e) => {
                        setPharmacySettings({ ...pharmacySettings, email: e.target.value });
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Website</label>
                    <input
                      type="url"
                      value={pharmacySettings.website}
                      onChange={(e) => {
                        setPharmacySettings({ ...pharmacySettings, website: e.target.value });
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Tax ID / GSTIN</label>
                    <input
                      type="text"
                      value={pharmacySettings.taxId}
                      onChange={(e) => {
                        setPharmacySettings({ ...pharmacySettings, taxId: e.target.value });
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-sm font-semibold text-slate-800 mb-3">Logo</h3>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-slate-100 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300">
                    <Building2 size={32} className="text-slate-400" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors">
                      <Upload size={14} />
                      Upload Logo
                    </button>
                    <p className="text-xs text-slate-400">Recommended: 200x200px, PNG or JPG</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-4">Notification Preferences</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div>
                      <p className="text-sm font-medium text-slate-800">Email Notifications</p>
                      <p className="text-xs text-slate-500 mt-0.5">Receive notifications via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.emailNotifications}
                        onChange={(e) => {
                          setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked });
                          setHasChanges(true);
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div>
                      <p className="text-sm font-medium text-slate-800">SMS Notifications</p>
                      <p className="text-xs text-slate-500 mt-0.5">Receive notifications via SMS</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.smsNotifications}
                        onChange={(e) => {
                          setNotificationSettings({ ...notificationSettings, smsNotifications: e.target.checked });
                          setHasChanges(true);
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div>
                      <p className="text-sm font-medium text-slate-800">Low Stock Alerts</p>
                      <p className="text-xs text-slate-500 mt-0.5">Get notified when stock is low</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.lowStockAlerts}
                        onChange={(e) => {
                          setNotificationSettings({ ...notificationSettings, lowStockAlerts: e.target.checked });
                          setHasChanges(true);
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div>
                      <p className="text-sm font-medium text-slate-800">Expiry Alerts</p>
                      <p className="text-xs text-slate-500 mt-0.5">Get notified about expiring medicines</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.expiryAlerts}
                        onChange={(e) => {
                          setNotificationSettings({ ...notificationSettings, expiryAlerts: e.target.checked });
                          setHasChanges(true);
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-sm font-semibold text-slate-800 mb-4">Alert Thresholds</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Expiry Alert (Days Before)</label>
                    <input
                      type="number"
                      value={notificationSettings.expiryDaysThreshold}
                      onChange={(e) => {
                        setNotificationSettings({ ...notificationSettings, expiryDaysThreshold: Number(e.target.value) });
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Low Stock Threshold (Units)</label>
                    <input
                      type="number"
                      value={notificationSettings.lowStockThreshold}
                      onChange={(e) => {
                        setNotificationSettings({ ...notificationSettings, lowStockThreshold: Number(e.target.value) });
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-sm font-semibold text-slate-800 mb-4">Report Schedule</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.dailyReports}
                      onChange={(e) => {
                        setNotificationSettings({ ...notificationSettings, dailyReports: e.target.checked });
                        setHasChanges(true);
                      }}
                      className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-2 focus:ring-teal-500"
                    />
                    <span className="text-sm text-slate-700">Daily Reports</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.weeklyReports}
                      onChange={(e) => {
                        setNotificationSettings({ ...notificationSettings, weeklyReports: e.target.checked });
                        setHasChanges(true);
                      }}
                      className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-2 focus:ring-teal-500"
                    />
                    <span className="text-sm text-slate-700">Weekly Reports</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.monthlyReports}
                      onChange={(e) => {
                        setNotificationSettings({ ...notificationSettings, monthlyReports: e.target.checked });
                        setHasChanges(true);
                      }}
                      className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-2 focus:ring-teal-500"
                    />
                    <span className="text-sm text-slate-700">Monthly Reports</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-4">Security Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div>
                      <p className="text-sm font-medium text-slate-800">Two-Factor Authentication</p>
                      <p className="text-xs text-slate-500 mt-0.5">Add an extra layer of security</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securitySettings.twoFactorAuth}
                        onChange={(e) => {
                          setSecuritySettings({ ...securitySettings, twoFactorAuth: e.target.checked });
                          setHasChanges(true);
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div>
                      <p className="text-sm font-medium text-slate-800">Audit Log</p>
                      <p className="text-xs text-slate-500 mt-0.5">Track all system activities</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securitySettings.auditLog}
                        onChange={(e) => {
                          setSecuritySettings({ ...securitySettings, auditLog: e.target.checked });
                          setHasChanges(true);
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-sm font-semibold text-slate-800 mb-4">Session & Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => {
                        setSecuritySettings({ ...securitySettings, sessionTimeout: Number(e.target.value) });
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Password Expiry (days)</label>
                    <input
                      type="number"
                      value={securitySettings.passwordExpiry}
                      onChange={(e) => {
                        setSecuritySettings({ ...securitySettings, passwordExpiry: Number(e.target.value) });
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Max Login Attempts</label>
                    <input
                      type="number"
                      value={securitySettings.loginAttempts}
                      onChange={(e) => {
                        setSecuritySettings({ ...securitySettings, loginAttempts: Number(e.target.value) });
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Business Tab */}
          {activeTab === 'business' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-4">Business Configuration</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Currency</label>
                    <select
                      value={businessSettings.currency}
                      onChange={(e) => {
                        setBusinessSettings({ ...businessSettings, currency: e.target.value });
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Tax Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={businessSettings.taxRate}
                      onChange={(e) => {
                        setBusinessSettings({ ...businessSettings, taxRate: Number(e.target.value) });
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Invoice Prefix</label>
                    <input
                      type="text"
                      value={businessSettings.invoicePrefix}
                      onChange={(e) => {
                        setBusinessSettings({ ...businessSettings, invoicePrefix: e.target.value });
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Invoice Start Number</label>
                    <input
                      type="number"
                      value={businessSettings.invoiceStartNumber}
                      onChange={(e) => {
                        setBusinessSettings({ ...businessSettings, invoiceStartNumber: Number(e.target.value) });
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Fiscal Year Start (MM-DD)</label>
                    <input
                      type="text"
                      value={businessSettings.fiscalYearStart}
                      onChange={(e) => {
                        setBusinessSettings({ ...businessSettings, fiscalYearStart: e.target.value });
                        setHasChanges(true);
                      }}
                      placeholder="04-01"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-sm font-semibold text-slate-800 mb-4">Business Hours</h3>
                <div className="space-y-3">
                  {Object.entries(businessSettings.businessHours).map(([day, hours]) => (
                    <div key={day} className="flex items-center gap-4">
                      <div className="w-24">
                        <p className="text-sm font-medium text-slate-700 capitalize">{day}</p>
                      </div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!hours.closed}
                          onChange={(e) => {
                            setBusinessSettings({
                              ...businessSettings,
                              businessHours: {
                                ...businessSettings.businessHours,
                                [day]: { ...hours, closed: !e.target.checked },
                              },
                            });
                            setHasChanges(true);
                          }}
                          className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-2 focus:ring-teal-500"
                        />
                        <span className="text-xs text-slate-600">Open</span>
                      </label>
                      {!hours.closed && (
                        <>
                          <input
                            type="time"
                            value={hours.open}
                            onChange={(e) => {
                              setBusinessSettings({
                                ...businessSettings,
                                businessHours: {
                                  ...businessSettings.businessHours,
                                  [day]: { ...hours, open: e.target.value },
                                },
                              });
                              setHasChanges(true);
                            }}
                            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                          <span className="text-slate-400">to</span>
                          <input
                            type="time"
                            value={hours.close}
                            onChange={(e) => {
                              setBusinessSettings({
                                ...businessSettings,
                                businessHours: {
                                  ...businessSettings.businessHours,
                                  [day]: { ...hours, close: e.target.value },
                                },
                              });
                              setHasChanges(true);
                            }}
                            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </>
                      )}
                      {hours.closed && <span className="text-sm text-slate-400">Closed</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Print Tab */}
          {activeTab === 'print' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-4">Print Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Receipt Template</label>
                    <select
                      value={printSettings.receiptTemplate}
                      onChange={(e) => {
                        setPrintSettings({ ...printSettings, receiptTemplate: e.target.value as any });
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="standard">Standard</option>
                      <option value="compact">Compact</option>
                      <option value="detailed">Detailed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Paper Size</label>
                    <select
                      value={printSettings.paperSize}
                      onChange={(e) => {
                        setPrintSettings({ ...printSettings, paperSize: e.target.value as any });
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="A4">A4</option>
                      <option value="Letter">Letter</option>
                      <option value="Thermal">Thermal (80mm)</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Printer Name</label>
                    <input
                      type="text"
                      value={printSettings.printerName}
                      onChange={(e) => {
                        setPrintSettings({ ...printSettings, printerName: e.target.value });
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-sm font-semibold text-slate-800 mb-4">Print Options</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={printSettings.autoprint}
                      onChange={(e) => {
                        setPrintSettings({ ...printSettings, autoprint: e.target.checked });
                        setHasChanges(true);
                      }}
                      className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-2 focus:ring-teal-500"
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-700">Auto-print receipts</p>
                      <p className="text-xs text-slate-500">Automatically print after each sale</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={printSettings.includeBarcode}
                      onChange={(e) => {
                        setPrintSettings({ ...printSettings, includeBarcode: e.target.checked });
                        setHasChanges(true);
                      }}
                      className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-2 focus:ring-teal-500"
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-700">Include barcode</p>
                      <p className="text-xs text-slate-500">Add barcode to receipts</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={printSettings.includeLogo}
                      onChange={(e) => {
                        setPrintSettings({ ...printSettings, includeLogo: e.target.checked });
                        setHasChanges(true);
                      }}
                      className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-2 focus:ring-teal-500"
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-700">Include logo</p>
                      <p className="text-xs text-slate-500">Add pharmacy logo to receipts</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-sm font-semibold text-slate-800 mb-3">Preview</h3>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 max-w-md">
                  <div className="text-center mb-4">
                    <p className="text-sm font-bold text-slate-800">{pharmacySettings.name}</p>
                    <p className="text-xs text-slate-600">{pharmacySettings.address}</p>
                    <p className="text-xs text-slate-600">{pharmacySettings.phone}</p>
                  </div>
                  <div className="border-t border-slate-300 my-3"></div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Invoice #:</span>
                      <span className="font-medium">{businessSettings.invoicePrefix}-{businessSettings.invoiceStartNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">{mounted ? currentDate : '...'}</span>
                    </div>
                  </div>
                  <div className="border-t border-slate-300 my-3"></div>
                  <p className="text-xs text-center text-slate-500">Thank you for your purchase!</p>
                </div>
              </div>
            </div>
          )}

          {/* Backup Tab */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-4">Backup & Restore</h2>
                <p className="text-sm text-slate-600 mb-6">
                  Regularly backup your data to prevent loss. You can export all settings and restore them later.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Download size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Export Settings</p>
                        <p className="text-xs text-slate-500">Download configuration backup</p>
                      </div>
                    </div>
                    <button
                      onClick={handleBackup}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <Download size={14} />
                      Export Backup
                    </button>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Upload size={20} className="text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Import Settings</p>
                        <p className="text-xs text-slate-500">Restore from backup file</p>
                      </div>
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors">
                      <Upload size={14} />
                      Import Backup
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-sm font-semibold text-slate-800 mb-4">Database Backup</h3>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-slate-800">Last Backup</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {mounted ? currentDateTime : 'Loading...'}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                      Up to date
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors">
                      <Database size={14} />
                      Backup Now
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors">
                      <RefreshCw size={14} />
                      Restore
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-sm font-semibold text-slate-800 mb-4">Automatic Backups</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-2 focus:ring-teal-500"
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-700">Enable automatic backups</p>
                      <p className="text-xs text-slate-500">Backup data daily at midnight</p>
                    </div>
                  </label>
                  <div className="ml-7">
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Retention Period (days)</label>
                    <input
                      type="number"
                      defaultValue={30}
                      className="w-32 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-red-800 mb-1">Danger Zone</p>
                      <p className="text-xs text-red-700 mb-3">
                        These actions are irreversible. Please be certain before proceeding.
                      </p>
                      <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">
                        <Trash2 size={14} />
                        Reset All Settings
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
              notification.type === 'success'
                ? 'bg-emerald-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
// Commit on 2024-06-20 at 13:18
// Commit on 2024-06-3 at 18:15
// Commit on 2024-06-7 at 10:53
