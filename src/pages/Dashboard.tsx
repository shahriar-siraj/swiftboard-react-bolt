import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { 
  Plus, 
  Rocket, 
  Clock, 
  CheckCircle, 
  BarChart3, 
  Calendar,
  ArrowRight,
  Search,
  Filter,
  Star,
  Archive,
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

interface DashboardProps {
  defaultFilter?: 'all' | 'favorites';
}

export default function Dashboard({ defaultFilter = 'all' }: DashboardProps) {
  const user = auth.currentUser;
  const [projects, setProjects] = useState<ProjectWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pre_launch' | 'launched'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (defaultFilter === 'favorites') {
      setFilter('all');
    }
  }, [defaultFilter]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;

      try {
        const projectsRef = collection(db, 'projects');
        const projectsQuery = query(projectsRef, where('creatorId', '==', user.uid));
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
    
    if (defaultFilter === 'favorites') {
      filtered = filtered.filter(project => project.isStarred);
    }
    
    return filtered;
  };

  const filteredProjects = getFilteredProjects();
  const favoriteProjects = filteredProjects.filter(p => p.isStarred);
  const activeProjects = filteredProjects.filter(p => !p.isStarred && !p.archived);
  const archivedProjects = filteredProjects.filter(p => p.archived);

  const stats = {
    total: projects.length,
    preLaunch: projects.filter(p => p.status === 'pre_launch').length,
    launched: projects.filter(p => p.status === 'launched').length,
    thisMonth: projects.filter(p => {
      const projectDate = new Date(p.createdAt);
      const now = new Date();
      return projectDate.getMonth() === now.getMonth() && 
             projectDate.getFullYear() === now.getFullYear();
    }).length
  };

  const formatDate = (date: any) => {
    if (!date) return 'No date set';
    
    if (date.seconds) {
      return new Date(date.seconds * 1000).toLocaleDateString();
    }
    
    return new Date(date).toLocaleDateString();
  };

  const ProjectCard = ({ project }: { project: ProjectWithProgress }) => (
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
  );

  const ProjectSection = ({ 
    title, 
    icon: Icon, 
    projects, 
    emptyMessage 
  }: { 
    title: string; 
    icon: any; 
    projects: ProjectWithProgress[]; 
    emptyMessage: string;
  }) => (
    <div className="mb-12">
      <div className="flex items-center space-x-2 mb-6">
        <Icon className="h-5 w-5 text-gray-400" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">({projects.length})</span>
      </div>
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <Header />
      <main className="pl-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900">
                  <Rocket className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Projects</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900">
                  <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pre-launch</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.preLaunch}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Launched</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.launched}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                  <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">This Month</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.thisMonth}</p>
                </div>
              </div>
            </div>
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
                  className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as 'all' | 'pre_launch' | 'launched')}
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                >
                  <option value="all">All Projects</option>
                  <option value="pre_launch">Pre-launch</option>
                  <option value="launched">Launched</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-500 dark:text-gray-400">Loading your projects...</p>
            </div>
          ) : (
            <>
              <ProjectSection
                title="Favorite Projects"
                icon={Star}
                projects={favoriteProjects}
                emptyMessage="No favorite projects yet"
              />

              <ProjectSection
                title="Active Projects"
                icon={Inbox}
                projects={activeProjects}
                emptyMessage="No active projects"
              />

              <ProjectSection
                title="Archived Projects"
                icon={Archive}
                projects={archivedProjects}
                emptyMessage="No archived projects"
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}