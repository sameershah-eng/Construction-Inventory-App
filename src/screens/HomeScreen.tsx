import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { TopBar } from '../components/TopBar';
import {
  AlertTriangle,
  ArrowUpRight,
  Clock,
  Wrench,
  Package,
  Truck,
  CheckCircle2,
  RefreshCw,
  QrCode
} from 'lucide-react';
import { motion } from 'motion/react';

export const HomeScreen: React.FC = () => {
  const currentUser = useAppStore((s) => s.currentUser);
  const selectedSiteId = useAppStore((s) => s.selectedSiteId);
  const sites = useAppStore((s) => s.sites);
  const inventory = useAppStore((s) => s.inventory);
  const assets = useAppStore((s) => s.assets);
  const tasks = useAppStore((s) => s.tasks);
  const activities = useAppStore((s) => s.activities);
  const pushScreen = useAppStore((s) => s.pushScreen);
  const setTab = useAppStore((s) => s.setTab);
  const triggerSync = useAppStore((s) => s.triggerSync);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(true);

  // Skeleton loader for 400ms on first open
  useEffect(() => {
    const timer = setTimeout(() => setIsLoadingSkeleton(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const currentSite = sites.find((s) => s.id === selectedSiteId);

  // Site-specific filtering
  const filteredInventory = selectedSiteId === 'all'
    ? inventory
    : inventory.filter((i) => i.siteId === selectedSiteId);

  const filteredAssets = selectedSiteId === 'all'
    ? assets
    : assets.filter((a) => a.siteId === selectedSiteId);

  const filteredTasks = selectedSiteId === 'all'
    ? tasks
    : tasks.filter((t) => t.siteId === selectedSiteId);

  // Stats calculation
  const itemsCheckedOut = filteredInventory.filter((i) => i.status === 'checked_out').length;
  const serviceDueThisWeek = filteredTasks.filter((t) => t.status !== 'completed').length;
  const overdueInspections = filteredAssets.filter((a) => a.status === 'overdue_inspection').length;
  const totalAssetsOnSite = filteredAssets.length;

  // Needs Attention List (overdue tasks & overdue assets)
  const overdueTasks = filteredTasks.filter((t) => t.isOverdue && t.status !== 'completed');
  const overdueAssetItems = filteredAssets.filter((a) => a.status === 'overdue_inspection');

  // Handle pull to refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    triggerSync();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setIsScrolled(scrollTop > 24);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F4F2EE] overflow-hidden relative">
      <TopBar title="Toolyard Dashboard" isScrolled={isScrolled} showSitePicker={true} />

      <div
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto no-scrollbar px-4 pt-1 pb-8 space-y-4 overscroll-contain"
      >
        {/* Pull To Refresh Trigger Bar */}
        <div className="flex justify-center -mt-1 mb-1">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 text-[10px] text-concrete font-medium bg-white/70 border border-black/5 px-2.5 py-1 rounded-full tap-spring"
          >
            <RefreshCw
              className={`w-3 h-3 text-[#F2A900] ${isRefreshing ? 'animate-spin' : ''}`}
            />
            <span>{isRefreshing ? 'Refreshing records...' : 'Pull or tap to sync'}</span>
          </button>
        </div>

        {/* Large iOS Header Title */}
        <div className="pt-1 pb-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-concrete">
              {currentSite ? currentSite.name : 'All Job Sites'}
            </span>
            <span className="text-[11px] font-medium text-concrete">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1C1D1F] mt-0.5">
            Good morning, {currentUser.name.split(' ')[0]}
          </h1>
          <p className="text-xs text-concrete mt-0.5">
            {currentUser.title} · <span className="text-[#1C1D1F] font-semibold capitalize">{currentUser.role}</span>
          </p>
        </div>

        {/* 4 Stat Cards */}
        {isLoadingSkeleton ? (
          <div className="grid grid-cols-2 gap-2.5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-white rounded-2xl border border-black/6 animate-pulse p-3.5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {/* Stat 1: Checked Out */}
            <button
              onClick={() => setTab('inventory')}
              className="bg-white p-3.5 rounded-2xl border border-black/6 text-left tap-spring flex flex-col justify-between shadow-xs hover:border-black/12"
            >
              <div className="flex items-center justify-between text-concrete">
                <span className="text-[11px] font-medium">Checked Out</span>
                <Package className="w-4 h-4 text-zinc-500" />
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold text-[#1C1D1F] tabular-nums">
                  {itemsCheckedOut}
                </span>
                <span className="text-[10px] text-concrete">in field</span>
              </div>
            </button>

            {/* Stat 2: Service Due */}
            <button
              onClick={() => setTab('service')}
              className="bg-white p-3.5 rounded-2xl border border-black/6 text-left tap-spring flex flex-col justify-between shadow-xs hover:border-black/12"
            >
              <div className="flex items-center justify-between text-concrete">
                <span className="text-[11px] font-medium">Service Due</span>
                <Wrench className="w-4 h-4 text-[#F2A900]" />
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold text-[#1C1D1F] tabular-nums">
                  {serviceDueThisWeek}
                </span>
                <span className="text-[10px] text-[#F2A900] font-medium">this week</span>
              </div>
            </button>

            {/* Stat 3: Overdue Inspections (Flagged in Red) */}
            <button
              onClick={() => setTab('assets')}
              className="bg-white p-3.5 rounded-2xl border border-[#C8452D]/30 text-left tap-spring flex flex-col justify-between shadow-xs hover:border-[#C8452D]"
            >
              <div className="flex items-center justify-between text-[#C8452D]">
                <span className="text-[11px] font-semibold">Overdue Inspec.</span>
                <AlertTriangle className="w-4 h-4 text-[#C8452D]" />
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold text-[#C8452D] tabular-nums">
                  {overdueInspections}
                </span>
                <span className="text-[10px] font-semibold text-[#C8452D]">Action req.</span>
              </div>
            </button>

            {/* Stat 4: Assets on Site */}
            <button
              onClick={() => setTab('assets')}
              className="bg-white p-3.5 rounded-2xl border border-black/6 text-left tap-spring flex flex-col justify-between shadow-xs hover:border-black/12"
            >
              <div className="flex items-center justify-between text-concrete">
                <span className="text-[11px] font-medium">Assets on Site</span>
                <Truck className="w-4 h-4 text-zinc-500" />
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold text-[#1C1D1F] tabular-nums">
                  {totalAssetsOnSite}
                </span>
                <span className="text-[10px] text-concrete">tracked</span>
              </div>
            </button>
          </div>
        )}

        {/* Quick Operational Shortcuts */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setTab('scan')}
            className="p-3 bg-[#1C1D1F] text-white rounded-xl flex items-center justify-between tap-spring shadow-xs"
          >
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-[#F2A900]" />
              <span className="text-xs font-semibold">Scan QR Tag</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          <button
            onClick={() => pushScreen({ type: 'task_create' })}
            className="p-3 bg-white border border-black/8 text-[#1C1D1F] rounded-xl flex items-center justify-between tap-spring shadow-xs"
          >
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#F2A900]" />
              <span className="text-xs font-semibold">Log Service</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        </div>

        {/* "Needs Attention" List */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#1C1D1F] uppercase tracking-wider">
                Needs Attention
              </span>
              <span className="w-2 h-2 rounded-full bg-[#C8452D]" />
            </div>
            <span className="text-[11px] text-[#C8452D] font-semibold tabular-nums">
              {overdueTasks.length + overdueAssetItems.length} items
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-black/6 overflow-hidden divide-y divide-black/6 shadow-xs">
            {overdueTasks.length === 0 && overdueAssetItems.length === 0 ? (
              <div className="p-4 text-center">
                <CheckCircle2 className="w-6 h-6 text-[#2F8F5B] mx-auto mb-1" />
                <p className="text-xs font-semibold text-zinc-800">All Clear</p>
                <p className="text-[11px] text-concrete">No overdue tasks or inspections flagged</p>
              </div>
            ) : (
              <>
                {/* Overdue Tasks */}
                {overdueTasks.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => pushScreen({ type: 'task_closeout', taskId: t.id })}
                    className="w-full p-3.5 text-left flex items-start justify-between tap-spring hover:bg-black/2"
                  >
                    <div className="pr-2">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-bold text-[#C8452D] bg-[#C8452D]/10 px-1.5 py-0.2 rounded-sm">
                          OVERDUE SERVICE
                        </span>
                        <span className="text-[10px] text-concrete font-mono">
                          Due {t.dueDate}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#1C1D1F] line-clamp-1">{t.title}</p>
                      <p className="text-[11px] text-zinc-500 mt-0.5">{t.assetName}</p>
                    </div>
                    <span className="text-[11px] font-semibold text-[#F2A900] bg-zinc-900 px-2 py-1 rounded-lg shrink-0 mt-1">
                      Close Out
                    </span>
                  </button>
                ))}

                {/* Overdue Asset Inspections */}
                {overdueAssetItems.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => pushScreen({ type: 'asset_detail', assetId: a.id })}
                    className="w-full p-3.5 text-left flex items-start justify-between tap-spring hover:bg-black/2"
                  >
                    <div className="pr-2">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-bold text-[#C8452D] bg-[#C8452D]/10 px-1.5 py-0.2 rounded-sm">
                          INSPECTION EXPIRED
                        </span>
                        <span className="text-[10px] text-concrete font-mono">
                          {a.engineHours} hrs
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#1C1D1F] line-clamp-1">{a.name}</p>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        SN: {a.serialNumber} · Next was due {a.nextInspection}
                      </p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-zinc-400 shrink-0 mt-1" />
                  </button>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-bold text-[#1C1D1F] uppercase tracking-wider">
              Toolroom Activity Log
            </span>
            <span className="text-[11px] text-concrete">Live Stream</span>
          </div>

          <div className="bg-white rounded-2xl border border-black/6 overflow-hidden divide-y divide-black/6 shadow-xs">
            {activities.slice(0, 6).map((activity) => (
              <div key={activity.id} className="p-3 text-left flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-black/5 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-zinc-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#1C1D1F] leading-snug">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-concrete mt-1">
                    <span className="font-semibold text-zinc-700">{activity.userName}</span>
                    <span>·</span>
                    <span>{activity.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
