import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { TopBar } from '../components/TopBar';
import { SafeImage } from '../components/SafeImage';
import {
  AlertTriangle,
  Wrench,
  Calendar,
  Clock,
  ArrowRight,
  MapPin,
  UserCheck,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { motion } from 'motion/react';

interface AssetDetailScreenProps {
  assetId: string;
}

export const AssetDetailScreen: React.FC<AssetDetailScreenProps> = ({ assetId }) => {
  const assets = useAppStore((s) => s.assets);
  const sites = useAppStore((s) => s.sites);
  const popScreen = useAppStore((s) => s.popScreen);
  const pushScreen = useAppStore((s) => s.pushScreen);
  const currentUser = useAppStore((s) => s.currentUser);

  const [isScrolled, setIsScrolled] = useState(false);

  const asset = assets.find((a) => a.id === assetId);

  if (!asset) {
    return (
      <div className="flex-1 bg-[#F4F2EE] flex flex-col items-center justify-center p-6 text-center">
        <p className="text-sm font-semibold text-zinc-800">Asset record not found</p>
        <button
          onClick={popScreen}
          className="mt-3 px-4 py-2 bg-[#1C1D1F] text-white rounded-xl text-xs font-semibold"
        >
          Return to Assets
        </button>
      </div>
    );
  }

  const site = sites.find((s) => s.id === asset.siteId);
  const isOverdue = asset.status === 'overdue_inspection';

  // SVG Line Chart calculation for engine hours history
  const maxHours = Math.max(...asset.hoursHistory.map((h) => h.hours), 1);
  const minHours = Math.min(...asset.hoursHistory.map((h) => h.hours), 0);
  const range = maxHours - minHours || 1;

  const points = asset.hoursHistory.map((h, i) => {
    const x = 15 + i * (170 / (asset.hoursHistory.length - 1));
    const y = 65 - ((h.hours - minHours) / range) * 50;
    return `${x},${y}`;
  });

  const svgPath = `M ${points.join(' L ')}`;

  const canScheduleService = currentUser.role === 'admin' || currentUser.role === 'supervisor';

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      drag="x"
      dragConstraints={{ left: 0 }}
      dragElastic={{ left: 0, right: 0.2 }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 80 || info.velocity.x > 300) {
          popScreen();
        }
      }}
      className="flex-1 flex flex-col bg-[#F4F2EE] overflow-hidden relative"
    >
      <TopBar
        title={asset.name}
        isScrolled={isScrolled}
        canGoBack={true}
        onBack={popScreen}
        showSitePicker={false}
      />

      <div
        onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 30)}
        className="flex-1 overflow-y-auto no-scrollbar px-4 pt-1 pb-10 space-y-4 overscroll-contain"
      >
        {/* Photo Container */}
        <div className="relative rounded-2xl overflow-hidden bg-white border border-black/8 shadow-xs">
          <SafeImage
            src={asset.imageUrl}
            alt={asset.name}
            className="w-full h-44 object-cover"
          />
          <div className="absolute top-3 left-3">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[#1C1D1F]/80 backdrop-blur-md text-white">
              {asset.category}
            </span>
          </div>

          <div className="absolute bottom-3 right-3">
            {isOverdue ? (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#C8452D] text-white shadow-sm flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>Inspection Overdue</span>
              </span>
            ) : (
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm ${
                  asset.status === 'in_use'
                    ? 'bg-[#F2A900] text-zinc-950'
                    : 'bg-[#2F8F5B] text-white'
                }`}
              >
                {asset.status.replace('_', ' ').toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Machine Identity */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-concrete uppercase font-bold tracking-wider">
              SN: {asset.serialNumber}
            </span>
            <span className="text-zinc-300">·</span>
            <span className="text-[11px] text-concrete font-medium">{asset.model}</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#1C1D1F] mt-0.5">
            {asset.name}
          </h1>
          <p className="text-xs text-concrete mt-0.5">
            Site: <span className="font-semibold text-zinc-800">{site?.name || 'Assigned Depot'}</span>
          </p>
        </div>

        {/* Engine Hours Metric with Line Chart */}
        <div className="bg-white p-3.5 rounded-2xl border border-black/6 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-concrete tracking-wider block">
                Accumulated Engine Hours
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold text-[#1C1D1F] tabular-nums">
                  {asset.engineHours.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-zinc-600">Hours</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-semibold text-[#2F8F5B] flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>+92h this month</span>
              </span>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="pt-2">
            <div className="h-20 w-full">
              <svg viewBox="0 0 200 70" className="w-full h-full overflow-visible">
                {/* Horizontal reference grid lines */}
                <line x1="10" y1="15" x2="190" y2="15" stroke="#F0F0F0" strokeWidth="1" strokeDasharray="2,2" />
                <line x1="10" y1="40" x2="190" y2="40" stroke="#F0F0F0" strokeWidth="1" strokeDasharray="2,2" />
                <line x1="10" y1="65" x2="190" y2="65" stroke="#E5E5E5" strokeWidth="1" />

                {/* Path line */}
                <path
                  d={svgPath}
                  fill="none"
                  stroke="#F2A900"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data points */}
                {asset.hoursHistory.map((h, i) => {
                  const x = 15 + i * (170 / (asset.hoursHistory.length - 1));
                  const y = 65 - ((h.hours - minHours) / range) * 50;
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="3"
                      fill="#1C1D1F"
                      stroke="#F2A900"
                      strokeWidth="1.5"
                    />
                  );
                })}
              </svg>
            </div>

            {/* X Axis Months */}
            <div className="flex justify-between px-2 text-[10px] font-semibold text-concrete mt-1">
              {asset.hoursHistory.map((h, i) => (
                <span key={i}>{h.month}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Primary Action Button: Schedule Service */}
        {canScheduleService && (
          <button
            onClick={() => pushScreen({ type: 'task_create', assetId: asset.id })}
            className="w-full h-12 rounded-xl bg-[#1C1D1F] text-white font-bold text-xs flex items-center justify-center gap-2 tap-spring shadow-md active:bg-zinc-800"
          >
            <Wrench className="w-4 h-4 text-[#F2A900]" />
            <span>Create Service Order for this Asset</span>
          </button>
        )}

        {/* Inspection Compliance Card */}
        <div className="bg-white rounded-2xl border border-black/6 divide-y divide-black/6 shadow-xs">
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileCheck className="w-4 h-4 text-concrete" />
              <span className="text-xs font-semibold text-zinc-700">Last Certified Inspection</span>
            </div>
            <span className="text-xs font-bold text-[#1C1D1F] tabular-nums">
              {asset.lastInspection}
            </span>
          </div>

          <div
            className={`p-3.5 flex items-center justify-between ${
              isOverdue ? 'bg-red-50/60' : ''
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Calendar
                className={`w-4 h-4 ${isOverdue ? 'text-[#C8452D]' : 'text-concrete'}`}
              />
              <span
                className={`text-xs font-semibold ${
                  isOverdue ? 'text-[#C8452D]' : 'text-zinc-700'
                }`}
              >
                Next Mandatory Inspection
              </span>
            </div>
            <div className="text-right">
              <span
                className={`text-xs font-bold tabular-nums block ${
                  isOverdue ? 'text-[#C8452D]' : 'text-[#1C1D1F]'
                }`}
              >
                {asset.nextInspection}
              </span>
              {isOverdue && (
                <span className="text-[10px] font-bold text-[#C8452D]">ACTION OVERDUE</span>
              )}
            </div>
          </div>

          {asset.assignedOperator && (
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4 text-concrete" />
                <span className="text-xs font-semibold text-zinc-700">Designated Operator</span>
              </div>
              <span className="text-xs font-medium text-[#1C1D1F]">{asset.assignedOperator}</span>
            </div>
          )}
        </div>

        {/* Movement History Timeline */}
        <div>
          <span className="text-xs font-bold text-[#1C1D1F] uppercase tracking-wider px-1 block mb-2">
            Dispatches & Movement Timeline
          </span>

          <div className="bg-white rounded-2xl border border-black/6 overflow-hidden divide-y divide-black/6 shadow-xs">
            {asset.movementHistory.length === 0 ? (
              <div className="p-4 text-center text-xs text-concrete">
                No external relocations logged. Machine stationed at current site since delivery.
              </div>
            ) : (
              asset.movementHistory.map((mv) => (
                <div key={mv.id} className="p-3.5 text-left space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-concrete">
                    <span className="font-semibold text-zinc-700">{mv.loggedBy}</span>
                    <span>{mv.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1C1D1F]">
                    <span className="truncate">{mv.from}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#F2A900] shrink-0" />
                    <span className="truncate">{mv.to}</span>
                  </div>
                  <p className="text-[11px] text-zinc-500">{mv.reason}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
