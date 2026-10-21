import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { UserRole } from '../types';
import { motion } from 'motion/react';
import { Shield, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const authStatus = useAppStore((s) => s.authStatus);
  const setAuthStatus = useAppStore((s) => s.setAuthStatus);
  const signIn = useAppStore((s) => s.signIn);
  const currentUser = useAppStore((s) => s.currentUser);

  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser.role || 'admin');
  const [email, setEmail] = useState('m.vance@toolyard.io');
  const [password, setPassword] = useState('••••••••••••');

  // Splash screen timeout: 1.2s Toolyard mark on charcoal, then transition to sign-in
  useEffect(() => {
    if (authStatus === 'splash') {
      const timer = setTimeout(() => {
        setAuthStatus('signin');
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [authStatus, setAuthStatus]);

  // Update pre-filled email when role changes
  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    switch (role) {
      case 'admin':
        setEmail('m.vance@toolyard.io');
        break;
      case 'supervisor':
        setEmail('e.rostova@toolyard.io');
        break;
      case 'mechanic':
        setEmail('j.kovacs@toolyard.io');
        break;
      case 'storekeeper':
        setEmail('s.khan@toolyard.io');
        break;
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    signIn(selectedRole);
  };

  // Splash Screen View
  if (authStatus === 'splash') {
    return (
      <div className="flex-1 bg-[#1C1D1F] flex flex-col items-center justify-center p-6 text-white select-none">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          {/* Toolyard Mark: Industrial bold hex/crane geometry */}
          <div className="w-18 h-18 rounded-2xl bg-[#F2A900] flex items-center justify-center shadow-2xl mb-4 border border-amber-400/30">
            <svg
              className="w-10 h-10 text-[#1C1D1F]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19 4h-2V2h-2v2H9V2H7v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V8h14v12zm-8-3h2v-4h-2v4zm-4 0h2v-6H7v6zm8 0h2v-2h-2v2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase font-sans">
            Toolyard
          </h1>
          <p className="text-xs tracking-widest text-[#F2A900] uppercase font-semibold mt-1">
            Fleet · Equipment · Toolroom
          </p>
        </motion.div>
      </div>
    );
  }

  // Sign In Screen View
  return (
    <div className="flex-1 bg-[#F4F2EE] flex flex-col justify-between p-6 overflow-y-auto no-scrollbar">
      {/* Top Brand Lockup */}
      <div className="pt-4 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#1C1D1F] flex items-center justify-center shadow-md mb-3 border border-black/10">
          <div className="w-7 h-7 rounded-lg bg-[#F2A900] flex items-center justify-center">
            <span className="text-[#1C1D1F] font-black text-sm tracking-tighter">TY</span>
          </div>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-[#1C1D1F]">Toolyard</h2>
        <p className="text-xs text-concrete mt-1">
          Field toolroom & equipment intelligence
        </p>
      </div>

      {/* Main Sign In Card */}
      <div className="my-auto py-4">
        {/* Demo Role Segmented Picker */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5 px-0.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-concrete">
              Demo Crew Role
            </label>
            <span className="text-[10px] text-zinc-500 font-mono">Tap to switch</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/6 rounded-xl">
            {(
              [
                { role: 'admin', label: 'Admin' },
                { role: 'supervisor', label: 'Supervisor' },
                { role: 'mechanic', label: 'Mechanic' },
                { role: 'storekeeper', label: 'Storekeeper' }
              ] as const
            ).map((item) => (
              <button
                key={item.role}
                type="button"
                onClick={() => handleRoleChange(item.role)}
                className={`py-2 px-2 text-xs font-semibold rounded-lg transition-all tap-spring flex items-center justify-center gap-1.5 ${
                  selectedRole === item.role
                    ? 'bg-[#1C1D1F] text-white shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900 bg-transparent'
                }`}
              >
                <span>{item.label}</span>
                {selectedRole === item.role && (
                  <CheckCircle2 className="w-3 h-3 text-[#F2A900]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSignIn} className="space-y-3">
          <div className="bg-white rounded-2xl border border-black/8 overflow-hidden divide-y divide-black/6 shadow-xs">
            <div className="px-3.5 py-2.5">
              <label className="block text-[10px] uppercase font-semibold text-concrete tracking-wider">
                Work Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full text-xs font-medium text-[#1C1D1F] bg-transparent outline-hidden pt-0.5"
                placeholder="name@company.com"
              />
            </div>
            <div className="px-3.5 py-2.5">
              <label className="block text-[10px] uppercase font-semibold text-concrete tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full text-xs font-medium text-[#1C1D1F] bg-transparent outline-hidden pt-0.5"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Primary Sign In Button */}
          <button
            type="submit"
            disabled={authStatus === 'authenticating'}
            className="w-full h-12 rounded-xl bg-[#1C1D1F] text-white font-semibold text-xs tracking-wide flex items-center justify-center gap-2 tap-spring shadow-md active:bg-zinc-800 disabled:opacity-75"
          >
            {authStatus === 'authenticating' ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-[#F2A900] border-t-transparent rounded-full animate-spin" />
                <span>Authenticating Device...</span>
              </div>
            ) : (
              <>
                <span>Sign In as {selectedRole.toUpperCase()}</span>
                <ArrowRight className="w-4 h-4 text-[#F2A900]" />
              </>
            )}
          </button>

          {/* Company SSO Button */}
          <button
            type="button"
            onClick={() => signIn(selectedRole)}
            className="w-full h-11 rounded-xl bg-white border border-black/8 text-zinc-700 font-medium text-xs flex items-center justify-center gap-2 tap-spring active:bg-zinc-100"
          >
            <Shield className="w-3.5 h-3.5 text-zinc-500" />
            <span>Sign in with Company SSO</span>
          </button>
        </form>
      </div>

      {/* Security & Version Disclaimer */}
      <div className="pt-2 text-center">
        <div className="inline-flex items-center gap-1.5 text-[11px] text-concrete font-medium">
          <Lock className="w-3 h-3 text-concrete" />
          <span>AES-256 Offline Encrypted Cache</span>
        </div>
      </div>
    </div>
  );
};
