export type MembershipStatus = "Guest" | "Regular" | "Member" | "Staff";

export interface Member {
  id?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  status: MembershipStatus;
  joinDate?: string;
  address?: string;
  dateOfBirth?: string;
  pastoralNotes?: string;
  createdAt: string;
}

export interface Donation {
  id?: string;
  reference: string;
  donor: string;
  email: string;
  amount: number;
  purpose: string;
  date: string;
  status: "Pending" | "Success" | "Failed";
}

export type UserRole = "Admin" | "Pastor" | "Finance" | "Member";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
}

export type EventCategory = "Service" | "Conference" | "Outreach" | "Youth" | "Special";

export interface ChurchEvent {
  id?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: EventCategory;
  expectedAttendance: number;
  status: "Upcoming" | "Completed" | "Cancelled";
  createdAt: string;
}

export interface BroadcastRecord {
  id?: string;
  campaignName: string;
  targetAudience: string;
  recipientsCount: number;
  status: "Completed" | "Processing" | "Failed";
  date: string;
}

export interface ChurchSettings {
  churchName: string;
  tagline: string;
  contactEmail: string;
  phone: string;
  address: string;
  moolreEnv: "sandbox" | "live";
  senderId: string;
  autoWelcomeSms: boolean;
  autoDonationReceipt: boolean;
}
