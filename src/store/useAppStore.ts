import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  ActivityLog,
  Asset,
  InventoryItem,
  JobSite,
  MaintenanceTask,
  NotificationItem,
  ScreenView,
  TabType,
  User,
  UserRole
} from '../types';
import {
  INITIAL_ACTIVITIES,
  INITIAL_ASSETS,
  INITIAL_INVENTORY,
  INITIAL_NOTIFICATIONS,
  INITIAL_SITES,
  INITIAL_TASKS,
  INITIAL_USERS
} from '../data/mockData';

export type SyncState = 'synced' | 'syncing' | 'offline';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'alert';
}

interface AppState {
  // Auth & Splash
  authStatus: 'splash' | 'signin' | 'authenticating' | 'authenticated';
  currentUser: User;
  
  // Navigation stack
  currentTab: TabType;
  screenStack: ScreenView[];
  
  // Sites & filtering
  selectedSiteId: string; // 'all' or site-id
  isSiteSheetOpen: boolean;
  isUserMenuOpen: boolean;
  
  // Offline & sync
  isOffline: boolean;
  pendingSyncCount: number;
  syncState: SyncState;
  lastSyncTime: string;

  // In-app alert / dynamic island banner
  activeToast: ToastMessage | null;
  
  // Entities
  sites: JobSite[];
  users: User[];
  inventory: InventoryItem[];
  assets: Asset[];
  tasks: MaintenanceTask[];
  activities: ActivityLog[];
  notifications: NotificationItem[];
  
  // Auth actions
  setAuthStatus: (status: 'splash' | 'signin' | 'authenticating' | 'authenticated') => void;
  signIn: (role?: UserRole) => void;
  signOut: () => void;
  switchRole: (role: UserRole) => void;
  
  // Navigation actions
  setTab: (tab: TabType) => void;
  pushScreen: (screen: ScreenView) => void;
  popScreen: () => void;
  resetNavigation: () => void;
  
  // Site actions
  setSelectedSiteId: (siteId: string) => void;
  setSiteSheetOpen: (open: boolean) => void;
  setUserMenuOpen: (open: boolean) => void;
  
  // Sync actions
  toggleOffline: () => void;
  triggerSync: () => void;
  
  // Toast actions
  showToast: (title: string, message: string, type?: 'info' | 'success' | 'alert') => void;
  dismissToast: () => void;
  
  // Operational actions
  checkOutItem: (itemId: string, toPerson: string) => void;
  checkInItem: (itemId: string) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (item: InventoryItem) => void;
  deleteInventoryItem: (itemId: string) => void;
  
  completeTask: (taskId: string, notes: string, partsUsed: string[], photos: string[]) => void;
  createTask: (taskData: Omit<MaintenanceTask, 'id' | 'isOverdue' | 'status'>) => void;
  
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  resetDemoData: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      authStatus: 'splash',
      currentUser: INITIAL_USERS[0], // Marcus Vance (Admin)
      currentTab: 'home',
      screenStack: [],
      selectedSiteId: 'site-1', // Default Northgate Tower
      isSiteSheetOpen: false,
      isUserMenuOpen: false,
      isOffline: false,
      pendingSyncCount: 0,
      syncState: 'synced',
      lastSyncTime: 'Just now',
      activeToast: null,

      sites: INITIAL_SITES,
      users: INITIAL_USERS,
      inventory: INITIAL_INVENTORY,
      assets: INITIAL_ASSETS,
      tasks: INITIAL_TASKS,
      activities: INITIAL_ACTIVITIES,
      notifications: INITIAL_NOTIFICATIONS,

      setAuthStatus: (status) => set({ authStatus: status }),

      signIn: (role) => {
        const targetRole = role || get().currentUser.role;
        const matchedUser = get().users.find((u) => u.role === targetRole) || get().users[0];
        set({ authStatus: 'authenticating' });
        setTimeout(() => {
          set({
            authStatus: 'authenticated',
            currentUser: matchedUser,
            selectedSiteId: matchedUser.assignedSiteId || 'site-1'
          });
          get().showToast('Signed In', `Welcome back, ${matchedUser.name}`, 'success');
        }, 600);
      },

      signOut: () => {
        set({
          authStatus: 'signin',
          screenStack: [],
          currentTab: 'home',
          isUserMenuOpen: false
        });
      },

      switchRole: (role) => {
        const matchedUser = get().users.find((u) => u.role === role) || get().users[0];
        set({
          currentUser: matchedUser,
          selectedSiteId: matchedUser.assignedSiteId || 'site-1',
          screenStack: []
        });
        get().showToast('Role Switched', `Active as ${matchedUser.title}`, 'info');
      },

      setTab: (tab) => {
        set({ currentTab: tab, screenStack: [] });
      },

      pushScreen: (screen) => {
        set((state) => ({ screenStack: [...state.screenStack, screen] }));
      },

      popScreen: () => {
        set((state) => ({
          screenStack: state.screenStack.slice(0, -1)
        }));
      },

      resetNavigation: () => {
        set({ screenStack: [] });
      },

      setSelectedSiteId: (siteId) => {
        set({ selectedSiteId: siteId, isSiteSheetOpen: false });
        const site = get().sites.find((s) => s.id === siteId);
        get().showToast('Site Filtered', site ? site.name : 'All Job Sites', 'info');
      },

      setSiteSheetOpen: (open) => set({ isSiteSheetOpen: open }),
      setUserMenuOpen: (open) => set({ isUserMenuOpen: open }),

      toggleOffline: () => {
        const current = get().isOffline;
        if (!current) {
          // Going offline
          set({
            isOffline: true,
            syncState: 'offline'
          });
          get().showToast('Offline Mode Enabled', 'Field actions will queue locally', 'alert');
        } else {
          // Going online: trigger sync simulation
          const pending = get().pendingSyncCount;
          set({
            isOffline: false,
            syncState: 'syncing'
          });
          setTimeout(() => {
            set({
              syncState: 'synced',
              pendingSyncCount: 0,
              lastSyncTime: 'Just now'
            });
            get().showToast('Sync Complete', pending > 0 ? `Uploaded ${pending} queued record(s)` : 'All records up to date', 'success');
          }, 1200);
        }
      },

      triggerSync: () => {
        if (get().isOffline) return;
        set({ syncState: 'syncing' });
        setTimeout(() => {
          set({
            syncState: 'synced',
            pendingSyncCount: 0,
            lastSyncTime: 'Just now'
          });
        }, 800);
      },

      showToast: (title, message, type = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        set({ activeToast: { id, title, message, type } });
        setTimeout(() => {
          if (get().activeToast?.id === id) {
            set({ activeToast: null });
          }
        }, 3200);
      },

      dismissToast: () => set({ activeToast: null }),

      checkOutItem: (itemId, toPerson) => {
        const item = get().inventory.find((i) => i.id === itemId);
        if (!item) return;

        const updated: InventoryItem = {
          ...item,
          status: 'checked_out',
          checkedOutTo: toPerson,
          checkedOutDate: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quantity: Math.max(0, item.quantity - 1)
        };

        const newActivity: ActivityLog = {
          id: 'act-' + Date.now(),
          timestamp: 'Just now',
          type: 'checkout',
          description: `Checked out ${item.name} to ${toPerson}`,
          userName: get().currentUser.name,
          siteId: item.siteId,
          itemId: item.id,
          itemName: item.name
        };

        set((state) => ({
          inventory: state.inventory.map((i) => (i.id === itemId ? updated : i)),
          activities: [newActivity, ...state.activities],
          pendingSyncCount: state.isOffline ? state.pendingSyncCount + 1 : 0
        }));

        get().showToast('Checked Out', `${item.name} logged to ${toPerson}`, 'success');
        if (!get().isOffline) get().triggerSync();
      },

      checkInItem: (itemId) => {
        const item = get().inventory.find((i) => i.id === itemId);
        if (!item) return;

        const updated: InventoryItem = {
          ...item,
          status: 'available',
          checkedOutTo: undefined,
          checkedOutDate: undefined,
          quantity: item.quantity + 1
        };

        const newActivity: ActivityLog = {
          id: 'act-' + Date.now(),
          timestamp: 'Just now',
          type: 'checkin',
          description: `Checked in ${item.name} to ${item.binLocation}`,
          userName: get().currentUser.name,
          siteId: item.siteId,
          itemId: item.id,
          itemName: item.name
        };

        set((state) => ({
          inventory: state.inventory.map((i) => (i.id === itemId ? updated : i)),
          activities: [newActivity, ...state.activities],
          pendingSyncCount: state.isOffline ? state.pendingSyncCount + 1 : 0
        }));

        get().showToast('Checked In', `${item.name} returned to ${item.binLocation}`, 'success');
        if (!get().isOffline) get().triggerSync();
      },

      addInventoryItem: (itemData) => {
        const newId = 'inv-' + Date.now();
        const newItem: InventoryItem = {
          ...itemData,
          id: newId
        };

        const newActivity: ActivityLog = {
          id: 'act-' + Date.now(),
          timestamp: 'Just now',
          type: 'inspection',
          description: `Added new item: ${newItem.name} (${newItem.sku})`,
          userName: get().currentUser.name,
          siteId: newItem.siteId,
          itemId: newId,
          itemName: newItem.name
        };

        set((state) => ({
          inventory: [newItem, ...state.inventory],
          activities: [newActivity, ...state.activities],
          pendingSyncCount: state.isOffline ? state.pendingSyncCount + 1 : 0
        }));

        get().showToast('Item Added', `${newItem.name} created`, 'success');
        if (!get().isOffline) get().triggerSync();
      },

      updateInventoryItem: (updatedItem) => {
        set((state) => ({
          inventory: state.inventory.map((i) => (i.id === updatedItem.id ? updatedItem : i)),
          pendingSyncCount: state.isOffline ? state.pendingSyncCount + 1 : 0
        }));
        get().showToast('Item Updated', updatedItem.name, 'success');
        if (!get().isOffline) get().triggerSync();
      },

      deleteInventoryItem: (itemId) => {
        const item = get().inventory.find((i) => i.id === itemId);
        set((state) => ({
          inventory: state.inventory.filter((i) => i.id !== itemId),
          screenStack: state.screenStack.filter(
            (s) => !(s.type === 'item_detail' && s.itemId === itemId) && !(s.type === 'item_edit' && s.itemId === itemId)
          ),
          pendingSyncCount: state.isOffline ? state.pendingSyncCount + 1 : 0
        }));
        get().showToast('Item Deleted', item ? item.name : 'Removed from inventory', 'info');
        if (!get().isOffline) get().triggerSync();
      },

      completeTask: (taskId, notes, partsUsed, photos) => {
        const task = get().tasks.find((t) => t.id === taskId);
        if (!task) return;

        const updated: MaintenanceTask = {
          ...task,
          status: 'completed',
          isOverdue: false,
          completedDate: new Date().toISOString().split('T')[0],
          notes: notes || task.notes,
          partsUsed: partsUsed.length > 0 ? partsUsed : task.partsUsed,
          completionPhotos: photos.length > 0 ? photos : task.completionPhotos
        };

        const newActivity: ActivityLog = {
          id: 'act-' + Date.now(),
          timestamp: 'Just now',
          type: 'maintenance',
          description: `Completed service ticket: ${task.title} for ${task.assetName}`,
          userName: get().currentUser.name,
          siteId: task.siteId,
          itemId: task.assetId,
          itemName: task.assetName
        };

        // Also update asset status if it was in maintenance
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === taskId ? updated : t)),
          assets: state.assets.map((a) => (a.id === task.assetId && a.status === 'maintenance' ? { ...a, status: 'available' } : a)),
          activities: [newActivity, ...state.activities],
          pendingSyncCount: state.isOffline ? state.pendingSyncCount + 1 : 0
        }));

        get().showToast('Work Order Closed', `${task.title} verified`, 'success');
        if (!get().isOffline) get().triggerSync();
      },

      createTask: (taskData) => {
        const newId = 'tsk-' + Date.now();
        const newTask: MaintenanceTask = {
          ...taskData,
          id: newId,
          isOverdue: false,
          status: 'pending'
        };

        const newActivity: ActivityLog = {
          id: 'act-' + Date.now(),
          timestamp: 'Just now',
          type: 'maintenance',
          description: `Scheduled service ticket: ${newTask.title}`,
          userName: get().currentUser.name,
          siteId: newTask.siteId,
          itemId: newTask.assetId,
          itemName: newTask.assetName
        };

        set((state) => ({
          tasks: [newTask, ...state.tasks],
          activities: [newActivity, ...state.activities],
          pendingSyncCount: state.isOffline ? state.pendingSyncCount + 1 : 0
        }));

        get().showToast('Task Scheduled', newTask.title, 'success');
        if (!get().isOffline) get().triggerSync();
      },

      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
        }));
      },

      clearAllNotifications: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true }))
        }));
        get().showToast('Notifications Cleared', 'All marked as read', 'info');
      },

      resetDemoData: () => {
        set({
          inventory: INITIAL_INVENTORY,
          assets: INITIAL_ASSETS,
          tasks: INITIAL_TASKS,
          activities: INITIAL_ACTIVITIES,
          notifications: INITIAL_NOTIFICATIONS,
          sites: INITIAL_SITES,
          users: INITIAL_USERS,
          pendingSyncCount: 0,
          isOffline: false,
          syncState: 'synced',
          lastSyncTime: 'Just now'
        });
        get().showToast('Demo Reset', 'Default toolroom and asset data restored', 'info');
      }
    }),
    {
      name: 'toolyard-app-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        inventory: state.inventory,
        assets: state.assets,
        tasks: state.tasks,
        activities: state.activities,
        notifications: state.notifications,
        selectedSiteId: state.selectedSiteId,
        currentUser: state.currentUser,
        isOffline: state.isOffline,
        pendingSyncCount: state.pendingSyncCount
      })
    }
  )
);
