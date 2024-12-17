export type MeetingType = 'on-site' | 'video' | 'phone';

export interface Meeting {
  id?: string;
  candidateId: string;
  type: MeetingType;
  date: string;
  time: string;
  duration: number; // in minutes
  location?: string; // For on-site meetings
  platform?: string; // For video meetings
  participants: string[];
  notes?: string;
  status: 'scheduled' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByName: string;
}