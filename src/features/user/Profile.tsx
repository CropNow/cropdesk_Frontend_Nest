import React, { useState } from 'react';
import {
  User,
  Settings,
  Bell,
  Shield,
  MapPin,
  LogOut,
  Camera,
  ChevronRight,
  Smartphone,
  Mail,
  Globe,
  ExternalLink,
} from 'lucide-react';

const Profile = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    weather: true,
    alerts: true,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <main className="min-h-screen bg-background text-foreground pb-20 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto pt-16 md:pt-0">
        <header className="mb-10 text-center lg:text-left">
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and farm preferences.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Avatar and Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border border-border rounded-3xl p-8 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 bg-muted flex items-center justify-center">
                  <User size={64} className="text-muted-foreground" />
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform">
                  <Camera size={18} />
                </button>
              </div>
              <h2 className="text-2xl font-bold mb-1">Malturia Akhila</h2>
              <p className="text-sm text-muted-foreground mb-4">
                REVA University • Bangalore
              </p>
              <div className="w-full h-px bg-border mb-4"></div>
              <div className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
                <Smartphone size={14} />
                Mobile Verified
              </div>
            </div>

            <div className="bg-card border border-border rounded-3xl p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Shield size={18} className="text-primary" />
                Governance & Security
              </h3>
              <div className="space-y-4">
                <div className="text-sm flex items-center justify-between group cursor-pointer">
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                    Change Password
                  </span>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </div>
                <div className="text-sm flex items-center justify-between group cursor-pointer">
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                    Two-Factor Auth
                  </span>
                  <span className="text-[10px] font-bold text-green-500 uppercase">
                    Enabled
                  </span>
                </div>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 p-4 text-red-500 font-bold bg-red-500/5 border border-red-500/10 rounded-2xl hover:bg-red-500/10 transition-colors">
              <LogOut size={20} />
              Sign Out
            </button>
          </div>

          {/* Right Column: Settings and Tabs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Farm Information */}
            <div className="bg-card border border-border rounded-3xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <MapPin className="text-primary" />
                  Farm Information
                </h3>
                <button className="text-xs font-bold text-primary uppercase hover:underline">
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-muted-foreground block mb-2">
                    Location Name
                  </label>
                  <p className="font-medium p-3 bg-muted/50 border border-border rounded-xl">
                    Plot A-12 • Main Farm
                  </p>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-muted-foreground block mb-2">
                    Primary Crop
                  </label>
                  <p className="font-medium p-3 bg-muted/50 border border-border rounded-xl">
                    Hybrid Maize
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground block mb-2">
                    Coordinates
                  </label>
                  <div className="flex items-center gap-2 p-3 bg-muted/50 border border-border rounded-xl font-mono text-sm">
                    13.1256° N, 77.5910° E
                    <ExternalLink
                      size={12}
                      className="text-primary ml-auto cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-card border border-border rounded-3xl p-8">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                <Bell className="text-primary" />
                Notification Settings
              </h3>
              <div className="space-y-6">
                <NotificationToggle
                  label="Email Notifications"
                  description="Receive daily sensor reports and weekly farm stats via email."
                  enabled={notifications.email}
                  onToggle={() => toggleNotification('email')}
                />
                <NotificationToggle
                  label="Push Notifications"
                  description="Real-time alerts for critical sensor readings on your mobile device."
                  enabled={notifications.push}
                  onToggle={() => toggleNotification('push')}
                />
                <NotificationToggle
                  label="Weather Alerts"
                  description="Stay updated with unexpected rain or temperature changes."
                  enabled={notifications.weather}
                  onToggle={() => toggleNotification('weather')}
                />
              </div>
            </div>

            {/* Connected Apps */}
            <div className="bg-card border border-border rounded-3xl p-8">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                <Globe className="text-primary" />
                Connected Integrations
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Google Workspace</h4>
                      <p className="text-xs text-muted-foreground text-ellipsis">
                        backup-logs@reva.edu.in
                      </p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-muted-foreground hover:text-red-500 transition-colors">
                    Disconnect
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const NotificationToggle = ({
  label,
  description,
  enabled,
  onToggle,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) => (
  <div className="flex items-center justify-between gap-4">
    <div className="flex-1">
      <h4 className="font-bold text-sm mb-1">{label}</h4>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
    <button
      onClick={onToggle}
      className={`w-12 h-6 rounded-full transition-colors relative ${enabled ? 'bg-primary' : 'bg-muted'}`}
    >
      <div
        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0'}`}
      ></div>
    </button>
  </div>
);

export default Profile;
