import React, { useState, useRef } from 'react';
import { Flag, CheckSquare, Square, Trash2, Calendar, Plus } from 'lucide-react';
import type { Milestone } from '../../lib/types';

interface MilestoneListProps {
  milestones: Milestone[];
  onToggleMilestone: (id: string, completed: boolean) => Promise<void>;
  onEditMilestone: (id: string, title: string) => Promise<void>;
  onDeleteMilestone: (id: string) => Promise<void>;
  onAddMilestone: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export default function MilestoneList({
  milestones,
  onToggleMilestone,
  onEditMilestone,
  onDeleteMilestone,
  onAddMilestone
}: MilestoneListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const parseMilestoneInput = (input: string) => {
    // Parse deadline (by:YYYY-MM-DD)
    const dateMatch = input.match(/by:(\d{4}-\d{2}-\d{2})/);
    
    // Remove date syntax from title
    let title = input.replace(/by:\d{4}-\d{2}-\d{2}/, '').trim();
    
    return {
      title,
      dueDate: dateMatch?.[1] || null
    };
  };

  const handleEditStart = (milestone: Milestone) => {
    let content = milestone.title;
    if (milestone.dueDate) {
      const date = new Date(milestone.dueDate);
      content += ` by:${date.toISOString().split('T')[0]}`;
    }

    setEditingId(milestone.id);
    setEditingContent(content);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.select();
      }
    }, 0);
  };

  const handleEditSave = async () => {
    if (!editingId || !editingContent.trim()) return;
    const { title } = parseMilestoneInput(editingContent);
    await onEditMilestone(editingId, title);
    setEditingId(null);
    setEditingContent('');
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingContent('');
  };

  const handleNewMilestone = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const input = formData.get('milestoneInput') as string;
    
    if (!input.trim()) return;
    
    onAddMilestone(e);
    setIsAddingMilestone(false);
    e.currentTarget.reset();
  };

  const handleToggleMilestone = async (milestone: Milestone, completed: boolean) => {
    try {
      await onToggleMilestone(milestone.id, completed);
    } catch (error) {
      console.error('Failed to toggle milestone:', error);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Flag className="h-5 w-5 mr-2 text-primary-500" />
                Milestones
              </h2>
              {milestones.length > 0 && (
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>{milestones.filter(m => !m.completed).length} remaining</span>
                  <span>•</span>
                  <span>{milestones.filter(m => m.completed).length} completed</span>
                </div>
              )}
            </div>
            {milestones.length > 0 && (
              <button
                onClick={() => setIsAddingMilestone(true)}
                className="p-1.5 text-gray-500 hover:text-primary-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Plus className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {/* Empty State */}
          {milestones.length === 0 && !isAddingMilestone && (
            <div className="px-6 py-12 text-center">
              <Flag className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                No milestones yet
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Track your project's progress by adding key milestones
              </p>
              <button
                onClick={() => setIsAddingMilestone(true)}
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Add First Milestone
              </button>
            </div>
          )}

          {/* Active Milestones */}
          <div className="px-6 py-4">
            <div className="space-y-2">
              {milestones.filter(m => !m.completed).map(milestone => (
                <div key={milestone.id}>
                  {editingId === milestone.id ? (
                    <div className="space-y-2">
                      <textarea
                        ref={textareaRef}
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        onBlur={handleEditSave}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        rows={2}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleEditSave();
                          } else if (e.key === 'Escape') {
                            handleEditCancel();
                          }
                        }}
                      />
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        <span className="inline-block">Due Date: by:YYYY-MM-DD (optional)</span>
                      </div>
                    </div>
                  ) : (
                    <div className="group flex items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 p-3 rounded-lg">
                      <button
                        onClick={() => handleToggleMilestone(milestone, true)}
                        className="flex-shrink-0 mr-3"
                      >
                        <Square className="h-5 w-5 text-gray-400 group-hover:text-primary-500" />
                      </button>
                      <div className="flex-1 flex items-center justify-between">
                        <div>
                          <span 
                            className="text-gray-900 dark:text-white cursor-text"
                            onClick={() => handleEditStart(milestone)}
                          >
                            {milestone.title}
                          </span>
                          {milestone.dueDate && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(milestone.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => onDeleteMilestone(milestone.id)}
                          className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Add Milestone Button/Input */}
              {isAddingMilestone ? (
                <form onSubmit={handleNewMilestone} className="mt-2">
                  <textarea
                    name="milestoneInput"
                    placeholder="Add a milestone... Use by:YYYY-MM-DD for due date
Example: Launch beta version by:2024-03-01"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    rows={2}
                    autoFocus
                    onBlur={(e) => {
                      if (e.target.value.trim()) {
                        e.currentTarget.form?.requestSubmit();
                      } else {
                        setIsAddingMilestone(false);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        e.currentTarget.form?.requestSubmit();
                      } else if (e.key === 'Escape') {
                        setIsAddingMilestone(false);
                      }
                    }}
                  />
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span className="inline-block">Due Date: by:YYYY-MM-DD (optional)</span>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setIsAddingMilestone(true)}
                  className="w-full text-left px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  + Add milestone...
                </button>
              )}
            </div>
          </div>

          {/* Completed Milestones */}
          {milestones.some(m => m.completed) && (
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Completed Milestones
              </h3>
              <div className="space-y-2">
                {milestones.filter(m => m.completed).map(milestone => (
                  <div
                    key={milestone.id}
                    className="group flex items-center hover:bg-gray-100 dark:hover:bg-gray-800/50 p-3 rounded-lg"
                  >
                    <button
                      onClick={() => handleToggleMilestone(milestone, false)}
                      className="flex-shrink-0 mr-3"
                    >
                      <CheckSquare className="h-5 w-5 text-primary-500" />
                    </button>
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400 line-through">
                        {milestone.title}
                      </span>
                      <button
                        onClick={() => onDeleteMilestone(milestone.id)}
                        className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}