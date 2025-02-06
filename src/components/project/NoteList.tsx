import React, { useState } from 'react';
import {FileText, Trash2, Plus, BookOpen, Lock, Pencil} from 'lucide-react';
import type { Note } from '../../lib/types';

interface NoteListProps {
  notes: Note[];
  onDeleteNote: (id: string) => Promise<void>;
  onAddNote: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onUpdateNote: (id: string, title: string, content: string) => Promise<void>;
}

export default function NoteList({ notes, onDeleteNote, onAddNote, onUpdateNote }: NoteListProps) {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const handleAdd = () => {
    setIsAddingNote(true);
    setEditingNoteId(null);
    setEditTitle("");
    setEditContent("");
  }

  const handleEdit = (note: Note) => {
    setIsAddingNote(false);
    setEditingNoteId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const handleUpdate = async (e: React.FormEvent, noteId: string) => {
    e.preventDefault();
    await onUpdateNote(noteId, editTitle, editContent);
    setEditingNoteId(null);
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
            onClick={handleAdd}
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
              onClick={handleAdd}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Add First Note
            </button>
          </div>
        )}

        {notes.map(note => (
          <div key={note.id}>
            {editingNoteId === note.id ? (
                <form
                    onSubmit={(e) => {handleUpdate(e, note.id)}}
                    className="mt-4 space-y-4"
                >
                  <div>
                    <input
                        type="text"
                        name="noteTitle"
                        placeholder="Note title"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        required
                        autoFocus
                    />
                  </div>
                  <div>
                    <textarea
                        name="noteContent"
                        placeholder="Write note content"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        rows={3}
                        required
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                    >
                      <Lock className="h-4 w-4 mr-2"/>
                      Update Note
                    </button>
                    <button
                        type="button"
                        onClick={() => setEditingNoteId(null)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
            ) : (
                <div
                    key={note.id}
                    className="group bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{note.title}</h3>
                      <p className="mt-2 text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                        {note.content}
                      </p>
                    </div>
                    <button
                        onClick={() => handleEdit(note)}
                        className="p-1 text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Pencil className="h-4 w-4"/>
                    </button>

                    <button
                        onClick={() => onDeleteNote(note.id)}
                        className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4"/>
                    </button>
                  </div>
                </div>
                  )}
              </div>
              ))}

            {isAddingNote && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    onAddNote(e);
                    setIsAddingNote(false);
                }}
                className="mt-4 space-y-4"
            >
              <div>
                <input
                    type="text"
                    name="noteTitle"
                    placeholder="Note title"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    required
                    autoFocus
                />
              </div>
              <div>
              <textarea
                  name="noteContent"
                  placeholder="Write note content"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  rows={3}
                  required
                />
            </div>
            <div className="flex space-x-2">
              <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                <Lock className="h-4 w-4 mr-2"/>
                Add Note
              </button>
              <button
                  type="button"
                  onClick={() => setIsAddingNote(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
