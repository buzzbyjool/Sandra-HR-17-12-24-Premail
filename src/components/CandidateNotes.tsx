import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCandidateNotes } from '../hooks/useCandidateNotes'; 
import { toast } from 'react-hot-toast';
import { CandidateNote } from '../types/candidate';

interface CandidateNotesProps {
  candidateId: string;
}

export default function CandidateNotes({ candidateId }: CandidateNotesProps) {
  const { currentUser } = useAuth();
  const { notes, addNote, updateNote, deleteNote } = useCandidateNotes(candidateId);
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !currentUser) return;

    try {
      setLoading(true);
      await addNote({
        content: newNote,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || 'Unknown',
        createdAt: new Date().toISOString()
      });
      setNewNote('');
      toast.success('Note added successfully');
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Failed to add note');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (note: CandidateNote) => {
    setEditingNoteId(note.id);
    setEditedContent(note.content);
    setOpenMenuId(null);
  };

  const handleSaveEdit = async () => {
    if (!editingNoteId) return;
    try {
      setLoading(true);
      await updateNote(editingNoteId, editedContent);
      setEditingNoteId(null);
      setEditedContent('');
      toast.success('Note updated successfully');
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('Failed to update note');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    try {
      setLoading(true);
      await deleteNote(noteId);
      setOpenMenuId(null);
      toast.success('Note deleted successfully');
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="p-4 border-b border-gray-200 bg-white">
        <h3 className="font-medium text-gray-900">Notes & Feedback</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {notes.map((note, index) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-4 rounded-lg shadow-sm relative hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-900">{note.authorName}</span>
                <span className="text-sm text-gray-500">
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="relative">
                <button
                  onClick={() => setOpenMenuId(openMenuId === note.id ? null : note.id)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
                >
                  <MoreVertical size={16} />
                </button>
                {openMenuId === note.id && (
                  <div 
                    className="absolute right-0 top-0 mt-8 py-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleEdit(note)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note.id!)}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
            {editingNoteId === note.id ? (
              <div className="space-y-2">
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  rows={3}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingNoteId(null);
                      setEditedContent('');
                    }}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={loading}
                    className="px-3 py-1.5 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 whitespace-pre-wrap">{note.content}</p>
            )}
          </motion.div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
        <div className="relative">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note..."
            className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            rows={3}
          />
          <button
            type="submit"
            disabled={!newNote.trim() || loading}
            className="absolute right-2 bottom-2 p-2 text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
          >
            <Send size={20} className={loading ? 'animate-pulse' : ''} />
          </button>
        </div>
      </form>
    </div>
  );
}