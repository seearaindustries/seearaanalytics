// ─── Roles ────────────────────────────────────────────────────────────────────
export type Role = 'supervisor' | 'operator';

// ─── User ─────────────────────────────────────────────────────────────────────
export interface UserProfile {
  id: string;
  email: string;
  role: Role;
}

// ─── Domain ───────────────────────────────────────────────────────────────────
export interface ProductionLog {
  id: number;
  date: string;
  recipe: string;
  batch_code: string;
  kneader: string;
  total_order: string;
  num_batches: string;
  shift: string;
  created_at?: string;
}

// ─── Navigation Param Lists ───────────────────────────────────────────────────

// Auth stack (unauthenticated)
export type AuthStackParamList = {
  Login: undefined;
};

// Admin (Supervisor) — bottom tabs, each tab is a stack
export type AdminTabParamList = {
  Dashboard: undefined;
  NewEntry: undefined;
  Track: undefined;
  Logs: undefined;
};

// Logs stack (shared — nested inside both Admin and Operator)
export type LogsStackParamList = {
  LogsList: undefined;
  LogDetail: { log: ProductionLog };
  BatchList: { log: ProductionLog };
  BatchStages: { log: ProductionLog; batchNumber: number; initialStage?: 'weigh' | 'kneader' | 'mixing' | 'packing' };
};

// Operator stack
export type OperatorStackParamList = {
  LogsList: undefined;
  LogDetail: { log: ProductionLog };
  BatchList: { log: ProductionLog };
  BatchStages: { log: ProductionLog; batchNumber: number; initialStage?: 'weigh' | 'kneader' | 'mixing' | 'packing' };
};
