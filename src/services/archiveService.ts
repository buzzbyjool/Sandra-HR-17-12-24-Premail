import { db } from '../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  writeBatch, 
  doc,
  getDoc,
  updateDoc
} from 'firebase/firestore';
import { ArchiveReason } from '../types/archive';

interface ArchiveResult {
  success: boolean;
  error?: string;
  removedAssociations?: number;
  metadata?: {
    jobTitle?: string;
    jobCompany?: string;
    candidateName?: string;
    archivedByUser?: {
      name: string;
      surname: string;
    };
  };
}

export class ArchiveService {
  private static instance: ArchiveService;

  private constructor() {}

  static getInstance(): ArchiveService {
    if (!ArchiveService.instance) {
      ArchiveService.instance = new ArchiveService();
    }
    return ArchiveService.instance;
  }

  private async getUserDetails(userId: string) {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      return null;
    }
    const userData = userDoc.data();
    return {
      name: userData.name || 'Unknown',
      surname: userData.surname || 'User'
    };
  }

  async permanentlyDelete(
    id: string,
    type: 'job' | 'candidate',
    userId: string,
    companyId: string
  ): Promise<ArchiveResult> {
    const batch = writeBatch(db);

    try {
      const userDetails = await this.getUserDetails(userId);
      const collectionName = type === 'job' ? 'jobs' : 'candidates';
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return {
          success: false,
          error: `${type} not found`
        };
      }

      const data = docSnap.data();
      
      if (data.companyId !== companyId) {
        return {
          success: false,
          error: 'Invalid company access'
        };
      }

      const candidateJobsRef = collection(db, 'candidateJobs');
      const candidateJobsQuery = query(
        candidateJobsRef,
        where(type === 'job' ? 'jobId' : 'candidateId', '==', id),
        where('companyId', '==', companyId)
      );
      
      const candidateJobsSnapshot = await getDocs(candidateJobsQuery);

      candidateJobsSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      batch.delete(docRef);

      await batch.commit();

      return {
        success: true,
        removedAssociations: candidateJobsSnapshot.size,
        metadata: {
          ...(type === 'job' ? {
            jobTitle: data.title,
            jobCompany: data.company
          } : {}),
          archivedByUser: userDetails || undefined
        }
      };
    } catch (error) {
      console.error(`Error in permanentlyDelete ${type}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : `Failed to delete ${type}`
      };
    }
  }

  async archiveJob(
    jobId: string,
    userId: string,
    companyId: string,
    reason: ArchiveReason,
    notes?: string
  ): Promise<ArchiveResult> {
    const batch = writeBatch(db);

    try {
      const userDetails = await this.getUserDetails(userId);
      const jobRef = doc(db, 'jobs', jobId);
      const jobSnap = await getDoc(jobRef);
      
      if (!jobSnap.exists()) {
        return {
          success: false,
          error: 'Job not found'
        };
      }

      const jobData = jobSnap.data();
      
      if (jobData.companyId !== companyId) {
        return {
          success: false,
          error: 'Invalid company access'
        };
      }

      const timestamp = new Date().toISOString();

      batch.update(jobRef, {
        status: 'archived',
        visibility: 'archived',
        active: false,
        archiveMetadata: {
          archivedAt: timestamp,
          archivedBy: userId,
          archivedByName: userDetails ? `${userDetails.name} ${userDetails.surname}` : 'Unknown User',
          reason,
          notes
        },
        updatedAt: timestamp,
        updatedBy: userId
      });

      await batch.commit();

      return {
        success: true,
        metadata: {
          jobTitle: jobData.title,
          jobCompany: jobData.company,
          archivedByUser: userDetails || undefined
        }
      };
    } catch (error) {
      console.error('Error in archiveJob:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to archive job'
      };
    }
  }

  async archiveCandidate(
    candidateId: string,
    userId: string,
    companyId: string,
    reason: ArchiveReason,
    notes?: string
  ): Promise<ArchiveResult> {
    const batch = writeBatch(db);

    try {
      const userDetails = await this.getUserDetails(userId);
      const candidateRef = doc(db, 'candidates', candidateId);
      const candidateSnap = await getDoc(candidateRef);
      
      if (!candidateSnap.exists()) {
        return {
          success: false,
          error: 'Candidate not found'
        };
      }

      const candidateData = candidateSnap.data();
      
      if (candidateData.companyId !== companyId) {
        return {
          success: false,
          error: 'Invalid company access'
        };
      }

      const timestamp = new Date().toISOString();
      const candidateName = `${candidateData.name} ${candidateData.surname}`;

      batch.update(candidateRef, {
        status: 'archived',
        visibility: 'archived',
        active: false,
        archiveMetadata: {
          archivedAt: timestamp,
          archivedBy: userId,
          archivedByName: userDetails ? `${userDetails.name} ${userDetails.surname}` : 'Unknown User',
          reason,
          notes
        },
        updatedAt: timestamp,
        updatedBy: userId
      });

      await batch.commit();

      return {
        success: true,
        metadata: {
          candidateName,
          archivedByUser: userDetails || undefined
        }
      };
    } catch (error) {
      console.error('Error in archiveCandidate:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to archive candidate'
      };
    }
  }

  async restoreCandidate(
    candidateId: string,
    userId: string,
    companyId: string
  ): Promise<ArchiveResult> {
    const batch = writeBatch(db);

    try {
      const userDetails = await this.getUserDetails(userId);
      const candidateRef = doc(db, 'candidates', candidateId);
      const candidateSnap = await getDoc(candidateRef);
      
      if (!candidateSnap.exists()) {
        return {
          success: false,
          error: 'Candidate not found'
        };
      }

      const candidateData = candidateSnap.data();
      
      if (candidateData.companyId !== companyId) {
        return {
          success: false,
          error: 'Invalid company access'
        };
      }

      if (candidateData.status !== 'archived') {
        return {
          success: false,
          error: 'Candidate is not archived'
        };
      }

      const candidateName = `${candidateData.name} ${candidateData.surname}`;

      const candidateJobsRef = collection(db, 'candidateJobs');
      const candidateJobsQuery = query(
        candidateJobsRef,
        where('candidateId', '==', candidateId),
        where('companyId', '==', companyId)
      );
      
      const candidateJobsSnapshot = await getDocs(candidateJobsQuery);

      batch.update(candidateRef, {
        status: 'active',
        visibility: 'active',
        active: true,
        stage: 'new',
        archiveMetadata: null,
        updatedAt: new Date().toISOString(),
        updatedBy: userId
      });

      candidateJobsSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      return {
        success: true,
        removedAssociations: candidateJobsSnapshot.size,
        metadata: {
          candidateName,
          archivedByUser: userDetails || undefined
        }
      };
    } catch (error) {
      console.error('Error in restoreCandidate:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to restore candidate'
      };
    }
  }
}