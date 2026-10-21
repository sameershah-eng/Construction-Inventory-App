import React from 'react';
import { ChevronLeft, Cloud, CloudOff, RefreshCw, ChevronDown } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface TopBarProps {
  title?: string;
  isScrolled?: boolean;
  canGoBack?: boolean;
  onBack?: () => void;
  showSitePicker?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  isScrolled = false,
  canGoBack = false,
  onBack,
  showSitePicker = true
}) => {
  const sites = useAppStore((s) => s.sites);
  const selectedSiteId = useAppStore((s) => s.selectedSiteId);
  const currentUser = useAppStore((s) => s.currentUser);
  const setSiteSheetOpen = useAppStore((s) => s.setSiteSheetOpen);
  const setUserMenuOpen = useAppStore((s) => s.setUserMenuOpen);
  const isOffline = useAppStore((s) => s.isOffline);
  const syncState = useAppStore((s) => s.syncState);
  const pendingSyncCount = useAppStore((s) => s.pendingSyncCount);
  const popScreen = useAppStore((s) => s.popScreen);

  const currentSite = sites.find((s) => s.id === selectedSiteId);
  const siteLabel = selectedSiteId === 'all' ? 'All Sites' : currentSite ? currentSite.name.split(' ')[0] : 'Site';

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      popScreen();
    }
  };

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-30 transition-all duration-200 ${
        isScrolled
          ? 'bg-[#F4F2EE]/90 backdrop-blur-md border-b border-black/8 shadow-xs'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="h-11 px-4 flex items-center justify-between gap-2">
        {/* Left Slot: Back Button or Sync Status */}
        <div className="flex items-center min-w-[70px]">
          {canGoBack ? (
            <button
              onClick={handleBack}
              className="flex items-center text-sm font-medium text-[#1C1D1F] tap-spring -ml-2 p-1.5 rounded-lg active:bg-black/5"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2] text-[#F2A900] -mr-0.5" />
              <span className="text-xs font-semibold text-[#1C1D1F]">Back</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-concrete">
              {isOffline ? (
                <span className="flex items-center gap-1 text-[#C8452D]">
                  <CloudOff className="w-3 h-3 stroke-[2]" />
                  <span>{pendingSyncCount > 0 ? `${pendingSyncCount} queued` : 'Offline'}</span>
                </span>
              ) : syncState === 'syncing' ? (
                <span className="flex items-center gap-1 text-[#F2A900]">
                  <RefreshCw className="w-3 h-3 stroke-[2] animate-spin" />
                  <span>Syncing</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[#2F8F5B]">
                  <Cloud className="w-3 h-3 stroke-[2]" />
                  <span>Synced</span>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Center Slot: Compact Collapsed Title (fades in on scroll) */}
        <div className="flex-1 text-center truncate px-2">
          <span
            className={`text-sm font-semibold text-[#1C1D1F] tracking-tight transition-opacity duration-200 block truncate ${
              isScrolled ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {title || ''}
          </span>
        </div>

        {/* Right Slot: Job Site Chip & User Avatar */}
        <div className="flex items-center gap-1.5 justify-end min-w-[70px]">
          {showSitePicker && (
            <button
              onClick={() => setSiteSheetOpen(true)}
              className="tap-spring flex items-center gap-1 bg-white border border-black/8 px-2 py-1 rounded-full text-[11px] font-medium text-graphite shadow-xs active:bg-zinc-100 max-w-[105px] truncate"
            >
              <span className="truncate">{siteLabel}</span>
              <ChevronDown className="w-3 h-3 text-concrete shrink-0" />
            </button>
          )}

          <button
            onClick={() => setUserMenuOpen(true)}
            className="tap-spring w-7 h-7 rounded-full bg-[#2E3033] border border-white/40 text-white flex items-center justify-center text-[10px] font-bold tracking-tight shadow-xs active:opacity-80 shrink-0"
            title={`${currentUser.name} (${currentUser.role})`}
          >
            {currentUser.initials}
          </button>
        </div>
      </div>
    </header>
  );
};
