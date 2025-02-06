import React, { useState, useRef } from 'react';
import { CheckSquare, Square, Trash2, Clock, Flag, Tag, LayoutGrid, ClipboardList } from 'lucide-react';
import type { Task } from '../../lib/types';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (taskId: string, completed: boolean) => Promise<void>;
  onEditTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onAddTask: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

type TaskType = 'all' | 'bug' | 'feature' | 'improvement' | 'general';

export default function TaskList({
  tasks,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onAddTask
}: TaskListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [activeTab, setActiveTab] = useState<TaskType>('all');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const parseTaskInput = (input: string) => {
    // Parse type (#bug, #feature, #improvement, #general)
    const typeMatch = input.match(/#(bug|feature|improvement|general)/i);
    
    // Parse priority (!high, !medium, !low)
    const priorityMatch = input.match(/!(high|medium|low)/i);
    
    // Parse duration (in:2d, in:1w, in:30m, etc)
    const durationMatch = input.match(/in:(\d+(?:\.\d+)?)\s*(m|min|minute|minutes|h|hr|hour|hours|d|day|days|w|week|weeks)/i);
    
    // Remove all special syntax from title
    let title = input
      .replace(/#(bug|feature|improvement|general)/i, '')
      .replace(/!(high|medium|low)/i, '')
      .replace(/in:\d+(?:\.\d+)?\s*(?:m|min|minute|minutes|h|hr|hour|hours|d|day|days|w|week|weeks)/i, '')
      .trim();

    // Convert duration to standardized format
    let duration = null;
    if (durationMatch) {
      const [_, value, unit] = durationMatch;
      const numValue = parseFloat(value);
      
      switch (unit.toLowerCase()[0]) {
        case 'w':
          duration = `${numValue} week${numValue === 1 ? '' : 's'}`;
          break;
        case 'd':
          duration = `${numValue} day${numValue === 1 ? '' : 's'}`;
          break;
        case 'h':
          duration = `${numValue} hour${numValue === 1 ? '' : 's'}`;
          break;
        case 'm':
          duration = `${numValue} minute${numValue === 1 ? '' : 's'}`;
          break;
      }
    }

    return {
      title,
      type: (typeMatch?.[1].toLowerCase() as Task['type']) || 'general',
      priority: (priorityMatch?.[1].toLowerCase() as Task['priority']) || 'low',
      duration
    };
  };

  const handleEditStart = (task: Task) => {
    let content = task.title;
    if (task.priority) content += ` !${task.priority}`;
    if (task.type) content += ` #${task.type}`;
    if (task.duration) content += ` in:${task.duration.split(' ')[0]}${task.duration.split(' ')[1][0]}`;

    setEditingId(task.id);
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
    const updates = parseTaskInput(editingContent);
    await onEditTask(editingId, updates);
    setEditingId(null);
    setEditingContent('');
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingContent('');
  };

  const handleNewTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const input = formData.get('taskInput') as string;
    
    if (!input.trim()) return;
    
    onAddTask(e);
    setIsAddingTask(false);
    e.currentTarget.reset();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bug': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200';
      case 'feature': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200';
      case 'improvement': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bug': return '🐛';
      case 'feature': return '✨';
      case 'improvement': return '⚡';
      default: return '📋';
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'all') return true;
    return task.type === activeTab;
  });

  const groupedTasks = filteredTasks.reduce((acc, task) => {
    const status = task.status === 'done' ? 'done' : 'todo';
    if (!acc[status]) acc[status] = [];
    acc[status].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const tabs: { id: TaskType; label: string; count: number }[] = [
    { id: 'all', label: 'All Tasks', count: tasks.length },
    { id: 'bug', label: 'Bugs', count: tasks.filter(t => t.type === 'bug').length },
    { id: 'feature', label: 'Features', count: tasks.filter(t => t.type === 'feature').length },
    { id: 'improvement', label: 'Improvements', count: tasks.filter(t => t.type === 'improvement').length },
    { id: 'general', label: 'General', count: tasks.filter(t => t.type === 'general').length }
  ].filter(tab => tab.count > 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <CheckSquare className="h-5 w-5 mr-2 text-primary-500" />
              Tasks
            </h2>
            {tasks.length > 0 && (
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <span>{tasks.filter(t => t.status !== 'done').length} active</span>
                <span>•</span>
                <span>{tasks.filter(t => t.status === 'done').length} completed</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Type Tabs - Only show if there are tasks */}
      {tasks.length > 0 && (
        <div className="px-6 pt-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.id !== 'all' && <span className="mr-1">{getTypeIcon(tab.id)}</span>}
                {tab.label}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {/* Empty State */}
        {tasks.length === 0 && !isAddingTask && (
          <div className="px-6 py-12 text-center">
            <ClipboardList className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No tasks yet
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Get started by creating your first task
            </p>
            <button
              onClick={() => setIsAddingTask(true)}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Create Task
            </button>
          </div>
        )}

        {/* Active Tasks */}
        {(tasks.length > 0 || isAddingTask) && (
          <div className="px-6 py-4">
            <div className="space-y-2">
              {groupedTasks.todo?.map(task => (
                <div key={task.id}>
                  {editingId === task.id ? (
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
                        <span className="inline-block mr-2">Priority: !high, !medium, !low</span>
                        <span className="inline-block mr-2">Type: #bug, #feature, #improvement</span>
                        <span className="inline-block">Duration: in:30m, in:2h, in:3d, in:1w</span>
                      </div>
                    </div>
                  ) : (
                    <div className="group flex items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 p-3 rounded-lg">
                      <button
                        onClick={() => onToggleTask(task.id, true)}
                        className="flex-shrink-0 mr-3"
                      >
                        <Square className="h-5 w-5 text-gray-400 group-hover:text-primary-500" />
                      </button>
                      
                      <div className="flex-1 flex items-center justify-between">
                        <span 
                          className="text-gray-900 dark:text-white cursor-text"
                          onClick={() => handleEditStart(task)}
                        >
                          {task.title}
                        </span>
                        <div className="flex items-center space-x-2">
                          {task.duration && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                              <Clock className="h-3 w-3 mr-1" />
                              {task.duration}
                            </span>
                          )}
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(task.type)}`}>
                            <Tag className="h-3 w-3 mr-1" />
                            {task.type}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            <Flag className="h-3 w-3 mr-1" />
                            {task.priority}
                          </span>
                          <button
                            onClick={() => onDeleteTask(task.id)}
                            className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Add Task Button/Input */}
              {isAddingTask ? (
                <form onSubmit={handleNewTask} className="mt-2">
                  <textarea
                    name="taskInput"
                    placeholder="Add a task... Use !priority #type in:duration
Example: Implement login page !high #feature in:3d"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    rows={2}
                    autoFocus
                    onBlur={(e) => {
                      if (e.target.value.trim()) {
                        e.currentTarget.form?.requestSubmit();
                      } else {
                        setIsAddingTask(false);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        e.currentTarget.form?.requestSubmit();
                      } else if (e.key === 'Escape') {
                        setIsAddingTask(false);
                      }
                    }}
                  />
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span className="inline-block mr-2">Priority: !high, !medium, !low</span>
                    <span className="inline-block mr-2">Type: #bug, #feature, #improvement</span>
                    <span className="inline-block">Duration: in:30m, in:2h, in:3d, in:1w</span>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setIsAddingTask(true)}
                  className="w-full text-left px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  + Add task...
                </button>
              )}
            </div>
          </div>
        )}

        {/* Completed Tasks */}
        {groupedTasks.done?.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Completed Tasks
            </h3>
            <div className="space-y-2">
              {groupedTasks.done.map(task => (
                <div
                  key={task.id}
                  className="group flex items-center hover:bg-gray-100 dark:hover:bg-gray-800/50 p-3 rounded-lg"
                >
                  <button
                    onClick={() => onToggleTask(task.id, false)}
                    className="flex-shrink-0 mr-3"
                  >
                    <CheckSquare className="h-5 w-5 text-primary-500" />
                  </button>
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400 line-through">
                      {task.title}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}