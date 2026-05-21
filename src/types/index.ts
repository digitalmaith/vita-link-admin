// =============================================
// VITA-LINK ADMIN — Global Types
// =============================================

// --- Shared / Primitives ---

export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export type Region =
  | "Dakar"
  | "Thiès"
  | "Saint-Louis"
  | "Ziguinchor"
  | "Kaolack"
  | "Fatick"
  | "Kolda"
  | "Tambacounda"
  | "Louga"
  | "Diourbel"
  | "Kaffrine"
  | "Kédougou"
  | "Matam"
  | "Sédhiou";

export type UserRole = "ADMIN" | "MODERATOR" | "VIEWER";

export type Status = "ACTIVE" | "SUSPENDED" | "PENDING" | "REJECTED";

export type AlertStatus = "OPEN" | "IN_PROGRESS" | "CLOSED" | "CANCELLED";

// --- API Response Wrapper ---

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// --- Auth ---

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  twoFactorEnabled: boolean;
  createdAt: string;
}

export interface AuthSession {
  user: AdminUser;
  accessToken: string;
  expiresAt: string;
}

// --- Structures de Santé ---

export interface HealthStructure {
  id: string;
  name: string;
  region: Region;
  address: string;
  phone: string;
  email: string;
  status: Status;
  documents: StructureDocument[];
  alertsCount: number;
  foundedAlerts: number;  // alertes fondées
  createdAt: string;
  validatedAt?: string;
  validatedBy?: string;
}

export interface StructureDocument {
  id: string;
  type: "LICENCE" | "REGISTRATION" | "OTHER";
  url: string;
  uploadedAt: string;
}

// --- Jambaars (Donneurs) ---

export interface Jambaar {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  bloodGroup: BloodGroup;
  region: Region;
  city: string;
  grade: JambaarGrade;
  status: Status;
  points: number;
  totalDonations: number;
  commitmentRate: number; // taux de présence après "J'y vais"
  createdAt: string;
  lastDonationAt?: string;
}

export type JambaarGrade = "ASPIRANT" | "SENTINELLE" | "AMBASSADEUR";

// --- Alertes ---

export interface Alert {
  id: string;
  structureId: string;
  structureName: string;
  region: Region;
  bloodGroup: BloodGroup;
  quantity: number;
  status: AlertStatus;
  respondersCount: number;
  createdAt: string;
  closedAt?: string;
  responseTimeMinutes?: number;
}

// --- Récompenses & Partenaires ---

export interface Partner {
  id: string;
  name: string;
  logo: string;
  category: PartnerCategory;
  isActive: boolean;
  rewards: Reward[];
  createdAt: string;
}

export type PartnerCategory = "TELECOM" | "RETAIL" | "TRANSPORT" | "HEALTH" | "FOOD" | "OTHER";

export interface Reward {
  id: string;
  partnerId: string;
  title: string;
  description: string;
  pointsCost: number;
  stock: number;
  isActive: boolean;
  expiresAt?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: string;
  isSeasonal: boolean;
  season?: string;
  isActive: boolean;
  awardedCount: number;
}

// --- Dashboard KPIs ---

export interface DashboardKPIs {
  livesSavedEstimate: number;
  avgResponseTimeMinutes: number;
  criticalStocksCount: number;
  totalDonors: number;
  openAlerts: number;
  totalStructures: number;
  totalDonations?: number;
  totalAlerts?: number;
}

export interface HeatmapPoint {
  latitude: number;
  longitude: number;
  region: Region;
  demandLevel: number;   // 0-100
  supplyLevel: number;   // 0-100
}

export interface HeatmapDataPoint {
  region: Region;
  demandLevel: number;
}

// --- Filtres ---

export interface GlobalFilters {
  region?: Region;
  bloodGroup?: BloodGroup;
  grade?: JambaarGrade;
  dateFrom?: string;
  dateTo?: string;
  status?: Status;
  search?: string;
}

// --- Rapports ---

export interface ReportSummary {
  period: string;
  totalAlerts: number;
  alertsClosed: number;
  livesSaved: number;
  avgResponseTime: number;
  topRegion: Region;
  topBloodGroup: BloodGroup;
}
