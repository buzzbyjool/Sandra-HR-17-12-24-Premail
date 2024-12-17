export type ArchiveStatus = 'active' | 'archived';
export type Visibility = 'active' | 'archived' | 'hidden';
export type ArchiveReason = 
  | 'hired' 
  | 'position_filled' 
  | 'position_cancelled' 
  | 'rejected' 
  | 'withdrawn' 
  | 'expired'
  | 'other';

export interface ArchiveMetadata {
  archivedAt: string;
  archivedBy: string;
  reason: ArchiveReason;
  notes?: string;
  status: ArchiveStatus;
  visibility: Visibility;
  relatedEntities?: {
    candidates: Array<{
      id: string;
      status: 'matched' | 'archived';
      matchedAt?: string;
      restoredAt?: string;
    }>;
    company: string;
  };
  restoredAt?: string;
  restoredBy?: string;
  restoreReason?: string;
}