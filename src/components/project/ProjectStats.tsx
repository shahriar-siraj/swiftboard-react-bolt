import React from 'react';
import { Calendar, Clock, BarChart2, Target } from 'lucide-react';
import type { Project, Task, Milestone } from '../../lib/types';

interface ProjectStatsProps {
  project: Project;
  tasks: Task[];
  milestones: Milestone[];
}

export default function ProjectStats({ project, tasks, milestones }: ProjectStatsProps) {
  const taskProgress = tasks.length > 0
    ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100)
    : 0;

  const milestoneProgress = milestones.length > 0
    ? Math.round((milestones.filter(m => m.completed).length / milestones.length) * 100)
    : 0;

  const formatDate = (date: any) => {
    if (!date) return null;

    const timestamp = date.seconds ? date.seconds * 1000 : date;
    const dateObj = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - dateObj.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return dateObj > now ? 'Tomorrow' : 'Yesterday';
    } else {
      if (dateObj > now) {
        return `In ${diffDays} days`;
      } else {
        return `${diffDays} days ago`;
      }
    }
  };

  const parseDuration = (duration: string | undefined) => {
    if (!duration) return 0;

    const match = duration.match(/(\d+)\s*(day|days|d|week|weeks|w|hour|hours|h|minute|minutes|m)/i);
    if (!match) return 0;

    const [_, value, unit] = match;
    const numValue = parseInt(value);

    switch (unit.toLowerCase()[0]) {
      case 'w':
        return numValue * 7;
      case 'd':
        return numValue;
      case 'h':
        return numValue / 24;
      case 'm':
        return numValue / 1440;
      default:
        return 0;
    }
  };

  const calculateTimeSpent = () => {
    return tasks
      .filter(task => task.status === 'done')
      .reduce((total, task) => total + parseDuration(task.duration), 0);
  };

  const calculateTimeRequired = () => {
    return tasks
      .filter(task => task.status !== 'done')
      .reduce((total, task) => total + parseDuration(task.duration), 0);
  };

  const formatTime = (days: number) => {
    if (days < 1) {
      return `${Math.round(days * 24)} hours`;
    }
    return `${Math.round(days)} days`;
  };

  const timeSpent = calculateTimeSpent();
  const timeRequired = calculateTimeRequired();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
      {/* Launch Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hidden lg:block">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg ${
            project.status === 'pre_launch'
              ? 'bg-yellow-100 dark:bg-yellow-900'
              : 'bg-green-100 dark:bg-green-900'
          }`}>
            <Calendar className={`h-6 w-6 ${
              project.status === 'pre_launch'
                ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-green-600 dark:text-green-400'
            }`} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {project.status === 'pre_launch' ? 'Expected Launch' : 'Launched'}
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {project.status === 'pre_launch'
                ? formatDate(project.expectedLaunchDate) || 'Not set'
                : formatDate(project.actualLaunchDate)}
            </p>
          </div>
        </div>
      </div>

      {/* Time Required */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hidden lg:block">
        <div className="flex items-center">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
            <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Time Required</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatTime(timeRequired)}
            </p>
          </div>
        </div>
      </div>

      {/* Time Spent */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hidden lg:block">
        <div className="flex items-center">
          <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900">
            <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Time Spent</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatTime(timeSpent)}
            </p>
          </div>
        </div>
      </div>

      {/* Task Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
            <BarChart2 className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {/*<span className=" hidden lg:inline-block">Task Progress</span>*/}
              {/*<span className="inline-block lg:hidden">Tasks</span>*/}
              <span className="inline-block">Task Progress</span>
            </p>
            <div className="flex items-center">
              <p className="text-lg font-semibold text-gray-900 dark:text-white mr-2">
                {taskProgress}%
              </p>
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${taskProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Milestone Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
            <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Milestones</p>
            <div className="flex items-center">
              <p className="text-lg font-semibold text-gray-900 dark:text-white mr-2">
                {milestoneProgress}%
              </p>
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${milestoneProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
