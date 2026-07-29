export interface Asset {
  id: number;
  code: string;
  name: string;
  status: 'available' | 'borrowed' | 'maintenance';
  category_id: number;
  category?: {
    id: number;
    name: string;
  };
  lastTransaction?: Transaction | null;
}

export interface Category {
  id: number;
  name: string;
  assets_count: number;
}

export interface Transaction {
  student_name: string;
  student_class?: string;
  subject?: string;
  borrowed_at: string; // ISO date string
}

export interface CategoryModalData {
  id?: number;
  name: string;
}

export interface AssetModalData {
  category_id: number | string; // string from select, but API expects number
  name: string;
  code: string;
  id?: number;
}

export interface SettingsModalData {
  qr_interval: number;
  form_interval: number;
}

export interface FormOption {
  label: string;
  value: string;
  category: string;
}

export type QrModalData = Asset | null;

export interface PendingAction {
  type: 'DELETE_ASSET' | 'UPDATE_STATUS' | 'EDIT_ASSET' | 'DELETE_CATEGORY' | 'EDIT_CATEGORY' | 'UPDATE_SETTINGS';
  id?: number;
  payload:
    | 'available' | 'maintenance' // for UPDATE_STATUS
    | Omit<AssetModalData, 'id'> // for EDIT_ASSET (we don't need to send id in the body)
    | { name: string } // for EDIT_CATEGORY
    | { qr_interval: number; form_interval: number } // for UPDATE_SETTINGS
    | null; // for DELETE_ASSET and DELETE_CATEGORY
}