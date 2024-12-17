import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface ActivityLog {
  userId: string;
  type: 'job_created' | 'candidate_created' | 'stage_changed' | 'interview_scheduled' | 'feedback_added' | 'offer_generated' | 'candidate_restored' | 'job_archived' | 'job_deleted';
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
  companyId: string;
  userMetadata?: {
    name?: string;
    email?: string;
    role?: string;
    department?: string;
    teamId?: string;
  };
  entityMetadata?: {
    candidateName?: string;
    jobTitle?: string;
    jobDepartment?: string;
    jobId?: string;
    candidateId?: string;
    status?: string;
    reason?: string;
  };
}

export class ActivityLogger {
  private static instance: ActivityLogger;

  private constructor() {}

  static getInstance(): ActivityLogger {
    if (!ActivityLogger.instance) {
      ActivityLogger.instance = new ActivityLogger();
    }
    return ActivityLogger.instance;
  }

  async logActivity(activity: ActivityLog): Promise<void> {
    try {
      if (!activity.userId || !activity.companyId) {
        throw new Error('Missing required fields: userId or companyId');
      }

      // Get user document to enrich metadata
      const userDoc = await getDoc(doc(db, 'users', activity.userId));
      const userData = userDoc.exists() ? userDoc.data() : null;

      // Get candidate details if candidateId exists
      let candidateData = null;
      if (activity.metadata?.candidateId) {
        const candidateDoc = await getDoc(doc(db, 'candidates', activity.metadata.candidateId));
        if (candidateDoc.exists()) {
          candidateData = candidateDoc.data();
          // Update description with candidate name
          activity.description = activity.description.replace(
            activity.metadata.candidateId,
            `${candidateData.name} ${candidateData.surname}`
          );
        }
      }

      // Get job details if jobId exists
      let jobData = null;
      if (activity.metadata?.jobId) {
        const jobDoc = await getDoc(doc(db, 'jobs', activity.metadata.jobId));
        if (jobDoc.exists()) {
          jobData = jobDoc.data();
        }
      }

      // Prepare enriched activity data
      const enrichedActivity = {
        ...activity,
        userDisplayInfo: {
          id: activity.userId,
          name: userData?.name || 'Unknown User',
          email: userData?.email || '',
          role: userData?.roles?.[0]?.role || '',
          department: userData?.department || '',
          teamId: userData?.roles?.[0]?.teamId || ''
        },
        entityInfo: {
          candidate: candidateData ? {
            id: activity.metadata?.candidateId,
            name: candidateData.name,
            surname: candidateData.surname,
            email: candidateData.email,
            position: candidateData.position
          } : null,
          job: jobData ? {
            id: activity.metadata?.jobId,
            title: jobData.title,
            department: jobData.department,
            company: jobData.company
          } : null
        },
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'activities'), enrichedActivity);
    } catch (error) {
      console.error('Failed to log activity:', error);
      throw error;
    }
  }
}

// Helper function to create activity descriptions
export function createActivityDescription(
  type: ActivityLog['type'],
  metadata: Record<string, any>
): string {
  const candidateName = metadata.candidateName || 'Unknown Candidate';
  const jobTitle = metadata.jobTitle || 'Unknown Position';
  const fromStage = metadata.fromStage || '';
  const toStage = metadata.toStage || '';

  switch (type) {
    case 'job_created':
      return `New job position created: ${jobTitle}`;
    case 'candidate_created':
      return `New candidate added: ${candidateName}`;
    case 'stage_changed':
      return `${candidateName} moved from ${fromStage} to ${toStage}`;
    case 'interview_scheduled':
      return `Interview scheduled with ${candidateName} for ${jobTitle}`;
    case 'feedback_added':
      return `Feedback added for ${candidateName}`;
    case 'offer_generated':
      return `Offer generated for ${candidateName}`;
    case 'candidate_restored':
      return `${candidateName} restored from archived state`;
    case 'job_deleted':
      return `Job permanently deleted`;
    case 'job_archived':
      return `Job archived: ${metadata.reason}`;
    default:
      return 'Unknown activity';
  }
}