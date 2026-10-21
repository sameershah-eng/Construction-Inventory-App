import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { TopBar } from '../components/TopBar';
import { MaintenanceTask, TaskPriority, TaskRecurrence } from '../types';
import {
  Calendar as CalendarIcon,
  List,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Wrench,
  Check,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ServiceScreen: React.FC = () => {
  const tasks = useAppStore((s) => s.tasks);
  const selectedSiteId = useAppStore((s) => s.selectedSiteId);
  const currentUser = useAppStore((s) => s.currentUser);
  const pushScreen = useAppStore((s) => s.pushScreen);

  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [isScrolled, setIsScrolled] = useState(false);

  // Month navigation state for Calendar view (October 2026 based on mock current date)
  const [calendarDate, setCalendarDate] = useState(new Date(2026, 9, 21)); // Oct 21, 2026

  // Role permissions
  const canCreateTask = currentUser.role === 'admin' || currentUser.role === 'supervisor';

  const siteTasks = selectedSiteId === 'all'
    ? tasks
    : tasks.filter((t) => t.siteId === selectedSiteId);

  const filteredTasks = siteTasks.filter((task) => {
    if (filterStatus === 'pending') return task.status !== 'completed';
    if (filterStatus === 'completed') return task.status === 'completed';
    return true;
  });

  // Tasks due today banner
  const todayDateStr = '2026-10-21';
  const tasksDueToday = siteTasks.filter(
    (t) => t.dueDate === todayDateStr && t.status !== 'completed'
  );

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setIsScrolled(e.currentTarget.scrollTop > 24);
  };

  // Calendar helpers
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  return (
    <div className="flex-1 flex flex-col bg-[#F4F2EE] overflow-hidden relative">
      <TopBar title="Service & Maintenance" isScrolled={isScrolled} showSitePicker={true} />

      <div
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto no-scrollbar px-4 pt-1 pb-8 space-y-3.5 overscroll-contain"
      >
        {/* Large iOS Header Title with Action Button */}
        <div className="flex items-end justify-between pt-1">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-concrete">
              Equipment Care
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-[#1C1D1F]">
              Service Orders
            </h1>
          </div>

          {canCreateTask && (
            <button
              onClick={() => pushScreen({ type: 'task_create' })}
              className="tap-spring h-9 px-3 rounded-xl bg-[#1C1D1F] text-white flex items-center gap-1.5 text-xs font-semibold shadow-xs active:bg-zinc-800"
            >
              <Plus className="w-4 h-4 text-[#F2A900]" />
              <span>New Task</span>
            </button>
          )}
        </div>

        {/* In-App Reminder Banner for Tasks Due Today */}
        {tasksDueToday.length > 0 && (
          <div className="p-3 bg-amber-500/10 border border-[#F2A900]/40 rounded-xl flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#F2A900] text-black flex items-center justify-center shrink-0 font-bold">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-900">
                  {tasksDueToday.length} Service {tasksDueToday.length === 1 ? 'Order' : 'Orders'} Due Today
                </p>
                <p className="text-[11px] text-zinc-600 line-clamp-1">
                  {tasksDueToday.map((t) => t.assetName).join(', ')}
                </p>
              </div>
            </div>
            <button
              onClick={() => pushScreen({ type: 'task_closeout', taskId: tasksDueToday[0].id })}
              className="px-2.5 py-1 bg-[#1C1D1F] text-[#F2A900] rounded-lg text-[10px] font-bold tap-spring shrink-0"
            >
              Start
            </button>
          </div>
        )}

        {/* View Mode & Filter Segmented Controls */}
        <div className="flex items-center justify-between gap-2">
          {/* List vs Calendar Toggle */}
          <div className="flex items-center p-1 bg-black/6 rounded-xl">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg tap-spring flex items-center gap-1.5 transition-all ${
                viewMode === 'list'
                  ? 'bg-[#1C1D1F] text-white shadow-xs'
                  : 'text-zinc-600 bg-transparent'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg tap-spring flex items-center gap-1.5 transition-all ${
                viewMode === 'calendar'
                  ? 'bg-[#1C1D1F] text-white shadow-xs'
                  : 'text-zinc-600 bg-transparent'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 text-xs">
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'pending', label: 'Open' },
                { id: 'completed', label: 'Done' }
              ] as const
            ).map((s) => (
              <button
                key={s.id}
                onClick={() => setFilterStatus(s.id)}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                  filterStatus === s.id
                    ? 'bg-zinc-200 text-zinc-900 font-bold'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* LIST VIEW */}
        {viewMode === 'list' ? (
          <div className="space-y-2.5">
            {filteredTasks.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-black/6">
                <CheckCircle2 className="w-8 h-8 text-[#2F8F5B] mx-auto mb-2" />
                <p className="text-sm font-semibold text-zinc-800">No matching service orders</p>
                <p className="text-xs text-concrete mt-1">All scheduled equipment tasks are up to date.</p>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const isOverdue = task.isOverdue && task.status !== 'completed';
                const isDone = task.status === 'completed';

                return (
                  <div
                    key={task.id}
                    onClick={() => pushScreen({ type: 'task_closeout', taskId: task.id })}
                    className="p-3.5 rounded-2xl bg-white border border-black/6 shadow-xs tap-spring cursor-pointer space-y-2 hover:border-black/12"
                  >
                    <div className="flex items-start justify-between">
                      <div className="pr-2">
                        <div className="flex items-center gap-1.5 mb-1">
                          {isDone ? (
                            <span className="text-[10px] font-bold text-[#2F8F5B] bg-[#2F8F5B]/10 px-1.5 py-0.2 rounded-sm">
                              COMPLETED
                            </span>
                          ) : isOverdue ? (
                            <span className="text-[10px] font-bold text-[#C8452D] bg-[#C8452D]/10 px-1.5 py-0.2 rounded-sm">
                              OVERDUE
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-[#F2A900] bg-amber-500/10 px-1.5 py-0.2 rounded-sm">
                              SCHEDULED
                            </span>
                          )}

                          <span className="text-[10px] text-concrete font-medium">
                            {task.recurrence === 'none'
                              ? 'One-off'
                              : task.recurrence.replace('_', ' ')}
                          </span>
                        </div>

                        <h3 className="text-xs font-bold text-[#1C1D1F] line-clamp-1">
                          {task.title}
                        </h3>
                        <p className="text-[11px] text-zinc-600 mt-0.5">{task.assetName}</p>
                      </div>

                      {/* Due date tag */}
                      <div className="text-right shrink-0">
                        <span
                          className={`text-[11px] font-semibold tabular-nums block ${
                            isOverdue ? 'text-[#C8452D]' : 'text-zinc-700'
                          }`}
                        >
                          {task.dueDate}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase ${
                            task.priority === 'high'
                              ? 'text-[#C8452D]'
                              : task.priority === 'medium'
                              ? 'text-amber-600'
                              : 'text-concrete'
                          }`}
                        >
                          {task.priority} Priority
                        </span>
                      </div>
                    </div>

                    {/* Footer Row: Mechanic & Action */}
                    <div className="pt-1 border-t border-black/4 flex items-center justify-between text-[11px]">
                      <span className="text-concrete">
                        Tech: <span className="font-medium text-zinc-800">{task.assignedMechanicName}</span>
                      </span>

                      {!isDone && (
                        <span className="font-bold text-[#F2A900] bg-[#1C1D1F] px-2 py-0.5 rounded-md text-[10px]">
                          Close Out →
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* MONTH CALENDAR VIEW */
          <div className="bg-white rounded-2xl border border-black/6 p-4 shadow-xs space-y-3">
            {/* Month Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1C1D1F]">
                {calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCalendarDate(new Date(year, month - 1, 1))}
                  className="w-7 h-7 rounded-lg bg-black/5 flex items-center justify-center tap-spring"
                >
                  <ChevronLeft className="w-4 h-4 text-zinc-700" />
                </button>
                <button
                  onClick={() => setCalendarDate(new Date(year, month + 1, 1))}
                  className="w-7 h-7 rounded-lg bg-black/5 flex items-center justify-center tap-spring"
                >
                  <ChevronRight className="w-4 h-4 text-zinc-700" />
                </button>
              </div>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-concrete">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <div key={i} className="py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="h-8" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                const dayTasks = siteTasks.filter((t) => t.dueDate === dateKey);
                const isToday = dayNum === 21 && month === 9; // Oct 21 mock today

                return (
                  <button
                    key={dayNum}
                    onClick={() => {
                      if (dayTasks.length > 0) {
                        pushScreen({ type: 'task_closeout', taskId: dayTasks[0].id });
                      }
                    }}
                    className={`h-9 rounded-xl flex flex-col items-center justify-center relative tap-spring transition-colors ${
                      isToday
                        ? 'bg-[#1C1D1F] text-white font-bold'
                        : dayTasks.length > 0
                        ? 'bg-amber-50 text-zinc-900 font-semibold'
                        : 'text-zinc-700 hover:bg-black/4'
                    }`}
                  >
                    <span>{dayNum}</span>
                    {dayTasks.length > 0 && (
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {dayTasks.map((dt) => (
                          <div
                            key={dt.id}
                            className={`w-1.5 h-1.5 rounded-full ${
                              dt.status === 'completed'
                                ? 'bg-[#2F8F5B]'
                                : dt.isOverdue
                                ? 'bg-[#C8452D]'
                                : 'bg-[#F2A900]'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Calendar Legend */}
            <div className="pt-2 border-t border-black/6 flex items-center justify-around text-[10px] text-concrete">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#C8452D]" />
                <span>Overdue</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#F2A900]" />
                <span>Upcoming</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#2F8F5B]" />
                <span>Completed</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
