import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Job } from '../types/job';
import { useDataContext } from './useDataContext';

export function useActiveJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getContextIds } = useDataContext();
  const { companyId } = getContextIds();

  useEffect(() => {
    if (!companyId) {
      setJobs([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Create query for active jobs
    const jobsRef = collection(db, 'jobs');
    const activeJobsQuery = query(
      jobsRef,
      where('companyId', '==', companyId),
      where('status', '==', 'active'),
      where('visibility', '==', 'active')
    );

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      activeJobsQuery,
      (snapshot) => {
        const activeJobs: Job[] = [];
        snapshot.forEach((doc) => {
          activeJobs.push({ id: doc.id, ...doc.data() } as Job);
        });
        setJobs(activeJobs);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching active jobs:', err);
        setError('Failed to fetch active jobs');
        setLoading(false);
      }
    );

    // Cleanup subscription
    return () => unsubscribe();
  }, [companyId]);

  return { jobs, loading, error };
}