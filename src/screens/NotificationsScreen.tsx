import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { TopBar } from '../components/TopBar';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  Package,
  Layers,
  Check
} from 'lucide-react';
import { motion } from 'motion/react';

export const NotificationsScreen: React.FC = () => {
  const notifications = useAppStore((s) => s.notifications);
  const markNotificationRead = useAppStore((s) => s.markNotificationRead);
  const clearAllNotifications = useAppStore((s) => s.clearAllNotifications);
  const popScreen = useAppStore((s) => s.popScreen);

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-[#C8452D]" />;
      case 'service':
        return <Wrench className="w-4 h-4 text-[#F2A900]" />;
      case 'inventory':
        return <Package className="w-4 h-4 text-amber-600" />;
      default:
        return <Layers className="w-4 h-4 text-zinc-600" />;
    }
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
        title="Notifications"
        isScrolled={true}
        canGoBack={true}
        onBack={popScreen}
        showSitePicker={false}
      />

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-2 pb-10 space-y-4 overscroll-contain">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#1C1D1F]">
              Activity & Alerts
            </h1>
            <p className="text-xs text-concrete">Toolroom broadcasts and service triggers</p>
          </div>

          <button
            onClick={clearAllNotifications}
            className="text-xs font-semibold text-[#F2A900] tap-spring py-1 px-2.5 rounded-lg bg-[#1C1D1F]"
          >
            Mark All Read
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-black/6 overflow-hidden divide-y divide-black/6 shadow-xs">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <CheckCircle2 className="w-8 h-8 text-[#2F8F5B] mx-auto mb-2" />
              <p className="text-sm font-semibold text-zinc-800">Inbox is Clear</p>
              <p className="text-xs text-concrete mt-1">No alerts or unread notifications.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer tap-spring ${
                  !notif.read ? 'bg-amber-50/40' : 'hover:bg-black/2'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-black/5 flex items-center justify-center shrink-0 mt-0.5">
                  {getNotifIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="text-xs font-bold text-[#1C1D1F] truncate">
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-concrete shrink-0">{notif.timestamp}</span>
                  </div>
                  <p className="text-xs text-zinc-600 leading-snug">{notif.message}</p>
                </div>

                {!notif.read && (
                  <div className="w-2 h-2 rounded-full bg-[#F2A900] shrink-0 mt-2" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};
