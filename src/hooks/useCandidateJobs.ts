import { useFirestore } from './useFirestore';
import { CandidateJob } from '../types/candidateJob';
import { orderBy, where, QueryConstraint, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useDataContext } from './useDataContext';

export function useCandidateJobs(candidateId?: string, jobId?: string) {
  const { getContextIds } = useDataContext();
  const { companyId } = getContextIds();
  const queries: QueryConstraint[] = [
    where('companyId', '==', companyId || '')
  ];
  
  if (candidateId) {
    queries.push(where('candidateId', '==', candidateId));
  }
  
  if (jobId) {
    queries.push(where('jobId', '==', jobId));
  }
  
  // Add status filter and ordering
  queries.push(where('status', 'in', ['in_progress', 'matched', 'rejected']));
  queries.push(orderBy('updatedAt', 'desc'));

  const result = useFirestore<CandidateJob>({
    collectionName: 'candidateJobs',
    queries,
    enforceContext: true,
    defaultValue: [],
  });

  return {
    ...result,
    add: async (data: Omit<CandidateJob, 'id'>) => {
      // Validate company context
      if (!companyId) {
        throw new Error('Company context required');
      }

      // Add company context and defaults to data
      const enrichedData = {
        ...data,
        companyId,
        status: data.status || 'in_progress',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return result.add(enrichedData);
    },
    update: async (id: string, data: Partial<CandidateJob>) => {
      const updateData = {
        ...data,
        updatedAt: new Date().toISOString()
      };
      return result.update(id, updateData);
    }
  };
}