import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  BarChart3,
  Calendar,
  ArrowRight,
  Inbox
} from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import type { Project, Task } from '../lib/types';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

interface ProjectWithProgress extends Project {
  progress: number;
}

export default function AllProjects() {
  const user = auth.currentUser;
  const [projects, setProjects] = useState<ProjectWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pre_launch' | 'launched'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;

      try {
        const projectsRef = collection(db, "projects");
        const projectMembersRef = collection(db, "project_members");
        const tasksRef = collection(db, "tasks");

        // Step 1: Get all projectIds where the user is a member
        const projectMembersQuery = query(projectMembersRef, where("userId", "==", user.uid), where("role", "==", "member"));
        const projectMembersSnapshot = await getDocs(projectMembersQuery);

        const projectIds = projectMembersSnapshot.docs.map(doc => doc.data().projectId);

        // Step 2: Query projects where the user is the creator
        let projectsQuery = query(projectsRef, where("creatorId", "==", user.uid));
        const creatorProjectsSnapshot = await getDocs(projectsQuery);
        const creatorProjects = creatorProjectsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          progress: 0
        })) as ProjectWithProgress[];

        let memberProjects: ProjectWithProgress[] = [];

        // Step 3: Fetch projects where the user is a member (if there are any)
        if (projectIds.length > 0) {
          const memberProjectsQuery = query(projectsRef, where("__name__", "in", projectIds));
          const memberProjectsSnapshot = await getDocs(memberProjectsQuery);
          memberProjects = memberProjectsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            progress: 0
          })) as ProjectWithProgress[];
        }

        // Combine both sets of projects
        const allProjects = [...creatorProjects, ...memberProjects];

        // Step 4: Compute progress for each project
        const projectsWithProgress = await Promise.all(
            allProjects.map(async (project) => {
              const tasksQuery = query(tasksRef, where("projectId", "==", project.id));
              const tasksSnapshot = await getDocs(tasksQuery);
              const tasks = tasksSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              })) as Task[];

              const progress = tasks.length > 0
                  ? Math.round((tasks.filter(t => t.status === "done").length / tasks.length) * 100)
                  : 0;

              return { ...project, progress };
            })
        );

        setProjects(projectsWithProgress);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const getFilteredProjects = () => {
    let filtered = projects;

    if (filter !== 'all') {
      filtered = filtered.filter(project => project.status === filter);
    }

    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      );
    }

    return filtered;
  };

  const filteredProjects = getFilteredProjects();

  const formatDate = (date: any) => {
    if (!date) return 'No date set';

    // Handle Firestore Timestamp
    if (date.seconds) {
      return new Date(date.seconds * 1000).toLocaleDateString();
    }

    // Handle regular Date object or string
    return new Date(date).toLocaleDateString();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center">
          <Inbox className="h-6 w-6 mr-2 text-gray-500" />
          All Projects
        </h1>
        <Link
          to="/new-project"
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
        >
          New Project
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'pre_launch' | 'launched')}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Status</option>
              <option value="pre_launch">Pre-launch</option>
              <option value="launched">Launched</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading projects...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Inbox className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No projects found</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {searchQuery
              ? "No projects match your search criteria"
              : "Get started by creating your first project"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <Link
              key={project.id}
              to={`/project/${project.id}`}
              className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
            >
              <div className="p-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
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
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>

  );
}
