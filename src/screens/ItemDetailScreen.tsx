import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { TopBar } from '../components/TopBar';
import { SafeImage } from '../components/SafeImage';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Edit3,
  Trash2,
  MapPin,
  Tag,
  AlertCircle,
  Clock,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ItemDetailScreenProps {
  itemId: string;
}

export const ItemDetailScreen: React.FC<ItemDetailScreenProps> = ({ itemId }) => {
  const inventory = useAppStore((s) => s.inventory);
  const sites = useAppStore((s) => s.sites);
  const currentUser = useAppStore((s) => s.currentUser);
  const activities = useAppStore((s) => s.activities);
  const popScreen = useAppStore((s) => s.popScreen);
  const pushScreen = useAppStore((s) => s.pushScreen);
  const checkOutItem = useAppStore((s) => s.checkOutItem);
  const checkInItem = useAppStore((s) => s.checkInItem);
  const deleteInventoryItem = useAppStore((s) => s.deleteInventoryItem);

  const [isCheckoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [recipient, setRecipient] = useState(currentUser.name);
  const [isScrolled, setIsScrolled] = useState(false);

  const item = inventory.find((i) => i.id === itemId);
  if (!item) {
    return (
      <div className="flex-1 bg-[#F4F2EE] flex flex-col items-center justify-center p-6 text-center">
        <p className="text-sm font-semibold text-zinc-800">Item not found</p>
        <button
          onClick={popScreen}
          className="mt-3 px-4 py-2 bg-[#1C1D1F] text-white rounded-xl text-xs font-semibold"
        >
          Return to Inventory
        </button>
      </div>
    );
  }

  const site = sites.find((s) => s.id === item.siteId);
  const isCheckedOut = item.status === 'checked_out';
  const isLowStock = item.quantity <= item.minQuantity && item.category !== 'equipment';

  // Stock percentage calculation for bar
  const maxStockReference = Math.max(item.minQuantity * 3, item.quantity, 10);
  const stockPercentage = Math.min(100, Math.round((item.quantity / maxStockReference) * 100));

  // Role permissions
  const canEdit = currentUser.role === 'admin' || currentUser.role === 'storekeeper';
  const canDelete = currentUser.role === 'admin';

  // Item activity history
  const itemActivities = activities.filter(
    (a) => a.itemId === item.id || (a.itemName && a.itemName.includes(item.name.slice(0, 10)))
  );

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkOutItem(item.id, recipient);
    setCheckoutModalOpen(false);
  };

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
        title={item.name}
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
            src={item.imageUrl}
            alt={item.name}
            category={item.category}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 left-3">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[#1C1D1F]/80 backdrop-blur-md text-white">
              {item.category}
            </span>
          </div>

          <div className="absolute bottom-3 right-3">
            {isCheckedOut ? (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#F2A900] text-zinc-950 shadow-sm">
                Checked Out
              </span>
            ) : isLowStock ? (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#C8452D] text-white shadow-sm">
                Low Stock Warning
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#2F8F5B] text-white shadow-sm">
                In Tool Crib
              </span>
            )}
          </div>
        </div>

        {/* Header Title & SKU */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-concrete font-bold tracking-wider">
              {item.sku}
            </span>
            {item.model && (
              <>
                <span className="text-zinc-300">·</span>
                <span className="text-[11px] text-concrete font-medium">{item.model}</span>
              </>
            )}
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#1C1D1F] mt-0.5">
            {item.name}
          </h1>
          <p className="text-xs text-concrete mt-1">{item.notes || 'No notes specified.'}</p>
        </div>

        {/* Stock Level Bar */}
        <div className="bg-white p-3.5 rounded-2xl border border-black/6 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#1C1D1F]">Stock Level</span>
            <span className="font-bold tabular-nums text-zinc-900">
              {item.quantity} {item.unit} on hand
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-black/5 rounded-full overflow-hidden">
            <div
              style={{ width: `${stockPercentage}%` }}
              className={`h-full rounded-full transition-all duration-300 ${
                isCheckedOut
                  ? 'bg-amber-400'
                  : isLowStock
                  ? 'bg-[#C8452D]'
                  : 'bg-[#2F8F5B]'
              }`}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-concrete">
            <span>Min Alert: {item.minQuantity} {item.unit}</span>
            <span>Target: {item.minQuantity * 2} {item.unit}</span>
          </div>
        </div>

        {/* Primary Actions (Natural Thumb Zone) */}
        <div className="flex items-center gap-2">
          {isCheckedOut ? (
            <button
              onClick={() => checkInItem(item.id)}
              className="flex-1 h-12 rounded-xl bg-[#2F8F5B] text-white font-bold text-xs flex items-center justify-center gap-2 tap-spring shadow-md active:bg-[#257349]"
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Log Return (Check In)</span>
            </button>
          ) : (
            <button
              onClick={() => setCheckoutModalOpen(true)}
              className="flex-1 h-12 rounded-xl bg-[#F2A900] text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 tap-spring shadow-md active:brightness-95"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Check Out to Crew</span>
            </button>
          )}

          {canEdit && (
            <button
              onClick={() => pushScreen({ type: 'item_edit', itemId: item.id })}
              className="w-12 h-12 rounded-xl bg-white border border-black/8 text-zinc-700 flex items-center justify-center tap-spring active:bg-zinc-100"
              title="Edit Item"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}

          {canDelete && (
            <button
              onClick={() => deleteInventoryItem(item.id)}
              className="w-12 h-12 rounded-xl bg-white border border-red-200 text-[#C8452D] flex items-center justify-center tap-spring active:bg-red-50"
              title="Delete Item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Location & Toolroom Details */}
        <div className="bg-white rounded-2xl border border-black/6 divide-y divide-black/6 shadow-xs">
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-concrete" />
              <span className="text-xs font-semibold text-zinc-700">Bin Location</span>
            </div>
            <span className="text-xs font-bold text-[#1C1D1F] font-mono">{item.binLocation}</span>
          </div>

          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Building2 className="w-4 h-4 text-concrete" />
              <span className="text-xs font-semibold text-zinc-700">Current Job Site</span>
            </div>
            <span className="text-xs font-medium text-[#1C1D1F]">{site?.name || 'Central Toolroom'}</span>
          </div>

          {isCheckedOut && (
            <div className="p-3.5 flex items-center justify-between bg-amber-50/50">
              <div className="flex items-center gap-2.5">
                <Tag className="w-4 h-4 text-[#F2A900]" />
                <span className="text-xs font-semibold text-zinc-800">Possession</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-zinc-900 block">{item.checkedOutTo}</span>
                <span className="text-[10px] text-concrete">{item.checkedOutDate}</span>
              </div>
            </div>
          )}
        </div>

        {/* Item Activity Log */}
        <div>
          <span className="text-xs font-bold text-[#1C1D1F] uppercase tracking-wider px-1 block mb-2">
            Item Movement History
          </span>
          <div className="bg-white rounded-2xl border border-black/6 overflow-hidden divide-y divide-black/6 shadow-xs">
            {itemActivities.length === 0 ? (
              <div className="p-4 text-center text-xs text-concrete">
                No recent activity logged for this item
              </div>
            ) : (
              itemActivities.map((act) => (
                <div key={act.id} className="p-3 text-left flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-black/5 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-3 h-3 text-zinc-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-zinc-800 leading-tight">
                      {act.description}
                    </p>
                    <p className="text-[10px] text-concrete mt-0.5">
                      {act.userName} · {act.timestamp}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Check Out Sheet Modal */}
      <AnimatePresence>
        {isCheckoutModalOpen && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCheckoutModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative bg-[#F4F2EE] rounded-t-[28px] p-5 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-black/6 pb-3">
                <div>
                  <h3 className="text-base font-semibold text-[#1C1D1F]">Check Out Item</h3>
                  <p className="text-xs text-concrete">{item.name}</p>
                </div>
                <button
                  onClick={() => setCheckoutModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center text-xs font-semibold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCheckoutSubmit} className="space-y-3">
                <div className="bg-white p-3 rounded-xl border border-black/8 space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-concrete">
                    Assigned Person / Subcontractor
                  </label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    required
                    placeholder="e.g. Elena Rostova or Concrete Crew 2"
                    className="w-full text-xs font-medium text-[#1C1D1F] outline-hidden bg-transparent"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-[#F2A900] text-zinc-950 font-bold text-xs tap-spring shadow-md"
                >
                  Confirm Check Out
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
