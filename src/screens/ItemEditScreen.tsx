import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { TopBar } from '../components/TopBar';
import { InventoryCategory, InventoryItem } from '../types';
import { motion } from 'motion/react';
import { Check, X } from 'lucide-react';

interface ItemEditScreenProps {
  itemId?: string;
}

export const ItemEditScreen: React.FC<ItemEditScreenProps> = ({ itemId }) => {
  const inventory = useAppStore((s) => s.inventory);
  const sites = useAppStore((s) => s.sites);
  const selectedSiteId = useAppStore((s) => s.selectedSiteId);
  const popScreen = useAppStore((s) => s.popScreen);
  const addInventoryItem = useAppStore((s) => s.addInventoryItem);
  const updateInventoryItem = useAppStore((s) => s.updateInventoryItem);

  const existingItem = itemId ? inventory.find((i) => i.id === itemId) : null;

  const [name, setName] = useState(existingItem?.name || '');
  const [sku, setSku] = useState(existingItem?.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`);
  const [category, setCategory] = useState<InventoryCategory>(existingItem?.category || 'equipment');
  const [quantity, setQuantity] = useState(existingItem ? existingItem.quantity.toString() : '1');
  const [minQuantity, setMinQuantity] = useState(existingItem ? existingItem.minQuantity.toString() : '2');
  const [unit, setUnit] = useState(existingItem?.unit || 'Units');
  const [binLocation, setBinLocation] = useState(existingItem?.binLocation || 'Rack A-01');
  const [siteId, setSiteId] = useState(existingItem?.siteId || (selectedSiteId === 'all' ? 'site-1' : selectedSiteId));
  const [model, setModel] = useState(existingItem?.model || '');
  const [notes, setNotes] = useState(existingItem?.notes || '');
  const [imageUrl, setImageUrl] = useState(existingItem?.imageUrl || 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=70&auto=format');

  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Item name is required.');
      return;
    }

    const qty = parseInt(quantity, 10) || 0;
    const minQty = parseInt(minQuantity, 10) || 1;

    if (existingItem) {
      const updated: InventoryItem = {
        ...existingItem,
        name: name.trim(),
        sku: sku.trim(),
        category,
        quantity: qty,
        minQuantity: minQty,
        unit: unit.trim(),
        binLocation: binLocation.trim(),
        siteId,
        model: model.trim(),
        notes: notes.trim(),
        imageUrl
      };
      updateInventoryItem(updated);
    } else {
      addInventoryItem({
        name: name.trim(),
        sku: sku.trim(),
        category,
        quantity: qty,
        minQuantity: minQty,
        unit: unit.trim(),
        binLocation: binLocation.trim(),
        siteId,
        status: 'available',
        model: model.trim(),
        notes: notes.trim(),
        imageUrl
      });
    }

    popScreen();
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="flex-1 flex flex-col bg-[#F4F2EE] overflow-hidden relative"
    >
      <TopBar
        title={existingItem ? 'Edit Item' : 'Add Item'}
        isScrolled={true}
        canGoBack={true}
        onBack={popScreen}
        showSitePicker={false}
      />

      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto no-scrollbar px-4 pt-2 pb-10 space-y-4 overscroll-contain"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-[#1C1D1F]">
            {existingItem ? 'Modify SKU Record' : 'Register Toolroom Asset'}
          </h1>
          <span className="text-[10px] text-concrete uppercase font-semibold">
            {category}
          </span>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-[#C8452D] rounded-xl text-xs text-[#C8452D] font-medium">
            {error}
          </div>
        )}

        {/* Category Picker Segment */}
        <div>
          <label className="text-[10px] uppercase font-bold text-concrete tracking-wider block mb-1.5 px-0.5">
            Category
          </label>
          <div className="grid grid-cols-3 gap-1 p-1 bg-black/6 rounded-xl">
            {(
              [
                { id: 'equipment', label: 'Equipment' },
                { id: 'parts', label: 'Parts' },
                { id: 'consumables', label: 'Consumables' }
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`py-1.5 text-xs font-semibold rounded-lg tap-spring transition-all ${
                  category === cat.id
                    ? 'bg-[#1C1D1F] text-white shadow-xs'
                    : 'text-zinc-600 bg-transparent'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grouped Inset Section 1: Core Info */}
        <div className="bg-white rounded-2xl border border-black/8 overflow-hidden divide-y divide-black/6 shadow-xs">
          <div className="px-3.5 py-2.5">
            <label className="block text-[10px] uppercase font-semibold text-concrete">
              Tool / Item Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              required
              placeholder="e.g. Hilti TE 70 Rotary Hammer"
              className="w-full text-xs font-medium text-[#1C1D1F] outline-hidden bg-transparent pt-0.5"
            />
          </div>

          <div className="px-3.5 py-2.5">
            <label className="block text-[10px] uppercase font-semibold text-concrete">
              SKU / Asset Code
            </label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              required
              placeholder="HLT-TE70-001"
              className="w-full text-xs font-medium text-[#1C1D1F] outline-hidden bg-transparent font-mono pt-0.5"
            />
          </div>

          <div className="px-3.5 py-2.5">
            <label className="block text-[10px] uppercase font-semibold text-concrete">
              Model / Specification
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="TE 70-ATC/AVR"
              className="w-full text-xs font-medium text-[#1C1D1F] outline-hidden bg-transparent pt-0.5"
            />
          </div>
        </div>

        {/* Grouped Inset Section 2: Stock & Location */}
        <div className="bg-white rounded-2xl border border-black/8 overflow-hidden divide-y divide-black/6 shadow-xs">
          <div className="grid grid-cols-2 divide-x divide-black/6">
            <div className="px-3.5 py-2.5">
              <label className="block text-[10px] uppercase font-semibold text-concrete">
                Current Quantity
              </label>
              <input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full text-xs font-semibold text-[#1C1D1F] outline-hidden bg-transparent pt-0.5 tabular-nums"
              />
            </div>
            <div className="px-3.5 py-2.5">
              <label className="block text-[10px] uppercase font-semibold text-concrete">
                Min Reorder Level
              </label>
              <input
                type="number"
                min="0"
                value={minQuantity}
                onChange={(e) => setMinQuantity(e.target.value)}
                className="w-full text-xs font-semibold text-[#1C1D1F] outline-hidden bg-transparent pt-0.5 tabular-nums"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 divide-x divide-black/6">
            <div className="px-3.5 py-2.5">
              <label className="block text-[10px] uppercase font-semibold text-concrete">
                Unit of Measure
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Units, Boxes, Pairs"
                className="w-full text-xs font-medium text-[#1C1D1F] outline-hidden bg-transparent pt-0.5"
              />
            </div>
            <div className="px-3.5 py-2.5">
              <label className="block text-[10px] uppercase font-semibold text-concrete">
                Bin Location
              </label>
              <input
                type="text"
                value={binLocation}
                onChange={(e) => setBinLocation(e.target.value)}
                placeholder="Rack A-02"
                className="w-full text-xs font-medium text-[#1C1D1F] outline-hidden bg-transparent pt-0.5 font-mono"
              />
            </div>
          </div>

          <div className="px-3.5 py-2.5">
            <label className="block text-[10px] uppercase font-semibold text-concrete">
              Assigned Job Site
            </label>
            <select
              value={siteId}
              onChange={(e) => setSiteId(e.target.value)}
              className="w-full text-xs font-medium text-[#1C1D1F] outline-hidden bg-transparent pt-0.5"
            >
              {sites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grouped Inset Section 3: Notes */}
        <div className="bg-white rounded-2xl border border-black/8 p-3.5 shadow-xs">
          <label className="block text-[10px] uppercase font-semibold text-concrete mb-1">
            Inspection & Tool Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Special instructions, torque specifications, maintenance notes..."
            className="w-full text-xs font-medium text-[#1C1D1F] outline-hidden bg-transparent resize-none"
          />
        </div>

        {/* Submit Buttons */}
        <div className="pt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={popScreen}
            className="flex-1 h-12 rounded-xl bg-white border border-black/8 text-zinc-700 font-semibold text-xs tap-spring active:bg-zinc-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 h-12 rounded-xl bg-[#F2A900] text-zinc-950 font-bold text-xs tap-spring shadow-md flex items-center justify-center gap-1.5 active:brightness-95"
          >
            <Check className="w-4 h-4" />
            <span>{existingItem ? 'Save Changes' : 'Create Item'}</span>
          </button>
        </div>
      </form>
    </motion.div>
  );
};
