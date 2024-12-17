import { useFirestore } from './useFirestore';
import { Meeting } from '../types/meeting';
import { orderBy, collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useCandidateMeetings(candidateId: string) {
  const { documents: meetings, ...rest } = useFirestore<Meeting>({
    collectionName: `candidates/${candidateId}/meetings`,
    queries: [orderBy('createdAt', 'desc')],
    enforceContext: false,
    defaultValue: []
  });

  const addMeeting = async (meetingData: Omit<Meeting, 'id'>) => {
    try {
      const meetingsRef = collection(db, `candidates/${candidateId}/meetings`);
      const timestamp = new Date().toISOString();
      const meetingDoc = await addDoc(meetingsRef, {
        ...meetingData,
        createdAt: timestamp,
        updatedAt: timestamp,
        status: 'scheduled'
      });
      return meetingDoc.id;
    } catch (error) {
      console.error('Error adding meeting:', error);
      throw error;
    }
  };

  const updateMeeting = async (meetingId: string, data: Partial<Meeting>) => {
    try {
      const meetingRef = doc(db, `candidates/${candidateId}/meetings/${meetingId}`);
      await updateDoc(meetingRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating meeting:', error);
      throw error;
    }
  };

  const deleteMeeting = async (meetingId: string) => {
    try {
      const meetingRef = doc(db, `candidates/${candidateId}/meetings/${meetingId}`);
      await deleteDoc(meetingRef);
    } catch (error) {
      console.error('Error deleting meeting:', error);
      throw error;
    }
  };

  return {
    meetings,
    addMeeting,
    updateMeeting,
    deleteMeeting,
    ...rest
  };
}