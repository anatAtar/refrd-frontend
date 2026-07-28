// ── Core data types matching backend API responses ──────────────────────────

export interface User {
  id: string;
  email: string;
  fullName: string;
  headline: string | null;
  avatarUrl: string | null;
  googleId: string | null;
  companyName: string | null;
  isReferrer: boolean;
  isSeeker: boolean;
  emailVerified: boolean;
  onboarded: boolean;
  inviteCode: string | null;
  invitedById: string | null;
  desiredRole: string | null;
  preferredLocation: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  referrerId: string;
  sourceUrl: string;
  title: string;
  companyName: string;
  location: string | null;
  description: string | null;
  jobType: string | null;
  salaryRange: string | null;
  bonusAmount: string | null;
  bonusCurrency: string | null;
  bonusNotes: string | null;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JobWithReferrer {
  job: Job;
  referrer: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    companyName: string | null;
    headline: string | null;
  };
}

export interface Application {
  id: string;
  jobId: string;
  seekerId: string;
  referrerId: string;
  cvOriginalName: string;
  cvSizeBytes: number;
  cvMimetype: string;
  coverNote: string | null;
  status: 'submitted' | 'viewed' | 'forwarded' | 'rejected';
  referrerNote: string | null;
  hrEmail: string | null;
  forwardedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationWithDetails {
  application: Omit<Application, 'cvFilename'>;
  job: { id: string; title: string; companyName: string };
  seeker?: { id: string; fullName: string; avatarUrl: string | null; headline: string | null };
  referrer?: { id: string; fullName: string; avatarUrl: string | null };
}

export interface Connection {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
  requester?: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    companyName: string | null;
    headline: string | null;
  };
}

export interface PublicUser {
  id: string;
  fullName: string;
  headline: string | null;
  avatarUrl: string | null;
  companyName: string | null;
  isReferrer: boolean;
  createdAt: string;
}

export interface SavedJob {
  savedAt: string;
  job: Job;
  referrer: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    companyName: string | null;
    headline: string | null;
  };
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApplicationMessage {
  id: string;
  applicationId: string;
  senderId: string;
  senderName: string;
  senderAvatarUrl: string | null;
  content: string;
  isRead: boolean;
  createdAt: string;
}
