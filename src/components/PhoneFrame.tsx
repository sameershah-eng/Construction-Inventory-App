import React, { useEffect, useState } from 'react';
import { Wifi } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { motion, AnimatePresence } from 'motion/react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 900
  });

  const [currentTime, setCurrentTime] = useState('');
  const activeToast = useAppStore((s) => s.activeToast);
  const dismissToast = useAppStore((s) => s.dismissToast);
  const isOffline = useAppStore((s) => s.isOffline);
  const syncState = useAppStore((s) => s.syncState);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      setCurrentTime(`${formattedHours}:${formattedMinutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const isMobileScreen = dimensions.width < 640;

  // On desktop: height = min(100dvh - 120px, 820px), width based on 9:19.5 aspect ratio
  const phoneHeight = Math.min(Math.max(dimensions.height - 120, 560), 820);
  const phoneWidth = Math.round(phoneHeight * (9 / 19.5));

  if (isMobileScreen) {
    return (
      <div className="relative w-full h-[100dvh] bg-[#F4F2EE] text-[#1C1D1F] overflow-hidden flex flex-col font-sans select-none">
        {/* Mobile top status bar */}
        <div className="pt-2 px-6 pb-1 flex justify-between items-center text-xs font-semibold text-[#1C1D1F] shrink-0 z-50">
          <span>{currentTime || '9:41'}</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-zinc-600 font-medium tracking-tight">5G</span>
            <div className="w-5 h-2.5 border border-[#1C1D1F] rounded-sm p-0.5 flex items-center">
              <div className="h-full bg-[#1C1D1F] rounded-[1px] w-full" />
            </div>
          </div>
        </div>

        {/* Dynamic Island Banner for Mobile */}
        <AnimatePresence>
          {activeToast && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              onClick={dismissToast}
              className="absolute top-10 left-4 right-4 z-50 bg-[#1C1D1F] text-white p-3 rounded-2xl shadow-xl flex items-center justify-between cursor-pointer border border-zinc-700"
            >
              <div>
                <p className="text-xs font-semibold text-[#F2A900]">{activeToast.title}</p>
                <p className="text-[11px] text-zinc-300 mt-0.5">{activeToast.message}</p>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">Dismiss</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 relative overflow-hidden flex flex-col">
          {children}
        </div>

        {/* Mobile Home indicator */}
        <div className="h-5 flex items-center justify-center shrink-0 bg-transparent">
          <div className="w-32 h-1 bg-black/25 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[100dvh] bg-[#1C1D1F] phone-stage-radial flex items-center justify-center overflow-hidden select-none">
      {/* Phone Body with Titanium Bezel & Side Buttons */}
      <div
        style={{ width: `${phoneWidth}px`, height: `${phoneHeight}px` }}
        className="relative shrink-0 flex items-center justify-center"
      >
        {/* Left Side Buttons (Action button, Volume Up, Volume Down) */}
        <div className="absolute -left-[5px] top-[95px] w-[5px] h-[26px] bg-[#2E3033] rounded-l-[3px] border-l border-zinc-600/40 shadow-sm" />
        <div className="absolute -left-[5px] top-[135px] w-[5px] h-[48px] bg-[#2E3033] rounded-l-[3px] border-l border-zinc-600/40 shadow-sm" />
        <div className="absolute -left-[5px] top-[195px] w-[5px] h-[48px] bg-[#2E3033] rounded-l-[3px] border-l border-zinc-600/40 shadow-sm" />

        {/* Right Side Button (Power) */}
        <div className="absolute -right-[5px] top-[145px] w-[5px] h-[72px] bg-[#2E3033] rounded-r-[3px] border-r border-zinc-600/40 shadow-sm" />

        {/* Outer Titanium Frame */}
        <div className="w-full h-full rounded-[48px] p-[10px] bg-gradient-to-b from-[#383A3E] via-[#2A2B2E] to-[#1F2022] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08),inset_0_1px_1px_rgba(255,255,255,0.2)] flex flex-col relative">
          {/* Inner Screen Bezel */}
          <div className="w-full h-full rounded-[38px] bg-[#F4F2EE] text-[#1C1D1F] overflow-hidden relative flex flex-col shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)]">
            
            {/* iOS Status Bar */}
            <div className="h-11 pt-2.5 px-7 flex justify-between items-center text-xs font-semibold text-[#1C1D1F] shrink-0 z-40 select-none">
              {/* Live Time */}
              <span className="tracking-tight text-[13px] font-semibold text-[#1C1D1F] ml-1">
                {currentTime || '9:41'}
              </span>

              {/* Status Icons: 4-bar cellular, Wi-Fi, battery */}
              <div className="flex items-center gap-2 mr-1">
                {/* 4 Cell Signal Bars */}
                <div className="flex items-end gap-[1.5px] h-3 w-4">
                  <div className="w-[2.5px] h-[4px] bg-[#1C1D1F] rounded-[0.5px]" />
                  <div className="w-[2.5px] h-[6px] bg-[#1C1D1F] rounded-[0.5px]" />
                  <div className="w-[2.5px] h-[8.5px] bg-[#1C1D1F] rounded-[0.5px]" />
                  <div className="w-[2.5px] h-[11px] bg-[#1C1D1F] rounded-[0.5px]" />
                </div>

                {/* Wi-Fi Icon */}
                <Wifi className="w-3.5 h-3.5 stroke-[2] text-[#1C1D1F]" />

                {/* Battery with charge fill */}
                <div className="flex items-center gap-[1px]">
                  <div className="w-[22px] h-[11.5px] border-[1.2px] border-[#1C1D1F] rounded-[3.5px] p-[1.5px] flex items-center">
                    <div
                      className={`h-full rounded-[1px] transition-all duration-300 ${
                        isOffline ? 'bg-amber-500 w-3/4' : 'bg-[#2F8F5B] w-full'
                      }`}
                    />
                  </div>
                  <div className="w-[1px] h-[4px] bg-[#1C1D1F] rounded-r-[0.5px]" />
                </div>
              </div>
            </div>

            {/* Dynamic Island */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
              <motion.div
                animate={
                  activeToast
                    ? { width: 270, height: 42, borderRadius: 21 }
                    : syncState === 'syncing'
                    ? { width: 140, height: 30, borderRadius: 15 }
                    : { width: 96, height: 26, borderRadius: 13 }
                }
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                className="bg-black text-white px-3 flex items-center justify-between shadow-lg overflow-hidden pointer-events-auto cursor-pointer"
                onClick={activeToast ? dismissToast : undefined}
              >
                {activeToast ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <div className="truncate pr-2">
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            activeToast.type === 'alert'
                              ? 'bg-[#C8452D]'
                              : activeToast.type === 'success'
                              ? 'bg-[#2F8F5B]'
                              : 'bg-[#F2A900]'
                          }`}
                        />
                        <span className="text-[11px] font-semibold text-white truncate">
                          {activeToast.title}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 truncate pl-3.5">
                        {activeToast.message}
                      </p>
                    </div>
                    <span className="text-[9px] text-zinc-500 shrink-0 font-medium">✕</span>
                  </motion.div>
                ) : syncState === 'syncing' ? (
                  <div className="w-full flex items-center justify-center gap-2">
                    <div className="w-2.5 h-2.5 border-2 border-[#F2A900] border-t-transparent rounded-full animate-spin" />
                    <span className="text-[10px] text-zinc-300 font-medium">Syncing...</span>
                  </div>
                ) : (
                  <div className="w-full flex items-center justify-between px-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-800" />
                    <div className="w-2 h-2 rounded-full bg-[#151525]" />
                  </div>
                )}
              </motion.div>
            </div>

            {/* App Screen Content Canvas */}
            <div className="flex-1 relative overflow-hidden flex flex-col min-h-0">
              {children}
            </div>

            {/* Home Indicator Bar */}
            <div className="h-5 flex items-center justify-center shrink-0 bg-transparent pointer-events-none select-none">
              <div className="w-32 h-1 bg-[#1C1D1F]/25 rounded-full mb-1" />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
