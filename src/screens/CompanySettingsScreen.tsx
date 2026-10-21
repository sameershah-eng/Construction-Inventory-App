import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { TopBar } from '../components/TopBar';
import { motion } from 'motion/react';
import {
  Lock,
  Building,
  Shield,
  Sliders,
  Check,
  AlertCircle,
  Clock,
  Save
} from 'lucide-react';

export const CompanySettingsScreen: React.FC = () => {
  const currentUser = useAppStore((s) => s.currentUser);
  const sites = useAppStore((s) => s.sites);
  const popScreen = useAppStore((s) => s.popScreen);
  const showToast = useAppStore((s) => s.showToast);

  const isSupervisor = currentUser.role === 'supervisor';
  const isAdmin = currentUser.role === 'admin';

  // Configurable settings
  const [inspectionIntervalDays, setInspectionIntervalDays] = useState('30');
  const [hydraulicEngineHoursThreshold, setHydraulicEngineHoursThreshold] = useState('250');
  const [autoReorderAlertDays, setAutoReorderAlertDays] = useState('7');
  const [strictCheckInPhotoRequired, setStrictCheckInPhotoRequired] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    showToast('Settings Saved', 'Company inspection intervals updated', 'success');
    popScreen();
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="flex-1 flex flex-col bg-[#F4F2EE] overflow-hidden relative"
    >
      <TopBar
        title="Company Settings"
        isScrolled={true}
        canGoBack={true}
        onBack={popScreen}
        showSitePicker={false}
      />

      <form
        onSubmit={handleSave}
        className="flex-1 overflow-y-auto no-scrollbar px-4 pt-2 pb-10 space-y-4 overscroll-contain"
      >
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-concrete">
            Enterprise Fleet Policy
          </span>
          <h1 className="text-xl font-bold tracking-tight text-[#1C1D1F]">
            Company Configuration
          </h1>
        </div>

        {/* Supervisor Locked Notice Banner */}
        {isSupervisor && (
          <div className="p-3.5 bg-amber-500/10 border border-[#F2A900]/40 rounded-2xl flex items-start gap-3 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-[#F2A900] text-black flex items-center justify-center shrink-0 mt-0.5">
              <Lock className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-900">
                View-Only Policy Mode
              </p>
              <p className="text-[11px] text-zinc-700 mt-0.5 leading-snug">
                Only administrators can change company settings. Site supervisors can review active inspection intervals and crew permissions.
              </p>
            </div>
          </div>
        )}

        {/* Section 1: Preventative Maintenance Intervals */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-concrete px-0.5 block mb-1.5">
            Inspection Intervals & Rules
          </label>
          <div className="bg-white rounded-2xl border border-black/8 overflow-hidden divide-y divide-black/6 shadow-xs">
            <div className="p-3.5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#1C1D1F]">
                  OSHA Mandatory Recertification
                </p>
                <p className="text-[10px] text-concrete">Standard boom & crane cycle</p>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  disabled={!isAdmin}
                  value={inspectionIntervalDays}
                  onChange={(e) => setInspectionIntervalDays(e.target.value)}
                  className="w-16 h-8 text-right px-2 font-bold text-xs bg-black/5 rounded-lg border border-black/8 outline-hidden disabled:opacity-60"
                />
                <span className="text-xs text-concrete">Days</span>
                {!isAdmin && <Lock className="w-3.5 h-3.5 text-zinc-400 ml-1" />}
              </div>
            </div>

            <div className="p-3.5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#1C1D1F]">
                  Engine Hour Service Trigger
                </p>
                <p className="text-[10px] text-concrete">Hydraulics & lube threshold</p>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  disabled={!isAdmin}
                  value={hydraulicEngineHoursThreshold}
                  onChange={(e) => setHydraulicEngineHoursThreshold(e.target.value)}
                  className="w-16 h-8 text-right px-2 font-bold text-xs bg-black/5 rounded-lg border border-black/8 outline-hidden disabled:opacity-60"
                />
                <span className="text-xs text-concrete">Hours</span>
                {!isAdmin && <Lock className="w-3.5 h-3.5 text-zinc-400 ml-1" />}
              </div>
            </div>

            <div className="p-3.5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#1C1D1F]">
                  Mandatory Return Photo
                </p>
                <p className="text-[10px] text-concrete">Damage inspection on check-in</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!isAdmin}
                  onClick={() => setStrictCheckInPhotoRequired(!strictCheckInPhotoRequired)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors tap-spring ${
                    strictCheckInPhotoRequired ? 'bg-[#2F8F5B]' : 'bg-zinc-300'
                  } disabled:opacity-60`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                      strictCheckInPhotoRequired ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                {!isAdmin && <Lock className="w-3.5 h-3.5 text-zinc-400" />}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Active Job Sites Register */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-concrete px-0.5 block mb-1.5">
            Active Job Sites ({sites.length})
          </label>
          <div className="bg-white rounded-2xl border border-black/8 overflow-hidden divide-y divide-black/6 shadow-xs">
            {sites.map((site) => (
              <div key={site.id} className="p-3.5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-[#1C1D1F]">{site.name}</p>
                    <span className="text-[10px] font-mono bg-black/5 px-1.5 py-0.2 rounded-md">
                      {site.code}
                    </span>
                  </div>
                  <p className="text-[10px] text-concrete mt-0.5">{site.address}</p>
                </div>
                {!isAdmin && <Lock className="w-3.5 h-3.5 text-zinc-400" />}
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Role & RBAC Access Matrix */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-concrete px-0.5 block mb-1.5">
            RBAC Permission Matrix
          </label>
          <div className="bg-white rounded-2xl border border-black/8 overflow-hidden divide-y divide-black/6 shadow-xs text-xs">
            <div className="p-3 flex items-center justify-between bg-zinc-50 font-bold text-concrete text-[10px] uppercase">
              <span>Role</span>
              <span>Tool Crib / Service Orders / Policy</span>
            </div>

            <div className="p-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-zinc-900">Admin</p>
                <p className="text-[10px] text-concrete">Executive / Director</p>
              </div>
              <span className="text-[10px] font-semibold text-[#2F8F5B] bg-[#2F8F5B]/10 px-2 py-0.5 rounded-full">
                Full Unrestricted
              </span>
            </div>

            <div className="p-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-zinc-900">Site Supervisor</p>
                <p className="text-[10px] text-concrete">Superintendents</p>
              </div>
              <span className="text-[10px] font-semibold text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded-full">
                Ops & Task Assignment
              </span>
            </div>

            <div className="p-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-zinc-900">Mechanic</p>
                <p className="text-[10px] text-concrete">Heavy Techs</p>
              </div>
              <span className="text-[10px] font-semibold text-[#F2A900] bg-amber-500/15 px-2 py-0.5 rounded-full">
                Work Orders & Diagnostics
              </span>
            </div>

            <div className="p-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-zinc-900">Storekeeper</p>
                <p className="text-[10px] text-concrete">Tool Crib Lead</p>
              </div>
              <span className="text-[10px] font-semibold text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded-full">
                Check In/Out & Catalog
              </span>
            </div>
          </div>
        </div>

        {/* Admin Save Button */}
        {isAdmin && (
          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#F2A900] text-zinc-950 font-bold text-xs tap-spring shadow-md flex items-center justify-center gap-1.5 active:brightness-95"
            >
              <Save className="w-4 h-4" />
              <span>Save Enterprise Policy</span>
            </button>
          </div>
        )}
      </form>
    </motion.div>
  );
};
