export type UserRole = 'admin' | 'supervisor' | 'mechanic' | 'storekeeper';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  initials: string;
  assignedSiteId: string;
  avatarUrl?: string;
}

export interface JobSite {
  id: string;
  name: string;
  code: string;
  address: string;
  activeAssetCount: number;
  openTasksCount: number;
  mapCoords: { x: number; y: number };
}

export type InventoryCategory = 'equipment' | 'parts' | 'consumables';
export type ItemStatus = 'available' | 'low_stock' | 'checked_out' | 'out_of_service';

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: InventoryCategory;
  quantity: number;
  minQuantity: number;
  unit: string;
  binLocation: string;
  siteId: string;
  status: ItemStatus;
  checkedOutTo?: string;
  checkedOutDate?: string;
  lastActivity?: string;
  imageUrl: string;
  serialNumber?: string;
  notes?: string;
  model?: string;
}

export type AssetStatus = 'available' | 'in_use' | 'maintenance' | 'overdue_inspection';

export interface Asset {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  category: string;
  siteId: string;
  status: AssetStatus;
  engineHours: number;
  hoursHistory: { month: string; hours: number }[];
  lastInspection: string;
  nextInspection: string;
  assignedOperator?: string;
  imageUrl: string;
  mapCoords: { x: number; y: number };
  movementHistory: {
    id: string;
    date: string;
    from: string;
    to: string;
    loggedBy: string;
    reason: string;
  }[];
}

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskRecurrence = 'none' | 'every_30_days' | 'every_250_hours' | 'monthly';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface MaintenanceTask {
  id: string;
  title: string;
  assetId: string;
  assetName: string;
  siteId: string;
  dueDate: string;
  isOverdue: boolean;
  priority: TaskPriority;
  recurrence: TaskRecurrence;
  assignedMechanicId: string;
  assignedMechanicName: string;
  status: TaskStatus;
  notes?: string;
  partsUsed?: string[];
  completedDate?: string;
  completionPhotos?: string[];
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'checkout' | 'checkin' | 'maintenance' | 'relocation' | 'inspection';
  description: string;
  userName: string;
  siteId: string;
  itemId?: string;
  itemName?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'alert' | 'service' | 'inventory' | 'system';
}

export type TabType = 'home' | 'inventory' | 'scan' | 'service' | 'assets';

export type ScreenView =
  | { type: 'tabs'; tab: TabType }
  | { type: 'item_detail'; itemId: string }
  | { type: 'item_edit'; itemId?: string }
  | { type: 'asset_detail'; assetId: string }
  | { type: 'task_detail'; taskId: string }
  | { type: 'task_create'; assetId?: string }
  | { type: 'task_closeout'; taskId: string }
  | { type: 'notifications' }
  | { type: 'settings' }
  | { type: 'company_settings' };
