import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Meeting } from '../types/meeting';
import { useDataContext } from './useDataContext';

export function useUpcomingMeetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const { getContextIds } = useDataContext();
  const { companyId } = getContextIds();

  useEffect(() => {
    const fetchMeetings = async () => {
      if (!companyId) {
        setMeetings([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get all candidates for the company
        const candidatesRef = collection(db, 'candidates');
        const candidatesQuery = query(
          candidatesRef,
          where('companyId', '==', companyId)
        );
        const candidatesSnapshot = await getDocs(candidatesQuery);
        const candidateIds = candidatesSnapshot.docs.map(doc => doc.id);

        // Fetch meetings for each candidate
        const allMeetings: Meeting[] = [];
        for (const candidateId of candidateIds) {
          const meetingsRef = collection(db, `candidates/${candidateId}/meetings`);
          const meetingsQuery = query(
            meetingsRef,
            where('date', '>=', today.toISOString())
          );
          const meetingsSnapshot = await getDocs(meetingsQuery);
          meetingsSnapshot.forEach(doc => {
            allMeetings.push({ id: doc.id, ...doc.data() } as Meeting);
          });
        }

        // Sort meetings by date and time
        const sortedMeetings = allMeetings.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time}`);
          const dateB = new Date(`${b.date}T${b.time}`);
          return dateA.getTime() - dateB.getTime();
        });

        setMeetings(sortedMeetings);
      } catch (error) {
        console.error('Error fetching meetings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, [companyId]);

  return { meetings, loading };
}