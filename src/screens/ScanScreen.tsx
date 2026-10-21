import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { TopBar } from '../components/TopBar';
import { SafeImage } from '../components/SafeImage';
import { InventoryItem } from '../types';
import {
  Flashlight,
  FlashlightOff,
  Keyboard,
  ArrowUpRight,
  ArrowDownLeft,
  Check,
  RotateCcw,
  Sparkles,
  QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ScanScreen: React.FC = () => {
  const inventory = useAppStore((s) => s.inventory);
  const checkOutItem = useAppStore((s) => s.checkOutItem);
  const checkInItem = useAppStore((s) => s.checkInItem);
  const pushScreen = useAppStore((s) => s.pushScreen);
  const currentUser = useAppStore((s) => s.currentUser);

  const [flashlightOn, setFlashlightOn] = useState(false);
  const [manualCodeOpen, setManualCodeOpen] = useState(false);
  const [manualCodeInput, setManualCodeInput] = useState('');
  const [scannedItem, setScannedItem] = useState<InventoryItem | null>(null);
  const [hasScanned, setHasScanned] = useState(false);
  const [selectedDemoTargetIndex, setSelectedDemoTargetIndex] = useState(0);

  // Recipient for checkout
  const [checkoutTo, setCheckoutTo] = useState(currentUser.name);

  // 3 sample items to simulate scanning
  const demoCandidates = [
    inventory.find((i) => i.id === 'inv-1') || inventory[0],
    inventory.find((i) => i.id === 'inv-2') || inventory[1],
    inventory.find((i) => i.id === 'inv-6') || inventory[2]
  ];

  const targetItem = demoCandidates[selectedDemoTargetIndex] || inventory[0];

  // Auto-scan simulation after 1.5s
  useEffect(() => {
    if (hasScanned) return;

    const timer = setTimeout(() => {
      setScannedItem(targetItem);
      setHasScanned(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [hasScanned, targetItem]);

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = manualCodeInput.trim().toLowerCase();
    const match = inventory.find(
      (i) =>
        i.sku.toLowerCase().includes(query) ||
        i.id.toLowerCase().includes(query) ||
        i.name.toLowerCase().includes(query)
    );
    if (match) {
      setScannedItem(match);
      setHasScanned(true);
      setManualCodeOpen(false);
    }
  };

  const handleResetScanner = () => {
    setScannedItem(null);
    setHasScanned(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#1C1D1F] text-white overflow-hidden relative select-none">
      {/* Viewfinder Header Controls */}
      <div className="pt-2 px-4 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
          <div className="w-2 h-2 rounded-full bg-[#F2A900] animate-pulse" />
          <span className="text-[10px] font-semibold text-zinc-300 uppercase tracking-wider">
            Laser Ready
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Flashlight toggle */}
          <button
            onClick={() => setFlashlightOn(!flashlightOn)}
            className={`w-9 h-9 rounded-full flex items-center justify-center tap-spring border border-white/10 ${
              flashlightOn
                ? 'bg-[#F2A900] text-[#1C1D1F]'
                : 'bg-black/50 text-white backdrop-blur-md'
            }`}
            title="Toggle Flashlight"
          >
            {flashlightOn ? (
              <Flashlight className="w-4 h-4 fill-current" />
            ) : (
              <FlashlightOff className="w-4 h-4" />
            )}
          </button>

          {/* Manual Code button */}
          <button
            onClick={() => setManualCodeOpen(true)}
            className="w-9 h-9 rounded-full bg-black/50 text-white backdrop-blur-md border border-white/10 flex items-center justify-center tap-spring"
            title="Enter SKU manually"
          >
            <Keyboard className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Simulated Camera Lens Viewport */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-6">
        {/* Background Camera grain & light simulation */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${
            flashlightOn ? 'bg-amber-100/10' : 'bg-transparent'
          }`}
        />

        {/* Framing & Reticle Guides */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* 4 Amber Corner Brackets */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-3 border-l-3 border-[#F2A900] rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-3 border-r-3 border-[#F2A900] rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-3 border-l-3 border-[#F2A900] rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-3 border-r-3 border-[#F2A900] rounded-br-lg" />

          {/* Pulse Frame Animation on Scan */}
          <motion.div
            animate={
              hasScanned
                ? { scale: [1, 1.05, 1], borderColor: '#2F8F5B' }
                : { scale: 1, borderColor: 'rgba(255,255,255,0.08)' }
            }
            transition={{ duration: 0.35 }}
            className="w-56 h-56 rounded-2xl border border-white/10 flex flex-col items-center justify-center relative overflow-hidden bg-black/20 backdrop-blur-xs"
          >
            {/* Animated Laser Scanning Line */}
            {!hasScanned && (
              <motion.div
                animate={{ y: [-100, 100, -100] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#F2A900] to-transparent shadow-[0_0_12px_#F2A900]"
              />
            )}

            {/* Simulated Tool Tag in Viewfinder */}
            <div className="flex flex-col items-center text-center p-4">
              <QrCode className="w-14 h-14 text-white/40 mb-2 stroke-[1.2]" />
              <p className="text-[11px] font-mono font-semibold text-zinc-300">
                {targetItem.sku}
              </p>
              <p className="text-[10px] text-zinc-400 mt-0.5 max-w-[150px] truncate">
                {targetItem.name}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Viewfinder Instructions & Target Switcher */}
        <div className="mt-4 text-center">
          <p className="text-xs text-zinc-300 font-medium">
            {hasScanned ? 'Tag Recognized' : 'Align QR or DataMatrix code in frame'}
          </p>

          <div className="mt-3 flex items-center justify-center gap-1.5">
            <span className="text-[10px] text-zinc-400">Sample Tag:</span>
            {demoCandidates.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedDemoTargetIndex(idx);
                  setHasScanned(false);
                  setScannedItem(null);
                }}
                className={`text-[10px] font-mono px-2 py-0.5 rounded-md transition-all tap-spring ${
                  selectedDemoTargetIndex === idx
                    ? 'bg-[#F2A900] text-black font-bold'
                    : 'bg-white/10 text-zinc-300'
                }`}
              >
                {c.sku.split('-')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scanned Result Bottom Sheet Modal */}
      <AnimatePresence>
        {scannedItem && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleResetScanner}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              className="relative bg-[#F4F2EE] text-[#1C1D1F] rounded-t-[28px] p-5 shadow-2xl z-10 space-y-4 max-h-[85%] overflow-y-auto no-scrollbar"
            >
              {/* Grab Handle */}
              <div className="w-10 h-1.5 bg-zinc-300 rounded-full mx-auto -mt-2 mb-2" />

              {/* Tag Found Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <SafeImage
                    src={scannedItem.imageUrl}
                    alt={scannedItem.name}
                    category={scannedItem.category}
                    className="w-14 h-14 rounded-2xl shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-concrete">
                      {scannedItem.sku}
                    </span>
                    <h3 className="text-sm font-bold text-[#1C1D1F] leading-tight">
                      {scannedItem.name}
                    </h3>
                    <p className="text-xs text-concrete mt-0.5">
                      Bin: <span className="font-semibold text-zinc-800">{scannedItem.binLocation}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleResetScanner}
                  className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center text-xs font-semibold text-zinc-600"
                >
                  ✕
                </button>
              </div>

              {/* Status Banner */}
              <div className="p-3 bg-white rounded-xl border border-black/6 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] uppercase text-concrete font-semibold block">
                    Current Status
                  </span>
                  <span className="font-bold text-zinc-900 capitalize">
                    {scannedItem.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase text-concrete font-semibold block">
                    Stock
                  </span>
                  <span className="font-bold tabular-nums text-zinc-900">
                    {scannedItem.quantity} {scannedItem.unit}
                  </span>
                </div>
              </div>

              {/* Immediate Check In / Check Out Actions */}
              <div className="space-y-2">
                {scannedItem.status === 'checked_out' ? (
                  <button
                    onClick={() => {
                      checkInItem(scannedItem.id);
                      setScannedItem(null);
                    }}
                    className="w-full h-12 rounded-xl bg-[#2F8F5B] text-white font-bold text-xs flex items-center justify-center gap-2 tap-spring shadow-md active:bg-[#257349]"
                  >
                    <ArrowDownLeft className="w-4 h-4" />
                    <span>Check In / Return to Bin</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="bg-white p-3 rounded-xl border border-black/8 space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-concrete">
                        Check Out To
                      </label>
                      <input
                        type="text"
                        value={checkoutTo}
                        onChange={(e) => setCheckoutTo(e.target.value)}
                        className="w-full text-xs font-semibold text-[#1C1D1F] outline-hidden bg-transparent"
                        placeholder="Foreman or crew name"
                      />
                    </div>
                    <button
                      onClick={() => {
                        checkOutItem(scannedItem.id, checkoutTo);
                        setScannedItem(null);
                      }}
                      className="w-full h-12 rounded-xl bg-[#F2A900] text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 tap-spring shadow-md active:brightness-95"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                      <span>Confirm Check Out</span>
                    </button>
                  </div>
                )}

                <button
                  onClick={() => {
                    setScannedItem(null);
                    pushScreen({ type: 'item_detail', itemId: scannedItem.id });
                  }}
                  className="w-full h-11 rounded-xl bg-white border border-black/8 text-zinc-800 font-semibold text-xs tap-spring flex items-center justify-center"
                >
                  View Full Item Record
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manual SKU Input Modal */}
      <AnimatePresence>
        {manualCodeOpen && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setManualCodeOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative bg-[#F4F2EE] text-[#1C1D1F] rounded-t-[28px] p-5 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-black/6 pb-3">
                <h3 className="text-base font-semibold text-[#1C1D1F]">Manual Tag Entry</h3>
                <button
                  onClick={() => setManualCodeOpen(false)}
                  className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center text-xs font-semibold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleManualSearch} className="space-y-3">
                <div className="bg-white p-3 rounded-xl border border-black/8 space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-concrete">
                    Asset Tag / SKU / Serial
                  </label>
                  <input
                    type="text"
                    value={manualCodeInput}
                    onChange={(e) => setManualCodeInput(e.target.value)}
                    required
                    placeholder="e.g. HLT-TE70 or DWT"
                    className="w-full text-xs font-semibold text-[#1C1D1F] outline-hidden bg-transparent font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-[#1C1D1F] text-white font-bold text-xs tap-spring shadow-md"
                >
                  Lookup Asset
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
