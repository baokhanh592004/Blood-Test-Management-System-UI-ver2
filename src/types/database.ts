// Database Types based on schema

export type OrderStatus = 'Pending' | 'Processing' | 'Completed' | 'Cancelled' | 'Reviewed' | 'AI_Reviewed';
export type InstrumentMode = 'Ready' | 'Processing' | 'Maintenance' | 'Inactive';
export type Gender = 'male' | 'female' | 'other';

// Users & Roles
export interface User {
  id: string;
  email: string;
  phone?: string;
  full_name: string;
  identity_number?: string;
  gender?: Gender;
  dob?: string;
  address?: string;
  password_hash: string;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  code: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface UserRole {
  user_id: string;
  role_id: string;
}

export interface Privilege {
  id: string;
  code: string;
  description?: string;
}

export interface RolePrivilege {
  role_id: string;
  privilege_id: string;
}

// Patients and Test Orders
export interface Patient {
  id: string;
  patient_code?: string;
  full_name: string;
  dob?: string;
  gender?: Gender;
  phone?: string;
  address?: string;
  last_test_date?: string;
  created_at: string;
}

export interface TestOrder {
  id: string;
  patient_id: string;
  barcode?: string;
  status: OrderStatus;
  created_by: string;
  created_at: string;
  run_by?: string;
  run_at?: string;
  instrument_id?: string;
  deleted_at?: string;
}

export interface TestResultRaw {
  id: string;
  test_order_id?: string;
  instrument_id?: string;
  hl7_message: string;
  message_hash: string;
  status?: string;
  created_at: string;
}

export interface ProcessedResult {
  id: string;
  test_order_id: string;
  instrument_id?: string;
  processed_at?: string;
  reviewer_id?: string;
  reviewed_at?: string;
  ai_review?: boolean;
  details?: any; // jsonb
  created_at: string;
}

export interface ResultParameter {
  id: string;
  processed_result_id: string;
  parameter_code: string;
  value?: string;
  unit?: string;
  flag?: string; // single character
  reference_range?: string;
}

export interface Comment {
  id: string;
  test_order_id?: string;
  processed_result_id?: string;
  user_id: string;
  message: string;
  created_at: string;
  updated_at: string;
}

export interface EventLog {
  id: string;
  event_code?: string;
  message?: any; // jsonb
  operator_id?: string;
  created_at: string;
}

// Instruments
export interface Instrument {
  id: string;
  name?: string;
  model?: string;
  serial_no?: string;
  mode?: InstrumentMode;
  active?: boolean;
  activated_at?: string;
  deactivated_at?: string;
  scheduled_delete_at?: string;
  config?: any; // jsonb
  created_at: string;
}

export interface InstrumentStatusHistory {
  id: string;
  instrument_id: string;
  prev_mode?: InstrumentMode;
  new_mode?: InstrumentMode;
  reason?: string;
  changed_by?: string;
  changed_at: string;
}

// Reagents
export interface Reagent {
  id: string;
  name?: string;
  catalog_no?: string;
  manufacturer?: string;
  unit?: string;
}

export interface ReagentInventory {
  id: string;
  reagent_id: string;
  lot_no?: string;
  expiry_date?: string;
  quantity?: number;
  location?: string;
  created_at: string;
}

export interface ReagentSupplyHistory {
  id: string;
  reagent_id: string;
  vendor_name?: string;
  po_number?: string;
  received_qty?: number;
  unit?: string;
  lot_no?: string;
  expiry_date?: string;
  received_by?: string;
  received_at: string;
  meta?: any; // jsonb
}

export interface ReagentUsageHistory {
  id: string;
  reagent_inventory_id: string;
  used_qty?: number;
  used_by?: string;
  used_at: string;
  test_order_id?: string;
}

// Configurations
export interface Configuration {
  key: string;
  value?: any; // jsonb
  version?: number;
  updated_by?: string;
  updated_at: string;
}

export interface FlaggingRule {
  id: string;
  name?: string;
  version?: number;
  rules?: any; // jsonb
  active?: boolean;
  applied_at?: string;
}

// Extended types for UI
export interface PatientWithTestOrders extends Patient {
  test_orders?: TestOrder[];
  latest_test?: TestOrder;
}

export interface TestOrderWithDetails extends TestOrder {
  patient?: Patient;
  created_by_user?: User;
  run_by_user?: User;
  instrument?: Instrument;
  processed_result?: ProcessedResult;
}

export interface ProcessedResultWithDetails extends ProcessedResult {
  test_order?: TestOrder;
  patient?: Patient;
  reviewer?: User;
  parameters?: ResultParameter[];
  comments?: Comment[];
}

export interface InstrumentWithHistory extends Instrument {
  status_history?: InstrumentStatusHistory[];
  current_test_orders?: TestOrder[];
}

export interface ReagentWithInventory extends Reagent {
  inventory?: ReagentInventory[];
  total_quantity?: number;
  low_stock_items?: number;
  expired_items?: number;
}

// App-specific types
export type AppUserRole = 'administrator' | 'lab_manager' | 'lab_user' | 'service_user' | 'patient';

export interface AppUser {
  id: string;
  full_name: string;
  email: string;
  role: AppUserRole;
  avatar?: string;
  permissions?: string[];
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  filters?: Record<string, any>;
}