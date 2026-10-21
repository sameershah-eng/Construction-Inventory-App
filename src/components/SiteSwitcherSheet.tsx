import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { BottomSheet } from './BottomSheet';
import { Check, MapPin, Building2, Layers } from 'lucide-react';

export const SiteSwitcherSheet: React.FC = () => {
  const isSiteSheetOpen = useAppStore((s) => s.isSiteSheetOpen);
  const setSiteSheetOpen = useAppStore((s) => s.setSiteSheetOpen);
  const sites = useAppStore((s) => s.sites);
  const selectedSiteId = useAppStore((s) => s.selectedSiteId);
  const setSelectedSiteId = useAppStore((s) => s.setSelectedSiteId);
  const inventory = useAppStore((s) => s.inventory);
  const assets = useAppStore((s) => s.assets);

  return (
    <BottomSheet
      isOpen={isSiteSheetOpen}
      onClose={() => setSiteSheetOpen(false)}
      title="Switch Job Site"
      subtitle="Filter toolroom inventory, assets, and service tasks"
    >
      <div className="space-y-2">
        {/* All Sites Option */}
        <button
          onClick={() => setSelectedSiteId('all')}
          className={`w-full text-left p-3.5 rounded-2xl flex items-center justify-between transition-all tap-spring ${
            selectedSiteId === 'all'
              ? 'bg-[#1C1D1F] text-white shadow-sm'
              : 'bg-white border border-black/6 text-zinc-900 active:bg-zinc-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                selectedSiteId === 'all' ? 'bg-[#F2A900] text-black' : 'bg-black/5 text-zinc-700'
              }`}
            >
              <Layers className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">All Job Sites</p>
              <p
                className={`text-xs mt-0.5 ${
                  selectedSiteId === 'all' ? 'text-zinc-400' : 'text-zinc-500'
                }`}
              >
                {sites.length} Active Sites · {assets.length} Heavy Assets · {inventory.length} Toolroom Items
              </p>
            </div>
          </div>
          {selectedSiteId === 'all' && <Check className="w-5 h-5 text-[#F2A900] stroke-[2.5]" />}
        </button>

        {/* Individual Sites */}
        {sites.map((site) => {
          const isSelected = selectedSiteId === site.id;
          const siteAssets = assets.filter((a) => a.siteId === site.id);
          const siteInventory = inventory.filter((i) => i.siteId === site.id);

          return (
            <button
              key={site.id}
              onClick={() => setSelectedSiteId(site.id)}
              className={`w-full text-left p-3.5 rounded-2xl flex items-center justify-between transition-all tap-spring ${
                isSelected
                  ? 'bg-[#1C1D1F] text-white shadow-sm'
                  : 'bg-white border border-black/6 text-zinc-900 active:bg-zinc-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-[#F2A900] text-black' : 'bg-black/5 text-zinc-700'
                  }`}
                >
                  <Building2 className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold tracking-tight">{site.name}</p>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                        isSelected ? 'bg-zinc-800 text-zinc-300' : 'bg-black/5 text-zinc-600'
                      }`}
                    >
                      {site.code}
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs mt-0.5 ${
                      isSelected ? 'text-zinc-400' : 'text-zinc-500'
                    }`}
                  >
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate max-w-[200px]">{site.address}</span>
                  </div>
                  <p
                    className={`text-[11px] mt-1 ${
                      isSelected ? 'text-zinc-400' : 'text-zinc-500'
                    }`}
                  >
                    {siteAssets.length} Assets · {siteInventory.length} Toolroom SKUs
                  </p>
                </div>
              </div>
              {isSelected && <Check className="w-5 h-5 text-[#F2A900] stroke-[2.5]" />}
            </button>
          );
        })}
      </div>
    </BottomSheet>
  );
};
