import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxHeight?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxHeight = 'max-h-[85%]'
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end overflow-hidden">
          {/* Dimmed backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Draggable sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 400) {
                onClose();
              }
            }}
            className={`relative w-full ${maxHeight} bg-[#F4F2EE] rounded-t-[28px] shadow-2xl flex flex-col border-t border-black/10 overflow-hidden z-10`}
          >
            {/* Grab handle */}
            <div className="pt-2.5 pb-1 flex justify-center shrink-0 cursor-grab active:cursor-grabbing">
              <div className="w-10 h-1.5 bg-zinc-300 rounded-full" />
            </div>

            {/* Header if title exists */}
            {title && (
              <div className="px-5 pt-2 pb-3 border-b border-black/6 shrink-0 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-[#1C1D1F] tracking-tight">{title}</h3>
                  {subtitle && <p className="text-xs text-concrete mt-0.5">{subtitle}</p>}
                </div>
                <button
                  onClick={onClose}
                  className="tap-spring w-7 h-7 rounded-full bg-black/5 flex items-center justify-center text-xs font-semibold text-zinc-600 hover:bg-black/10"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-4 overscroll-contain">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
