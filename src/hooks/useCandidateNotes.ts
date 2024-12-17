import { useFirestore } from './useFirestore';
import { CandidateNote } from '../types/candidate';
import { orderBy, collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useCandidateNotes(candidateId: string) {
  const { documents: notes, add, ...rest } = useFirestore<CandidateNote>({
    collectionName: `candidates/${candidateId}/notes`,
    queries: [orderBy('createdAt', 'desc')],
    enforceContext: false,
    defaultValue: []
  });

  const addNote = async (noteData: Omit<CandidateNote, 'id'>) => {
    try {
      const notesRef = collection(db, `candidates/${candidateId}/notes`);
      const noteDoc = await addDoc(notesRef, {
        ...noteData,
        createdAt: new Date().toISOString()
      });
      return noteDoc.id;
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  };

  const updateNote = async (noteId: string, content: string) => {
    try {
      const noteRef = doc(db, `candidates/${candidateId}/notes/${noteId}`);
      await updateDoc(noteRef, {
        content,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const noteRef = doc(db, `candidates/${candidateId}/notes/${noteId}`);
      await deleteDoc(noteRef);
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  };

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
    ...rest
  };
}