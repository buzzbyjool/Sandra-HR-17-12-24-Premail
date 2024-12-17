// Update the types file to include the form data type
export type CandidateSource = 'Manual Web' | 'IA Web' | 'IA Enterprise';
export type SortDirection = 'asc' | 'desc';
export type SortField = 'name' | 'createdAt' | 'rating';

export interface CandidateFormData {
  name: string;
  surname: string;
  email: string;
  phone: string;
  position: string;
  company: string;
  location: string;
  address: string;
  nationality: string;
  residentInEU: boolean;
  workPermitEU: boolean;
  iaSalaryEstimation: string;
  sandraFeedback: string;
  notes: string;
  rating: number;
  yearsOfExperience: string;
  skills: string;
  experience: Array<{
    title: string;
    company: string;
    period: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    graduationYear: string;
    fieldOfStudy: string;
  }>;
  languages: Array<{
    language: string;
    proficiency: string;
  }>;
  cvUrl: string;
}

export interface Candidate {
  id?: string;
  companyId: string;
  teamId?: string | null;
  name: string;
  surname: string;
  position: string;
  company: string;
  yearsOfExperience?: number;
  email: string;
  phone: string;
  visibility?: 'active' | 'archived' | 'hidden';
  location?: string;
  address?: string;
  nationality?: string;
  residentInEU?: boolean;
  workPermitEU?: boolean;
  iaSalaryEstimation?: number;
  sandraFeedback?: string;
  status: 'active' | 'archived';
  stage: string;
  skills: string[];
  rating: number;
  notes?: string;
  experience?: Array<{
    title: string;
    company: string;
    period: string;
    description: string;
  }>;
  education?: Array<{
    degree: string;
    institution: string;
    graduationYear: string;
    fieldOfStudy: string;
  }>;
  languages?: Array<{
    language: string;
    proficiency: 'Basic' | 'Intermediate' | 'Advanced' | 'Fluent' | 'Native';
  }>;
  source: CandidateSource;
  cvUrl?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  archiveMetadata?: {
    archivedAt: string;
    archivedBy: string;
    reason: 'hired' | 'rejected' | 'withdrawn' | 'other';
    notes?: string;
  };
}

export interface CandidateNote {
  id?: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}