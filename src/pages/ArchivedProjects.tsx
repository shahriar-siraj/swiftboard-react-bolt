import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  BarChart3,
  Calendar,
  ArrowRight,
  Archive,
  AlertTriangle
} from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import type { Project, Task } from '../lib/types';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

interface ProjectWithProgress extends Project {
  progress: number;
}

export default function ArchivedProjects() {
  const user = auth.currentUser;
  const [projects, setProjects] = useState<ProjectWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRestoreModal, setShowRestoreModal] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;

      try {
        const projectsRef = collection(db, 'projects');
        const projectsQuery = query(
          projectsRef,
          where('creatorId', '==', user.uid),
          where('archived', '==', true)
        );
        const projectsSnapshot = await getDocs(projectsQuery);
        const projectsData = projectsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          progress: 0
        })) as ProjectWithProgress[];

        const projectsWithProgress = await Promise.all(
          projectsData.map(async (project) => {
            const tasksRef = collection(db, 'tasks');
            const tasksQuery = query(tasksRef, where('projectId', '==', project.id));
            const tasksSnapshot = await getDocs(tasksQuery);
            const tasks = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Task[];

            const progress = tasks.length > 0
              ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100)
              : 0;

            return { ...project, progress };
          })
        );

        setProjects(projectsWithProgress);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  const handleRestoreProject = async (projectId: string) => {
    try {
      await updateDoc(doc(db, 'projects', projectId), {
        archived: false,
        updatedAt: new Date()
      });

      setProjects(projects.filter(p => p.id !== projectId));
      toast.success('Project restored successfully');
    } catch (error) {
      toast.error('Failed to restore project');
    }
    setShowRestoreModal(null);
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  const formatDate = (date: any) => {
    if (!date) return 'No date set';

    if (date.seconds) {
      return new Date(date.seconds * 1000).toLocaleDateString();
    }

    return new Date(date).toLocaleDateString();
  };

  return (
    <div>
        <div className="">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center">
              <Archive className="h-6 w-6 mr-2 text-gray-500" />
              Archived Projects
            </h1>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search archived projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-500 dark:text-gray-400">Loading archived projects...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
              <Archive className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No archived projects</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                {searchQuery
                  ? "No archived projects match your search criteria"
                  : "You haven't archived any projects yet"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => (
                <div
                  key={project.id}
                  className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="p-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {project.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                    <div className="mt-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        project.status === 'pre_launch'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {project.status === 'pre_launch' ? 'Pre-launch' : 'Launched'}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-1.5" />
                      {formatDate(project.createdAt)}
                    </div>
                  </div>
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <BarChart3 className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {project.progress}% Complete
                        </span>
                      </div>
                      <button
                        onClick={() => setShowRestoreModal(project.id)}
                        className="p-2 text-gray-400 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Restore project"
                      >
                        <Archive className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      {/* Restore Confirmation Modal */}
      {showRestoreModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-primary-100 dark:bg-primary-900/20 rounded-full">
              <AlertTriangle className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white text-center">
              Restore Project
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
              Are you sure you want to restore this project? It will be moved back to your active projects.
            </p>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowRestoreModal(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRestoreProject(showRestoreModal)}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Restore Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
