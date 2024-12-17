export interface Job {
  id?: string;
  title: string;
  company: string;
  department: string;
  reference?: string;
  location: string;
  type: string;
  status: 'active' | 'archived';
  active: boolean;
  visibility?: 'active' | 'archived' | 'hidden';
  description: string;
  requirements: string[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  companyId: string;
  teamId?: string;
  color?: string;
  theme?: {
    color: string;
    bgColor: string;
    borderColor: string;
    hoverBgColor: string;
  };
  archiveMetadata?: {
    archivedAt: string;
    archivedBy: string;
    archivedByName: string;
    reason: string;
    notes?: string;
  };
  notes?: JobNote[];
}

export interface JobNote {
  id?: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt?: string;
}