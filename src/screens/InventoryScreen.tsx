import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { TopBar } from '../components/TopBar';
import { SafeImage } from '../components/SafeImage';
import { InventoryCategory, InventoryItem } from '../types';
import {
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  AlertCircle,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const InventoryScreen: React.FC = () => {
  const inventory = useAppStore((s) => s.inventory);
  const selectedSiteId = useAppStore((s) => s.selectedSiteId);
  const currentUser = useAppStore((s) => s.currentUser);
  const pushScreen = useAppStore((s) => s.pushScreen);
  const checkOutItem = useAppStore((s) => s.checkOutItem);
  const checkInItem = useAppStore((s) => s.checkInItem);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<InventoryCategory | 'all'>('all');
  const [isScrolled, setIsScrolled] = useState(false);
  const [swipedItemId, setSwipedItemId] = useState<string | null>(null);

  // Quick checkout modal state
  const [checkoutTarget, setCheckoutTarget] = useState<InventoryItem | null>(null);
  const [recipientName, setRecipientName] = useState(currentUser.name);

  // Role check: Storekeeper and Admin can add/edit items
  const canManageInventory = currentUser.role === 'admin' || currentUser.role === 'storekeeper';

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setIsScrolled(e.currentTarget.scrollTop > 24);
  };

  // Filter items
  const siteItems = selectedSiteId === 'all'
    ? inventory
    : inventory.filter((i) => i.siteId === selectedSiteId);

  const filteredItems = siteItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.sku.toLowerCase().includes(q) ||
      item.binLocation.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  const lowStockCount = siteItems.filter((i) => i.quantity <= i.minQuantity).length;

  const handleQuickCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutTarget) return;
    checkOutItem(checkoutTarget.id, recipientName);
    setCheckoutTarget(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F4F2EE] overflow-hidden relative">
      <TopBar title="Toolroom Inventory" isScrolled={isScrolled} showSitePicker={true} />

      <div
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto no-scrollbar px-4 pt-1 pb-8 space-y-3.5 overscroll-contain"
      >
        {/* Large iOS Header Title with Action Button */}
        <div className="flex items-end justify-between pt-1">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-concrete">
              Tool Crib & Supplies
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-[#1C1D1F]">
              Inventory
            </h1>
          </div>

          {canManageInventory && (
            <button
              onClick={() => pushScreen({ type: 'item_edit' })}
              className="tap-spring h-9 px-3 rounded-xl bg-[#1C1D1F] text-white flex items-center gap-1.5 text-xs font-semibold shadow-xs active:bg-zinc-800"
            >
              <Plus className="w-4 h-4 text-[#F2A900]" />
              <span>Add Item</span>
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-concrete absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tool name, SKU, or bin location..."
            className="w-full h-10 pl-9 pr-8 bg-white border border-black/8 rounded-xl text-xs font-medium text-[#1C1D1F] placeholder-zinc-400 outline-hidden focus:border-[#F2A900] shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Segmented Category Filter Bar */}
        <div className="flex items-center gap-1 p-1 bg-black/6 rounded-xl">
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'equipment', label: 'Equipment' },
              { id: 'parts', label: 'Parts' },
              { id: 'consumables', label: 'Consumables' }
            ] as const
          ).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all tap-spring text-center ${
                selectedCategory === cat.id
                  ? 'bg-[#1C1D1F] text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 bg-transparent'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Low Stock Warning Banner if present */}
        {lowStockCount > 0 && selectedCategory === 'all' && !searchQuery && (
          <div className="p-3 bg-amber-500/10 border border-[#F2A900]/30 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-zinc-900 font-medium">
              <AlertCircle className="w-4 h-4 text-[#F2A900] shrink-0" />
              <span>{lowStockCount} items below minimum reorder threshold</span>
            </div>
            <span className="text-[10px] font-bold text-zinc-700 font-mono">Restock</span>
          </div>
        )}

        {/* Items List */}
        <div className="space-y-2">
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-black/6">
              <p className="text-sm font-semibold text-zinc-800">No items found</p>
              <p className="text-xs text-concrete mt-1">
                Try adjusting your search terms or filter selection.
              </p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const isLowStock = item.quantity <= item.minQuantity && item.category !== 'equipment';
              const isCheckedOut = item.status === 'checked_out';
              const isSwiped = swipedItemId === item.id;

              return (
                <div
                  key={item.id}
                  className="relative overflow-hidden rounded-2xl bg-white border border-black/6 shadow-xs select-none"
                >
                  {/* Revealed Swipe Action Buttons underneath */}
                  <div className="absolute inset-y-0 right-0 flex items-stretch">
                    {isCheckedOut ? (
                      <button
                        onClick={() => {
                          checkInItem(item.id);
                          setSwipedItemId(null);
                        }}
                        className="w-20 bg-[#2F8F5B] text-white text-[11px] font-bold flex flex-col items-center justify-center tap-spring"
                      >
                        <ArrowDownLeft className="w-4 h-4 mb-0.5" />
                        <span>Check In</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setCheckoutTarget(item);
                          setSwipedItemId(null);
                        }}
                        className="w-20 bg-[#F2A900] text-zinc-950 text-[11px] font-bold flex flex-col items-center justify-center tap-spring"
                      >
                        <ArrowUpRight className="w-4 h-4 mb-0.5" />
                        <span>Check Out</span>
                      </button>
                    )}
                  </div>

                  {/* Main Draggable / Swipable Row */}
                  <motion.div
                    drag="x"
                    dragConstraints={{ left: -85, right: 0 }}
                    dragElastic={0.1}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -40) {
                        setSwipedItemId(item.id);
                      } else {
                        setSwipedItemId(null);
                      }
                    }}
                    animate={{ x: isSwiped ? -85 : 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                    onClick={() => {
                      if (isSwiped) {
                        setSwipedItemId(null);
                      } else {
                        pushScreen({ type: 'item_detail', itemId: item.id });
                      }
                    }}
                    className="p-3 bg-white flex items-center gap-3 relative z-10 cursor-pointer"
                  >
                    {/* Item Thumbnail */}
                    <SafeImage
                      src={item.imageUrl}
                      alt={item.name}
                      category={item.category}
                      className="w-13 h-13 rounded-xl shrink-0"
                    />

                    {/* Metadata */}
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-concrete uppercase">
                          {item.sku}
                        </span>
                        <span className="text-[10px] text-zinc-400">·</span>
                        <span className="text-[10px] text-concrete font-medium">
                          {item.binLocation}
                        </span>
                      </div>

                      <h3 className="text-xs font-semibold text-[#1C1D1F] truncate mt-0.5">
                        {item.name}
                      </h3>

                      <div className="flex items-center gap-2 mt-1">
                        {isCheckedOut ? (
                          <span className="text-[10px] font-semibold text-[#F2A900] bg-amber-500/10 px-1.5 py-0.2 rounded-sm">
                            Checked Out to {item.checkedOutTo || 'Crew'}
                          </span>
                        ) : isLowStock ? (
                          <span className="text-[10px] font-semibold text-[#C8452D] bg-[#C8452D]/10 px-1.5 py-0.2 rounded-sm">
                            Low Stock: {item.quantity} {item.unit}
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-[#2F8F5B]">
                            {item.quantity} {item.unit} available
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity or Chevron */}
                    <div className="text-right shrink-0">
                      <span className="text-sm font-bold text-[#1C1D1F] tabular-nums block">
                        {item.quantity}
                      </span>
                      <span className="text-[10px] text-concrete block">
                        {item.unit}
                      </span>
                    </div>
                  </motion.div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Quick Check Out Modal Sheet */}
      <AnimatePresence>
        {checkoutTarget && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCheckoutTarget(null)}
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
                  <h3 className="text-base font-semibold text-[#1C1D1F]">Quick Check Out</h3>
                  <p className="text-xs text-concrete">{checkoutTarget.name}</p>
                </div>
                <button
                  onClick={() => setCheckoutTarget(null)}
                  className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center text-xs font-semibold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleQuickCheckoutSubmit} className="space-y-3">
                <div className="bg-white p-3 rounded-xl border border-black/8 space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-concrete">
                    Assigned Person / Crew
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    required
                    placeholder="Enter foreman or operator name"
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
    </div>
  );
};
