import { useFirestore } from './useFirestore';
import { JobNote } from '../types/job';
import { orderBy, collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useJobNotes(jobId: string) {
  const { documents: notes, ...rest } = useFirestore<JobNote>({
    collectionName: `jobs/${jobId}/notes`,
    queries: [orderBy('createdAt', 'desc')],
    enforceContext: false,
    defaultValue: []
  });

  const addNote = async (noteData: Omit<JobNote, 'id'>) => {
    try {
      const notesRef = collection(db, `jobs/${jobId}/notes`);
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
      const noteRef = doc(db, `jobs/${jobId}/notes/${noteId}`);
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
      const noteRef = doc(db, `jobs/${jobId}/notes/${noteId}`);
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