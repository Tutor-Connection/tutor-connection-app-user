export type ScreenState = 
  | "register" 
  | "login" 
  | "role" 
  | "dashboard" 
  | "makeup" 
  | "calendar" 
  | "explore" 
  | "applications" 
  | "class-detail"
  | "tuition"
  | "wallet"
  | "chat"
  | "trials"
  | "profile";

export type UserRole = "tutor" | "student";

export interface User {
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  role: UserRole | null;
}

export type ClassFormat = "ONLINE" | "OFFLINE" | "AT_HOME";

export interface ClassSchedule {
  id: string;
  studentName: string;
  subject: string;
  start: string; // "08:00"
  end: string;   // "10:00"
  format: ClassFormat;
  location: string; // "Google Meet / Zoom" or address
  status: "upcoming" | "finished" | "cancelled";
  date: string; // "YYYY-MM-DD"
  notes?: string;
  hoursCount?: number; // e.g. 120 (minutes)
  fee?: string; // "350k/buổi"
}

export type MakeupStatus = "pending" | "proposed" | "approved";

export interface MakeupClass {
  id: string;
  studentName: string;
  subject: string;
  missedDate: string; // "15/03/2024"
  reason: string;
  status: MakeupStatus;
  proposedDate?: string; // "Thứ 7, 20/03 - 19:30"
  notes?: string;
}

export interface JobListing {
  id: string;
  title: string;
  fee: string; // e.g. "300k/buổi"
  contactName: string;
  grade: string;
  location: string;
  distance?: string; // "2km" or "Toàn quốc"
  schedule: string; // "Thứ 2, 4, 6 - 18:00"
  requirements: string;
  tutorsCount: number;
  format: "ONLINE" | "OFFLINE" | "AT_HOME";
  isApplied?: boolean;
}

export interface Application {
  id: string;
  studentName: string;
  subject: string;
  fee: string;
  grade: string;
  location: string;
  date: string;
  status: "pending" | "accepted" | "rejected";
  reason?: string;
}

export interface MessageLog {
  id: string;
  sender: "tutor" | "student";
  text: string;
  time: string;
}

// Interfaces imported from tutor-portal
export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'commission';
  title: string;
  amount: number;
  date: string;
  status: 'pending' | 'success' | 'rejected' | 'processing';
  details?: string;
  sourceDest?: string;
}

export interface ClassInfo {
  id: string;
  studentName: string;
  subject: string;
  code: string;
  tuitionFee: number;
  commissionFee: number;
  paymentDay: string;
  dueDate: string;
  status: 'paid' | 'unpaid' | 'overdue';
  avatarBg: string;
}

export interface Message {
  id: string;
  sender: 'student' | 'tutor';
  text?: string;
  timestamp: string;
  file?: {
    name: string;
    size: string;
    type: string;
  };
  image?: string;
}

export interface ChatThread {
  id: string;
  name: string;
  avatar: string;
  status: 'active' | 'trial' | 'inactive';
  lastMessage: string;
  unreadCount: number;
  timestamp: string;
  online: boolean;
  messages: Message[];
  verified?: boolean;
  trialBadge?: boolean;
}

export interface TrialClass {
  id: string;
  studentName: string;
  avatar: string;
  subject: string;
  completedSessions: number;
  totalSessions: number;
  isComplete: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  category: 'system' | 'schedule' | 'payment';
  unread: boolean;
  actionRequired?: boolean;
  actionType?: 'trial_request' | 'kyc_approved';
}

export interface TutorProfile {
  fullName: string;
  avatar: string;
  gender: string;
  dob: string;
  gpsAddress: string;
  subjects: string[];
  hourlyFee: number;
  experience: string;
  education: string;
  university: string;
  bio: string;
  kycStatus: 'unverified' | 'pending' | 'verified';
  rating: number;
  reviewsCount: number;
}

export interface SupportTicket {
  id: string;
  type: string;
  subject: string;
  description: string;
  status: 'in_progress' | 'solved';
  date: string;
}
