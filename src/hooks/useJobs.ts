import { useFirestore } from './useFirestore';
import { orderBy, where } from 'firebase/firestore';
import { useDataContext } from './useDataContext';
import { Job } from '../types/job';
import { toast } from 'react-hot-toast';
import { getJobTheme } from '../utils/jobColors';
import { ActivityLogger } from '../services/activityLogger';

export function useJobs(status?: 'Active' | 'archived') {
  const { getContextIds } = useDataContext();
  const { companyId } = getContextIds();
  const activityLogger = ActivityLogger.getInstance();

  const queries = [
    where('companyId', '==', companyId || ''),
    orderBy('createdAt', 'desc')
  ];

  if (status) {
    queries.unshift(where('status', '==', status));
  }

  const { documents, add: addJob, update, remove, ...rest } = useFirestore<Job>({
    collectionName: 'jobs',
    queries,
    enforceContext: true
  });

  // Ensure each job has a theme
  const jobsWithThemes = documents.map((job, index) => {
    return {
      ...job,
      theme: job.theme || getJobTheme(job, index)
    };
  });

  const add = async (data: Omit<Job, 'id' | 'theme' | 'createdAt' | 'updatedAt' | 'createdBy' | 'status'>) => {
    const timestamp = new Date().toISOString();
    const { userId } = getContextIds();
    
    const jobData = {
      ...data,
      status: 'Active',
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: userId || '',
      companyId: companyId || '',
    };

    const jobId = await addJob(jobData);

    // Log job creation activity
    await activityLogger.logActivity({
      userId: userId!,
      companyId: companyId!,
      type: 'job_created',
      description: `New job position created: ${data.title}`,
      metadata: {
        jobId,
        jobTitle: data.title,
        department: data.department,
        timestamp
      }
    });

    return jobId;
  };

  return {
    documents: jobsWithThemes,
    add,
    update,
    remove,
    ...rest
  };
}