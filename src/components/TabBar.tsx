import React from 'react';
import { Home, Package, QrCode, Wrench, Truck } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { TabType } from '../types';
import { motion } from 'motion/react';

export const TabBar: React.FC = () => {
  const currentTab = useAppStore((s) => s.currentTab);
  const setTab = useAppStore((s) => s.setTab);
  const screenStack = useAppStore((s) => s.screenStack);

  // If deep in a child screen stack, we can still show the tab bar or keep it anchored
  const isDetailView = screenStack.length > 0;
  if (isDetailView) {
    return null;
  }

  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'scan', label: 'Scan', icon: QrCode },
    { id: 'service', label: 'Service', icon: Wrench },
    { id: 'assets', label: 'Assets', icon: Truck }
  ];

  return (
    <nav className="h-[64px] bg-[#F4F2EE]/90 backdrop-blur-xl border-t border-black/8 px-2 flex items-center justify-around shrink-0 relative z-30 select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        const isScan = tab.id === 'scan';

        if (isScan) {
          return (
            <button
              key={tab.id}
              onClick={() => setTab('scan')}
              className="relative -top-3.5 flex flex-col items-center justify-center tap-spring"
              aria-label="Scan QR Code"
            >
              <div
                className={`w-[48px] h-[48px] rounded-full flex items-center justify-center shadow-md border-2 border-[#F4F2EE] transition-all duration-200 ${
                  isActive
                    ? 'bg-[#1C1D1F] text-[#F2A900] ring-2 ring-[#F2A900]/40'
                    : 'bg-[#F2A900] text-[#1C1D1F] hover:brightness-105'
                }`}
              >
                <QrCode className="w-6 h-6 stroke-[2]" />
              </div>
              <span
                className={`text-[10px] font-semibold mt-1 transition-colors ${
                  isActive ? 'text-[#1C1D1F]' : 'text-zinc-500'
                }`}
              >
                Scan
              </span>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className="flex-1 flex flex-col items-center justify-center h-full py-1 tap-spring relative"
          >
            <div className="relative">
              <Icon
                className={`w-5 h-5 transition-colors duration-150 ${
                  isActive ? 'text-[#1C1D1F] stroke-[2.2]' : 'text-zinc-400 stroke-[1.6]'
                }`}
              />
              {isActive && (
                <motion.div
                  layoutId="tabUnderline"
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#F2A900]"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </div>
            <span
              className={`text-[10px] font-medium tracking-tight mt-1 transition-colors ${
                isActive ? 'text-[#1C1D1F] font-semibold' : 'text-zinc-500'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
