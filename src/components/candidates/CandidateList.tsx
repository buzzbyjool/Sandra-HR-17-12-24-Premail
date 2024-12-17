import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useDataContext } from './useDataContext';

export interface DashboardMetrics {
  activeJobs: number;
  activeCandidates: number;
  stageMetrics: Record<string, number>;
  activeStageMetrics: Record<string, number>;
  averageTimeToHire: number;
  conversionRates: {
    screening: number;
    interview: number;
    offer: number;
    hired: number;
  };
}

export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    activeJobs: 0,
    activeCandidates: 0,
    stageMetrics: {},
    activeStageMetrics: {},
    averageTimeToHire: 0,
    conversionRates: {
      screening: 0,
      interview: 0,
      offer: 0,
      hired: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const { getContextIds } = useDataContext();
  const { companyId } = getContextIds();

  useEffect(() => {
    if (!companyId) {
      setMetrics(null);
      setLoading(false);
      return;
    }

    const jobsQuery = query(
      collection(db, 'jobs'),
      where('companyId', '==', companyId),
      where('status', '==', 'Active'),
      orderBy('createdAt', 'desc')
    );

    const candidatesQuery = query(
      collection(db, 'candidates'),
      where('companyId', '==', companyId),
      where('status', '==', 'active'), 
      orderBy('createdAt', 'desc')
    );

    const candidateJobsQuery = query(
      collection(db, 'candidateJobs'),
      where('companyId', '==', companyId)
    );

    const archivedCandidatesQuery = query(
      collection(db, 'candidates'),
      where('companyId', '==', companyId),
      where('status', '==', 'archived'),
      where('archiveMetadata.reason', '==', 'hired')
    );

    const unsubscribeJobs = onSnapshot(jobsQuery, (snapshot) => {
      const activeJobs = snapshot.size;
      
      setMetrics(prev => ({
        ...prev,
        activeJobs
      }));

      setLoading(false);
    });

    const unsubscribeCandidates = onSnapshot(candidatesQuery, async (snapshot) => {
      // Get candidate jobs to filter candidates
      const candidateJobsSnapshot = await getDocs(candidateJobsQuery);
      const candidatesWithJobs = new Set(
        candidateJobsSnapshot.docs.map(doc => doc.data().candidateId)
      );

      // Filter candidates to only those with jobs
      const activeCandidatesWithJobs = snapshot.docs.filter(doc => 
        candidatesWithJobs.has(doc.id)
      );

      const activeCandidates = activeCandidatesWithJobs.length;
      const activeStageMetrics: Record<string, number> = {};
      let totalDaysToHire = 0;
      let hiredCount = 0;

      activeCandidatesWithJobs.forEach(doc => {
        const data = doc.data();
        if (data.stage) {
          activeStageMetrics[data.stage] = (activeStageMetrics[data.stage] || 0) + 1;
        }

        if (data.stage === 'hired' && data.createdAt && data.hiredAt) {
          const daysToHire = Math.floor(
            (new Date(data.hiredAt).getTime() - new Date(data.createdAt).getTime()) 
            / (1000 * 60 * 60 * 24)
          );
          totalDaysToHire += daysToHire;
          hiredCount++;
        }
      });

      // Get archived hired candidates
      const archivedSnapshot = await getDocs(archivedCandidatesQuery);
      const archivedHiredCount = archivedSnapshot.size;

      // Add archived hired candidates to the total
      activeStageMetrics['hired'] = archivedHiredCount;
      hiredCount += archivedHiredCount;

      const averageTimeToHire = hiredCount > 0 ? Math.round(totalDaysToHire / hiredCount) : 0;

      // Calculate conversion rates
      const totalStarted = activeCandidates;
      const screeningCount = activeStageMetrics['screening'] || 0;
      const interviewCount = activeStageMetrics['interview'] || 0;
      const offerCount = activeStageMetrics['offer'] || 0;

      setMetrics(prev => ({
        ...prev,
        activeCandidates,
        activeStageMetrics,
        averageTimeToHire,
        conversionRates: {
          screening: totalStarted > 0 ? Math.round((screeningCount / totalStarted) * 100) : 0,
          interview: screeningCount > 0 ? Math.round((interviewCount / screeningCount) * 100) : 0,
          offer: interviewCount > 0 ? Math.round((offerCount / interviewCount) * 100) : 0,
          hired: offerCount > 0 ? Math.round((hiredCount / offerCount) * 100) : 0
        }
      }));
      
      setLoading(false);
    });

    return () => {
      unsubscribeJobs();
      unsubscribeCandidates();
    };
  }, [companyId]);

  return { metrics, loading };
}