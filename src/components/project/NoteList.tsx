import React, { useState } from 'react';
import { FileText, Calendar, Trash2, Plus, BookOpen } from 'lucide-react';
import type { Note } from '../../lib/types';

interface NoteListProps {
  notes: Note[];
  onDeleteNote: (id: string) => Promise<void>;
  onAddNote: (content: string) => Promise<void>;
}

export default function NoteList({ notes, onDeleteNote, onAddNote }: NoteListProps) {
  const [isAddingNote, setIsAddingNote] = useState(false);

  const handleSaveNote = (e: React.KeyboardEvent<HTMLTextAreaElement> | React.FocusEvent<HTMLTextAreaElement>) => {
    const content = e.currentTarget.value.trim();
    if (content) {
      onAddNote(content);
      e.currentTarget.value = '';
    }
    setIsAddingNote(false);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown date';
    
    // Handle Firestore Timestamp
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString();
    }
    
    // Handle regular Date object or string
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <FileText className="h-5 w-5 mr-2 text-primary-500" />
          Notes
        </h2>
        {notes.length > 0 && (
          <button
            onClick={() => setIsAddingNote(true)}
            className="p-1.5 text-gray-500 hover:text-primary-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Plus className="h-5 w-5" />
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {/* Empty State */}
        {notes.length === 0 && !isAddingNote && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No notes yet
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Keep track of important information and ideas
            </p>
            <button
              onClick={() => setIsAddingNote(true)}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Add First Note
            </button>
          </div>
        )}

        {notes.map(note => (
          <div
            key={note.id}
            className="group bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                  {note.content}
                </p>
                <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(note.createdAt)}
                </div>
              </div>
              <button
                onClick={() => onDeleteNote(note.id)}
                className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {isAddingNote && (
          <div className="mt-4">
            <textarea
              placeholder="Add a note... (Press Enter to save)"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSaveNote(e);
                } else if (e.key === 'Escape') {
                  setIsAddingNote(false);
                }
              }}
              onBlur={handleSaveNote}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
              autoFocus
            />
          </div>
        )}
      </div>
    </div>
  );
}