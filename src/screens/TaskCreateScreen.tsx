import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { TopBar } from '../components/TopBar';
import { TaskPriority, TaskRecurrence } from '../types';
import { motion } from 'motion/react';
import { Check, Calendar } from 'lucide-react';

interface TaskCreateScreenProps {
  assetId?: string;
}

export const TaskCreateScreen: React.FC<TaskCreateScreenProps> = ({ assetId }) => {
  const assets = useAppStore((s) => s.assets);
  const users = useAppStore((s) => s.users);
  const sites = useAppStore((s) => s.sites);
  const selectedSiteId = useAppStore((s) => s.selectedSiteId);
  const popScreen = useAppStore((s) => s.popScreen);
  const createTask = useAppStore((s) => s.createTask);

  const initialAsset = assetId ? assets.find((a) => a.id === assetId) : assets[0];
  const mechanics = users.filter((u) => u.role === 'mechanic' || u.role === 'admin');

  const [title, setTitle] = useState('');
  const [selectedAssetId, setSelectedAssetId] = useState(initialAsset?.id || assets[0]?.id || '');
  const [siteId, setSiteId] = useState(
    initialAsset?.siteId || (selectedSiteId === 'all' ? 'site-1' : selectedSiteId)
  );
  const [dueDate, setDueDate] = useState('2026-10-25');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [recurrence, setRecurrence] = useState<TaskRecurrence>('every_30_days');
  const [assignedMechanicId, setAssignedMechanicId] = useState(mechanics[0]?.id || 'user-4');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const currentAsset = assets.find((a) => a.id === selectedAssetId);
  const assignedMechanic = users.find((u) => u.id === assignedMechanicId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    createTask({
      title: title.trim(),
      assetId: selectedAssetId,
      assetName: currentAsset?.name || 'Heavy Equipment',
      siteId,
      dueDate,
      priority,
      recurrence,
      assignedMechanicId,
      assignedMechanicName: assignedMechanic?.name || 'Assigned Tech',
      notes: notes.trim()
    });

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
        title="Schedule Service"
        isScrolled={true}
        canGoBack={true}
        onBack={popScreen}
        showSitePicker={false}
      />

      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto no-scrollbar px-4 pt-2 pb-10 space-y-4 overscroll-contain"
      >
        <div>
          <span className="text-[10px] uppercase font-bold text-concrete tracking-wider block">
            Preventative Maintenance
          </span>
          <h1 className="text-xl font-bold tracking-tight text-[#1C1D1F]">
            New Work Order
          </h1>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-[#C8452D] rounded-xl text-xs text-[#C8452D] font-medium">
            {error}
          </div>
        )}

        {/* Priority Segmented Selector */}
        <div>
          <label className="text-[10px] uppercase font-bold text-concrete tracking-wider block mb-1.5 px-0.5">
            Priority Level
          </label>
          <div className="grid grid-cols-3 gap-1 p-1 bg-black/6 rounded-xl">
            {(
              [
                { id: 'low', label: 'Low' },
                { id: 'medium', label: 'Medium' },
                { id: 'high', label: 'High' }
              ] as const
            ).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPriority(p.id)}
                className={`py-1.5 text-xs font-semibold rounded-lg tap-spring transition-all ${
                  priority === p.id
                    ? p.id === 'high'
                      ? 'bg-[#C8452D] text-white'
                      : 'bg-[#1C1D1F] text-white shadow-xs'
                    : 'text-zinc-600 bg-transparent'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grouped Form Inset Section 1: Task Title & Target Asset */}
        <div className="bg-white rounded-2xl border border-black/8 overflow-hidden divide-y divide-black/6 shadow-xs">
          <div className="px-3.5 py-2.5">
            <label className="block text-[10px] uppercase font-semibold text-concrete">
              Service Task Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              required
              placeholder="e.g. 500-Hr Hydraulic Filter & Fluid Change"
              className="w-full text-xs font-medium text-[#1C1D1F] outline-hidden bg-transparent pt-0.5"
            />
          </div>

          <div className="px-3.5 py-2.5">
            <label className="block text-[10px] uppercase font-semibold text-concrete">
              Target Asset / Machine
            </label>
            <select
              value={selectedAssetId}
              onChange={(e) => {
                setSelectedAssetId(e.target.value);
                const a = assets.find((item) => item.id === e.target.value);
                if (a) setSiteId(a.siteId);
              }}
              className="w-full text-xs font-medium text-[#1C1D1F] outline-hidden bg-transparent pt-0.5"
            >
              {assets.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.model})
                </option>
              ))}
            </select>
          </div>

          <div className="px-3.5 py-2.5">
            <label className="block text-[10px] uppercase font-semibold text-concrete">
              Job Site
            </label>
            <select
              value={siteId}
              onChange={(e) => setSiteId(e.target.value)}
              className="w-full text-xs font-medium text-[#1C1D1F] outline-hidden bg-transparent pt-0.5"
            >
              {sites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grouped Form Inset Section 2: Due Date & Recurrence */}
        <div className="bg-white rounded-2xl border border-black/8 overflow-hidden divide-y divide-black/6 shadow-xs">
          <div className="px-3.5 py-2.5">
            <label className="block text-[10px] uppercase font-semibold text-concrete">
              Target Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className="w-full text-xs font-medium text-[#1C1D1F] outline-hidden bg-transparent pt-0.5"
            />
          </div>

          <div className="px-3.5 py-2.5">
            <label className="block text-[10px] uppercase font-semibold text-concrete">
              Recurrence Interval
            </label>
            <select
              value={recurrence}
              onChange={(e) => setRecurrence(e.target.value as TaskRecurrence)}
              className="w-full text-xs font-medium text-[#1C1D1F] outline-hidden bg-transparent pt-0.5"
            >
              <option value="none">One-off Inspection</option>
              <option value="every_30_days">Every 30 Days (Monthly)</option>
              <option value="every_250_hours">Every 250 Engine Hours</option>
              <option value="monthly">Quarterly OSHA Compliance</option>
            </select>
          </div>

          <div className="px-3.5 py-2.5">
            <label className="block text-[10px] uppercase font-semibold text-concrete">
              Assigned Field Mechanic
            </label>
            <select
              value={assignedMechanicId}
              onChange={(e) => setAssignedMechanicId(e.target.value)}
              className="w-full text-xs font-medium text-[#1C1D1F] outline-hidden bg-transparent pt-0.5"
            >
              {mechanics.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.title})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grouped Form Inset Section 3: Work Order Notes */}
        <div className="bg-white rounded-2xl border border-black/8 p-3.5 shadow-xs">
          <label className="block text-[10px] uppercase font-semibold text-concrete mb-1">
            Procedure Checklist / Safety Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Specify filter part numbers, torque specifications, lockout/tagout procedures..."
            className="w-full text-xs font-medium text-[#1C1D1F] outline-hidden bg-transparent resize-none"
          />
        </div>

        {/* Submit Actions */}
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
            <span>Create Work Order</span>
          </button>
        </div>
      </form>
    </motion.div>
  );
};
