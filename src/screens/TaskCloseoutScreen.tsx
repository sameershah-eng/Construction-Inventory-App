import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { TopBar } from '../components/TopBar';
import { SAMPLE_COMPLETION_PHOTOS } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  Camera,
  Plus,
  Trash2,
  CheckCircle2,
  Wrench,
  Clock,
  Sparkles
} from 'lucide-react';

interface TaskCloseoutScreenProps {
  taskId: string;
}

export const TaskCloseoutScreen: React.FC<TaskCloseoutScreenProps> = ({ taskId }) => {
  const tasks = useAppStore((s) => s.tasks);
  const completeTask = useAppStore((s) => s.completeTask);
  const popScreen = useAppStore((s) => s.popScreen);

  const task = tasks.find((t) => t.id === taskId);

  const [notes, setNotes] = useState(
    task?.notes || 'Replaced hydraulic return filters. Torqued drain plug to spec. No leaks detected during 15-minute high pressure idle test.'
  );
  const [partsUsed, setPartsUsed] = useState<string[]>(
    task?.partsUsed || ['CAT 1R-0716 High Efficiency Filter', '15W-40 Synthetic Oil (10 Gal)']
  );
  const [newPartInput, setNewPartInput] = useState('');
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>(
    task?.completionPhotos || [SAMPLE_COMPLETION_PHOTOS[0]]
  );

  const [isPhotoPickerOpen, setPhotoPickerOpen] = useState(false);
  const [showCompletionSuccess, setShowCompletionSuccess] = useState(false);

  if (!task) {
    return (
      <div className="flex-1 bg-[#F4F2EE] flex flex-col items-center justify-center p-6 text-center">
        <p className="text-sm font-semibold text-zinc-800">Task record not found</p>
        <button
          onClick={popScreen}
          className="mt-3 px-4 py-2 bg-[#1C1D1F] text-white rounded-xl text-xs font-semibold"
        >
          Return to Service
        </button>
      </div>
    );
  }

  const handleAddPart = () => {
    if (!newPartInput.trim()) return;
    setPartsUsed([...partsUsed, newPartInput.trim()]);
    setNewPartInput('');
  };

  const handleRemovePart = (index: number) => {
    setPartsUsed(partsUsed.filter((_, i) => i !== index));
  };

  const handleTogglePhoto = (url: string) => {
    if (selectedPhotos.includes(url)) {
      setSelectedPhotos(selectedPhotos.filter((p) => p !== url));
    } else {
      setSelectedPhotos([...selectedPhotos, url]);
    }
  };

  const handleCompleteOrder = () => {
    setShowCompletionSuccess(true);
    setTimeout(() => {
      completeTask(task.id, notes, partsUsed, selectedPhotos);
      setTimeout(() => {
        popScreen();
      }, 500);
    }, 900);
  };

  const isCompleted = task.status === 'completed';

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="flex-1 flex flex-col bg-[#F4F2EE] overflow-hidden relative"
    >
      <TopBar
        title="Work Order Signoff"
        isScrolled={true}
        canGoBack={true}
        onBack={popScreen}
        showSitePicker={false}
      />

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-2 pb-10 space-y-4 overscroll-contain">
        {/* Header Summary */}
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-concrete">
              Service Ticket
            </span>
            <span className="text-zinc-400">·</span>
            <span className="text-[10px] font-mono text-zinc-600">{task.id}</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#1C1D1F] leading-tight">
            {task.title}
          </h1>
          <p className="text-xs text-concrete mt-0.5">
            Asset: <span className="font-semibold text-zinc-800">{task.assetName}</span>
          </p>
        </div>

        {/* Task Details Card */}
        <div className="bg-white rounded-2xl border border-black/6 p-3.5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-concrete">Due Date</span>
            <span className="font-bold text-zinc-900">{task.dueDate}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-concrete">Assigned Technician</span>
            <span className="font-semibold text-zinc-800">{task.assignedMechanicName}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-concrete">Recurrence Pattern</span>
            <span className="font-medium text-zinc-800 capitalize">
              {task.recurrence.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Inspection & Technician Notes */}
        <div className="bg-white rounded-2xl border border-black/8 p-3.5 shadow-xs">
          <label className="block text-[10px] uppercase font-bold text-concrete mb-1">
            Service Signoff Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isCompleted}
            rows={3}
            placeholder="Record oil sample condition, belt tension, pressures, hours..."
            className="w-full text-xs font-medium text-[#1C1D1F] outline-hidden bg-transparent resize-none disabled:opacity-75"
          />
        </div>

        {/* Parts & Consumables Logged */}
        <div className="bg-white rounded-2xl border border-black/8 p-3.5 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-[10px] uppercase font-bold text-concrete tracking-wider">
              Parts & Supplies Logged
            </label>
            <span className="text-[10px] text-concrete">{partsUsed.length} parts</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {partsUsed.map((part, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 bg-black/5 text-[#1C1D1F] px-2.5 py-1 rounded-lg text-xs font-medium"
              >
                <span>{part}</span>
                {!isCompleted && (
                  <button
                    onClick={() => handleRemovePart(idx)}
                    className="text-zinc-400 hover:text-zinc-700"
                  >
                    ✕
                  </button>
                )}
              </span>
            ))}
          </div>

          {!isCompleted && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newPartInput}
                onChange={(e) => setNewPartInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPart())}
                placeholder="Add part or fluid sku..."
                className="flex-1 h-9 px-3 bg-black/4 rounded-xl text-xs font-medium text-[#1C1D1F] outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddPart}
                className="h-9 px-3 rounded-xl bg-[#1C1D1F] text-white text-xs font-semibold tap-spring"
              >
                Add
              </button>
            </div>
          )}
        </div>

        {/* Inspection Verification Photos */}
        <div className="bg-white rounded-2xl border border-black/8 p-3.5 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-[10px] uppercase font-bold text-concrete tracking-wider">
              Verification Photos
            </label>
            {!isCompleted && (
              <button
                type="button"
                onClick={() => setPhotoPickerOpen(true)}
                className="text-xs font-semibold text-[#F2A900] flex items-center gap-1 tap-spring"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Attach Photo</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            {selectedPhotos.map((url, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-black/5">
                <img src={url} alt="Inspection" className="w-full h-full object-cover" />
                {!isCompleted && (
                  <button
                    onClick={() => handleTogglePhoto(url)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center text-[10px]"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            {!isCompleted && selectedPhotos.length < 3 && (
              <button
                type="button"
                onClick={() => setPhotoPickerOpen(true)}
                className="aspect-square rounded-xl border border-dashed border-black/15 flex flex-col items-center justify-center text-concrete hover:border-black/30 tap-spring"
              >
                <Plus className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-medium">Add Photo</span>
              </button>
            )}
          </div>
        </div>

        {/* Completion Action */}
        <div className="pt-2">
          {isCompleted ? (
            <div className="p-3.5 rounded-xl bg-[#2F8F5B]/15 border border-[#2F8F5B]/30 flex items-center justify-center gap-2 text-[#2F8F5B] font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>Service Closed & Verified ({task.completedDate})</span>
            </div>
          ) : (
            <button
              onClick={handleCompleteOrder}
              disabled={showCompletionSuccess}
              className="w-full h-13 rounded-xl bg-[#2F8F5B] text-white font-bold text-sm tap-spring shadow-md flex items-center justify-center gap-2 active:bg-[#257349]"
            >
              <Check className="w-5 h-5 stroke-[2.5]" />
              <span>Mark Service Complete</span>
            </button>
          )}
        </div>
      </div>

      {/* Preset Photo Picker Sheet */}
      <AnimatePresence>
        {isPhotoPickerOpen && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPhotoPickerOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative bg-[#F4F2EE] rounded-t-[28px] p-5 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-black/6 pb-3">
                <h3 className="text-base font-semibold text-[#1C1D1F]">
                  Select Field Inspection Photo
                </h3>
                <button
                  onClick={() => setPhotoPickerOpen(false)}
                  className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center text-xs font-semibold"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {SAMPLE_COMPLETION_PHOTOS.map((photo, i) => {
                  const isSelected = selectedPhotos.includes(photo);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleTogglePhoto(photo)}
                      className={`relative aspect-4/3 rounded-xl overflow-hidden border-2 tap-spring ${
                        isSelected ? 'border-[#F2A900] ring-2 ring-[#F2A900]/30' : 'border-transparent'
                      }`}
                    >
                      <img src={photo} alt="Sample" className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#F2A900] text-black flex items-center justify-center font-bold text-xs shadow-xs">
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setPhotoPickerOpen(false)}
                className="w-full h-11 rounded-xl bg-[#1C1D1F] text-white font-semibold text-xs tap-spring"
              >
                Attach Selected ({selectedPhotos.length})
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Satisfying Check Completion Overlay */}
      <AnimatePresence>
        {showCompletionSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#1C1D1F]/90 backdrop-blur-md flex flex-col items-center justify-center text-white"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 12, stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-[#2F8F5B] flex items-center justify-center text-white shadow-2xl mb-4"
            >
              <Check className="w-10 h-10 stroke-[3]" />
            </motion.div>
            <h3 className="text-xl font-bold tracking-tight">Work Order Verified</h3>
            <p className="text-xs text-zinc-300 mt-1">Logged to asset maintenance history</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
