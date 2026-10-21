import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { BottomSheet } from './BottomSheet';
import { UserRole } from '../types';
import {
  Bell,
  WifiOff,
  Wifi,
  Building,
  Shield,
  RotateCcw,
  LogOut,
  ChevronRight,
  UserCheck,
  Lock
} from 'lucide-react';

export const UserMenuSheet: React.FC = () => {
  const isUserMenuOpen = useAppStore((s) => s.isUserMenuOpen);
  const setUserMenuOpen = useAppStore((s) => s.setUserMenuOpen);
  const currentUser = useAppStore((s) => s.currentUser);
  const switchRole = useAppStore((s) => s.switchRole);
  const signOut = useAppStore((s) => s.signOut);
  const isOffline = useAppStore((s) => s.isOffline);
  const toggleOffline = useAppStore((s) => s.toggleOffline);
  const resetDemoData = useAppStore((s) => s.resetDemoData);
  const pushScreen = useAppStore((s) => s.pushScreen);
  const notifications = useAppStore((s) => s.notifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const roles: { role: UserRole; label: string; desc: string }[] = [
    { role: 'admin', label: 'Admin', desc: 'Full company access, user & system controls' },
    { role: 'supervisor', label: 'Site Supervisor', desc: 'Job site ops, task assigning, read-only settings' },
    { role: 'mechanic', label: 'Mechanic', desc: 'Service tickets, asset log & close-outs' },
    { role: 'storekeeper', label: 'Storekeeper', desc: 'Tool crib checkout, QR scan, inventory additions' }
  ];

  const handleRoleSelect = (r: UserRole) => {
    switchRole(r);
  };

  const handleOpenNotifications = () => {
    setUserMenuOpen(false);
    pushScreen({ type: 'notifications' });
  };

  const handleOpenCompanySettings = () => {
    setUserMenuOpen(false);
    pushScreen({ type: 'company_settings' });
  };

  const canAccessCompanySettings = currentUser.role === 'admin' || currentUser.role === 'supervisor';

  return (
    <BottomSheet
      isOpen={isUserMenuOpen}
      onClose={() => setUserMenuOpen(false)}
      title="User & Account"
      subtitle={currentUser.email}
    >
      <div className="space-y-4">
        {/* User Card */}
        <div className="bg-white p-3.5 rounded-2xl border border-black/6 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#1C1D1F] text-white flex items-center justify-center text-sm font-bold shadow-xs">
            {currentUser.initials}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-[#1C1D1F] truncate">{currentUser.name}</h4>
            <p className="text-xs text-concrete truncate">{currentUser.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#F2A900]/15 text-[#9A6700]">
                {currentUser.role}
              </span>
            </div>
          </div>
        </div>

        {/* Action List Section 1 */}
        <div className="bg-white rounded-2xl border border-black/6 overflow-hidden divide-y divide-black/6">
          {/* Notifications */}
          <button
            onClick={handleOpenNotifications}
            className="w-full p-3.5 flex items-center justify-between text-left tap-spring hover:bg-black/2"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-black/5 flex items-center justify-center text-zinc-700">
                <Bell className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-[#1C1D1F]">Notifications</span>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#C8452D] text-white">
                  {unreadCount} new
                </span>
              )}
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </div>
          </button>

          {/* Offline Mode Toggle */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isOffline ? 'bg-amber-100 text-amber-700' : 'bg-black/5 text-zinc-700'
                }`}
              >
                {isOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-xs font-semibold text-[#1C1D1F]">Simulate Offline Mode</p>
                <p className="text-[10px] text-concrete">Queue logs locally for field testing</p>
              </div>
            </div>

            {/* iOS style toggle switch */}
            <button
              onClick={toggleOffline}
              aria-label="Toggle offline mode"
              className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 tap-spring ${
                isOffline ? 'bg-[#F2A900]' : 'bg-zinc-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  isOffline ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Company Settings */}
          {canAccessCompanySettings && (
            <button
              onClick={handleOpenCompanySettings}
              className="w-full p-3.5 flex items-center justify-between text-left tap-spring hover:bg-black/2"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-black/5 flex items-center justify-center text-zinc-700">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-[#1C1D1F]">Company Settings</span>
                    {currentUser.role === 'supervisor' && (
                      <Lock className="w-3 h-3 text-zinc-400" />
                    )}
                  </div>
                  <p className="text-[10px] text-concrete">
                    {currentUser.role === 'admin'
                      ? 'Job sites, role permissions, intervals'
                      : 'View-only locked mode'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </button>
          )}
        </div>

        {/* Demo Role Switcher */}
        <div>
          <div className="px-1 mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-concrete uppercase tracking-wider">
              Switch Demo Role
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">Live RBAC</span>
          </div>

          <div className="bg-white rounded-2xl border border-black/6 overflow-hidden divide-y divide-black/6">
            {roles.map(({ role, label, desc }) => {
              const isCurrent = currentUser.role === role;
              return (
                <button
                  key={role}
                  onClick={() => handleRoleSelect(role)}
                  className={`w-full p-3 flex items-center justify-between text-left tap-spring transition-colors ${
                    isCurrent ? 'bg-amber-50/60' : 'hover:bg-black/2'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        isCurrent ? 'bg-[#F2A900] text-black font-bold' : 'bg-black/5 text-zinc-600'
                      }`}
                    >
                      {isCurrent ? <UserCheck className="w-4 h-4" /> : <Shield className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#1C1D1F]">{label}</p>
                      <p className="text-[10px] text-concrete line-clamp-1">{desc}</p>
                    </div>
                  </div>
                  {isCurrent && (
                    <span className="text-[10px] font-semibold text-[#F2A900] bg-zinc-900 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions: Reset Demo Data & Sign Out */}
        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={() => {
              resetDemoData();
              setUserMenuOpen(false);
            }}
            className="flex-1 py-2.5 px-3 rounded-xl bg-white border border-black/8 text-zinc-700 text-xs font-medium flex items-center justify-center gap-1.5 tap-spring active:bg-zinc-100"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>

          <button
            onClick={() => {
              setUserMenuOpen(false);
              signOut();
            }}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#1C1D1F] text-white text-xs font-medium flex items-center justify-center gap-1.5 tap-spring active:bg-zinc-800"
          >
            <LogOut className="w-3.5 h-3.5 text-[#F2A900]" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};
