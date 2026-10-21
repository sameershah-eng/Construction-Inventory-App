import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { TopBar } from '../components/TopBar';
import { SafeImage } from '../components/SafeImage';
import { Asset } from '../types';
import {
  List,
  Map as MapIcon,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  MapPin,
  CheckCircle2,
  SlidersHorizontal,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AssetsScreen: React.FC = () => {
  const assets = useAppStore((s) => s.assets);
  const sites = useAppStore((s) => s.sites);
  const selectedSiteId = useAppStore((s) => s.selectedSiteId);
  const setSelectedSiteId = useAppStore((s) => s.setSelectedSiteId);
  const pushScreen = useAppStore((s) => s.pushScreen);

  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedAssetOnMap, setSelectedAssetOnMap] = useState<Asset | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Filter and sort: overdue inspection assets sort to top!
  const siteAssets = selectedSiteId === 'all'
    ? assets
    : assets.filter((a) => a.siteId === selectedSiteId);

  const sortedAssets = [...siteAssets].sort((a, b) => {
    if (a.status === 'overdue_inspection' && b.status !== 'overdue_inspection') return -1;
    if (b.status === 'overdue_inspection' && a.status !== 'overdue_inspection') return 1;
    return b.engineHours - a.engineHours;
  });

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setIsScrolled(e.currentTarget.scrollTop > 24);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F4F2EE] overflow-hidden relative">
      <TopBar title="Heavy Equipment & Assets" isScrolled={isScrolled} showSitePicker={true} />

      <div
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto no-scrollbar px-4 pt-1 pb-8 space-y-3.5 overscroll-contain"
      >
        {/* Large iOS Header Title with Action Button */}
        <div className="flex items-end justify-between pt-1">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-concrete">
              Site Machinery
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-[#1C1D1F]">
              Assets Fleet
            </h1>
          </div>

          {/* List vs Map Toggle */}
          <div className="flex items-center p-1 bg-black/6 rounded-xl">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg tap-spring flex items-center gap-1.5 transition-all ${
                viewMode === 'list'
                  ? 'bg-[#1C1D1F] text-white shadow-xs'
                  : 'text-zinc-600 bg-transparent'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg tap-spring flex items-center gap-1.5 transition-all ${
                viewMode === 'map'
                  ? 'bg-[#1C1D1F] text-white shadow-xs'
                  : 'text-zinc-600 bg-transparent'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Site Map</span>
            </button>
          </div>
        </div>

        {/* LIST VIEW */}
        {viewMode === 'list' ? (
          <div className="space-y-2.5">
            {sortedAssets.map((asset) => {
              const isOverdue = asset.status === 'overdue_inspection';
              const site = sites.find((s) => s.id === asset.siteId);

              return (
                <div
                  key={asset.id}
                  onClick={() => pushScreen({ type: 'asset_detail', assetId: asset.id })}
                  className={`p-3.5 rounded-2xl bg-white border tap-spring cursor-pointer shadow-xs flex items-center gap-3.5 hover:border-black/15 transition-all ${
                    isOverdue ? 'border-[#C8452D]/40 ring-1 ring-[#C8452D]/20' : 'border-black/6'
                  }`}
                >
                  <SafeImage
                    src={asset.imageUrl}
                    alt={asset.name}
                    className="w-16 h-16 rounded-xl shrink-0"
                  />

                  <div className="flex-1 min-w-0 pr-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {isOverdue ? (
                        <span className="text-[10px] font-bold text-[#C8452D] bg-[#C8452D]/10 px-1.5 py-0.2 rounded-sm flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>INSPECTION OVERDUE</span>
                        </span>
                      ) : (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded-sm ${
                            asset.status === 'in_use'
                              ? 'text-[#F2A900] bg-amber-500/10'
                              : asset.status === 'maintenance'
                              ? 'text-zinc-800 bg-zinc-200'
                              : 'text-[#2F8F5B] bg-[#2F8F5B]/10'
                          }`}
                        >
                          {asset.status.replace('_', ' ').toUpperCase()}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xs font-bold text-[#1C1D1F] line-clamp-1">
                      {asset.name}
                    </h3>

                    <div className="flex items-center gap-2 text-[10px] text-concrete mt-0.5">
                      <span>SN: {asset.serialNumber}</span>
                      <span>·</span>
                      <span>{site?.name.split(' ')[0]}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-bold text-zinc-900 tabular-nums">
                        {asset.engineHours.toLocaleString()} hrs
                      </span>
                      <span className="text-[10px] text-concrete">
                        Next insp: {asset.nextInspection}
                      </span>
                    </div>
                  </div>

                  <ArrowUpRight className="w-4 h-4 text-zinc-400 shrink-0" />
                </div>
              );
            })}
          </div>
        ) : (
          /* MAP VIEW: Stylized SVG Site Map */
          <div className="space-y-3">
            <div className="bg-[#1C1D1F] rounded-2xl p-3 border border-zinc-800 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-[#F2A900] uppercase font-semibold">
                  Metro Regional Sector Map
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {siteAssets.length} Pins Live
                </span>
              </div>

              {/* Stylized SVG Map Canvas */}
              <div className="relative aspect-4/3 w-full bg-[#18191B] rounded-xl overflow-hidden border border-zinc-800">
                <svg
                  viewBox="0 0 100 80"
                  className="w-full h-full select-none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Grid Lines */}
                  <defs>
                    <pattern id="mapGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#25272A" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100" height="80" fill="#18191B" />
                  <rect width="100" height="80" fill="url(#mapGrid)" />

                  {/* River / Waterway Curve */}
                  <path
                    d="M 0,55 Q 35,45 60,65 T 100,50"
                    fill="none"
                    stroke="#2A3945"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />

                  {/* Transit / Expressway Arteries */}
                  <path
                    d="M 20,0 L 45,80"
                    fill="none"
                    stroke="#33373B"
                    strokeWidth="1.5"
                    strokeDasharray="2,2"
                  />
                  <path
                    d="M 0,25 L 100,35"
                    fill="none"
                    stroke="#33373B"
                    strokeWidth="1.5"
                    strokeDasharray="2,2"
                  />

                  {/* Job Site Zone Boundaries */}
                  {/* Site 1: Northgate Tower */}
                  <rect
                    x="28"
                    y="25"
                    width="22"
                    height="20"
                    rx="2"
                    fill="#F2A900"
                    fillOpacity="0.08"
                    stroke="#F2A900"
                    strokeWidth="0.6"
                    strokeDasharray="1,1"
                  />
                  <text x="30" y="29" fill="#8A8D91" fontSize="2.8" fontWeight="bold">
                    NORTHGATE TOWER
                  </text>

                  {/* Site 2: Riverside Bridge */}
                  <rect
                    x="52"
                    y="50"
                    width="22"
                    height="18"
                    rx="2"
                    fill="#2F8F5B"
                    fillOpacity="0.08"
                    stroke="#2F8F5B"
                    strokeWidth="0.6"
                    strokeDasharray="1,1"
                  />
                  <text x="54" y="54" fill="#8A8D91" fontSize="2.8" fontWeight="bold">
                    RIVERSIDE BRIDGE
                  </text>

                  {/* Site 3: Eastfield Logistics */}
                  <rect
                    x="65"
                    y="18"
                    width="22"
                    height="16"
                    rx="2"
                    fill="#3B82F6"
                    fillOpacity="0.08"
                    stroke="#6B7280"
                    strokeWidth="0.6"
                    strokeDasharray="1,1"
                  />
                  <text x="67" y="22" fill="#8A8D91" fontSize="2.8" fontWeight="bold">
                    EASTFIELD HUB
                  </text>

                  {/* Interactive Asset Pin Markers */}
                  {siteAssets.map((asset) => {
                    const isSelected = selectedAssetOnMap?.id === asset.id;
                    const isOverdue = asset.status === 'overdue_inspection';
                    const pinColor = isOverdue
                      ? '#C8452D'
                      : asset.status === 'in_use'
                      ? '#F2A900'
                      : '#2F8F5B';

                    return (
                      <g
                        key={asset.id}
                        className="cursor-pointer transition-transform"
                        onClick={() => setSelectedAssetOnMap(asset)}
                      >
                        {/* Pulse Ring if overdue */}
                        {isOverdue && (
                          <circle
                            cx={asset.mapCoords.x}
                            cy={asset.mapCoords.y}
                            r="4"
                            fill="none"
                            stroke="#C8452D"
                            strokeWidth="0.8"
                            opacity="0.6"
                            className="animate-ping"
                          />
                        )}
                        <circle
                          cx={asset.mapCoords.x}
                          cy={asset.mapCoords.y}
                          r={isSelected ? '3' : '2.2'}
                          fill={pinColor}
                          stroke="#FFFFFF"
                          strokeWidth="0.6"
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Map Site Switch Buttons */}
              <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setSelectedSiteId('all')}
                  className={`text-[10px] font-medium px-2.5 py-1 rounded-lg shrink-0 tap-spring ${
                    selectedSiteId === 'all'
                      ? 'bg-[#F2A900] text-black font-bold'
                      : 'bg-zinc-800 text-zinc-300'
                  }`}
                >
                  All Zones
                </button>
                {sites.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSiteId(s.id)}
                    className={`text-[10px] font-medium px-2.5 py-1 rounded-lg shrink-0 tap-spring ${
                      selectedSiteId === s.id
                        ? 'bg-[#F2A900] text-black font-bold'
                        : 'bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    {s.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Asset Pin Pop-up Card */}
            <AnimatePresence>
              {selectedAssetOnMap && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-white rounded-2xl p-3.5 border border-black/8 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <SafeImage
                        src={selectedAssetOnMap.imageUrl}
                        alt={selectedAssetOnMap.name}
                        className="w-12 h-12 rounded-xl shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase text-concrete">
                            {selectedAssetOnMap.model}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-[#1C1D1F]">
                          {selectedAssetOnMap.name}
                        </h4>
                        <p className="text-[10px] text-concrete">
                          SN: {selectedAssetOnMap.serialNumber} · {selectedAssetOnMap.engineHours} hrs
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedAssetOnMap(null)}
                      className="text-zinc-400 hover:text-zinc-600 p-1"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        pushScreen({ type: 'asset_detail', assetId: selectedAssetOnMap.id })
                      }
                      className="flex-1 py-2 rounded-xl bg-[#1C1D1F] text-white font-semibold text-xs flex items-center justify-center gap-1.5 tap-spring"
                    >
                      <span>View Asset Record</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#F2A900]" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
