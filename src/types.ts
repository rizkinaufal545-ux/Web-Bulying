export type UserRole = 'admin' | 'guru' | 'siswa';

export interface Profile {
  id: string;
  nis?: string;
  full_name: string;
  role: UserRole;
  kelas?: string;
  created_at: string;
}

export type ReportStatus = 'pending' | 'diproses' | 'selesai';

export interface Report {
  id: string;
  reporter_id: string | null; // null if anonymous
  description: string;
  location: string;
  incident_date: string;
  evidence_url?: string;
  status: ReportStatus;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
  
  // Joined data
  reporter?: Profile;
}

export interface UserManagement {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  nis?: string;
  kelas?: string;
}
