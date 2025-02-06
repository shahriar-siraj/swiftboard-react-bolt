import React, { useState, useEffect } from 'react';
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp, Timestamp
} from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { cn } from '../lib/utils';
import type { Project, Task, Milestone, Note, Secret, ProjectLink } from '../lib/types';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ProjectHeader from '../components/project/ProjectHeader';
import ProjectStats from '../components/project/ProjectStats';
import TaskList from '../components/project/TaskList';
import MilestoneList from '../components/project/MilestoneList';
import NoteList from '../components/project/NoteList';
import SecretList from '../components/project/SecretList';
import LinkList from '../components/project/LinkList';

export default function ProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [links, setLinks] = useState<ProjectLink[]>([]);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!user || !id) return;

      try {
        // Fetch project details
        const projectDoc = await getDoc(doc(db, 'projects', id));
        if (!projectDoc.exists()) {
          toast.error('Project not found');
          navigate('/dashboard');
          return;
        }

        const projectData = {
          id: projectDoc.id,
          ...projectDoc.data()
        } as Project;

        setProject(projectData);

        // Fetch all data in parallel
        const [
          tasksSnapshot,
          milestonesSnapshot,
          notesSnapshot,
          secretsSnapshot,
          linksSnapshot
        ] = await Promise.all([
          getDocs(query(collection(db, 'tasks'), where('projectId', '==', id), orderBy('createdAt', 'asc'))),
          getDocs(query(collection(db, 'milestones'), where('projectId', '==', id), orderBy('createdAt', 'asc'))),
          getDocs(query(collection(db, 'notes'), where('projectId', '==', id), orderBy('createdAt', 'asc'))),
          getDocs(query(collection(db, 'secrets'), where('projectId', '==', id), orderBy('createdAt', 'asc'))),
          getDocs(query(collection(db, 'project_links'), where('projectId', '==', id), orderBy('createdAt', 'asc')))
        ]);

        setTasks(tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Task[]);
        setMilestones(milestonesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Milestone[]);
        setNotes(notesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Note[]);
        setSecrets(secretsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Secret[]);
        setLinks(linksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ProjectLink[]);

      } catch (error) {
        console.error('Error fetching project data:', error);
        toast.error('Failed to load project data');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [user, id, navigate]);

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        status: completed ? 'done' : 'todo',
        updatedAt: serverTimestamp()
      });

      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, status: completed ? 'done' : 'todo' } : task
      ));
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleEditTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        ...updates,
        updatedAt: serverTimestamp()
      });

      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      ));
      toast.success('Task updated');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      setTasks(tasks.filter(task => task.id !== taskId));
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const input = formData.get('taskInput') as string;

    if (!input.trim()) return;

    try {
      const typeMatch = input.match(/#(bug|feature|improvement|general)/i);
      const priorityMatch = input.match(/!(high|medium|low)/i);
      const durationMatch = input.match(/in:(\d+(?:\.\d+)?)\s*(m|min|minute|minutes|h|hr|hour|hours|d|day|days|w|week|weeks)/i);

      let title = input
        .replace(/#(bug|feature|improvement|general)/i, '')
        .replace(/!(high|medium|low)/i, '')
        .replace(/in:\d+(?:\.\d+)?\s*(?:m|min|minute|minutes|h|hr|hour|hours|d|day|days|w|week|weeks)/i, '')
        .trim();

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

      const taskData = {
        projectId: id,
        title,
        description: '',
        type: (typeMatch?.[1].toLowerCase() as Task['type']) || 'feature',
        status: 'todo' as const,
        priority: (priorityMatch?.[1].toLowerCase() as Task['priority']) || '',
        duration,
        createdBy: user!.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'tasks'), taskData);
      const task = { id: docRef.id, ...taskData, createdAt: new Date(), updatedAt: new Date() } as Task;
      setTasks([...tasks, task]);
      toast.success('Task added');
      // e.currentTarget.reset();
    } catch (error) {
      toast.error('Failed to add task');
    }
  };

  const handleToggleMilestone = async (milestoneId: string, completed: boolean) => {
    try {
      await updateDoc(doc(db, 'milestones', milestoneId), {
        completed,
        updatedAt: serverTimestamp()
      });

      setMilestones(milestones.map(milestone =>
        milestone.id === milestoneId ? { ...milestone, completed } : milestone
      ));
    } catch (error) {
      toast.error('Failed to update milestone');
    }
  };

  const parseMilestoneDueDate = (input: string) => {
    // Parse deadline (by:YYYY-MM-DD)
    const dateMatch = input.match(/by:(\d{4}-\d{2}-\d{2})/);

    // Parse duration (in:Xd)
    const durationMatch = input.match(/in:(\d+(?:\.\d+)?)\s*(m|min|minute|minutes|h|hr|hour|hours|d|day|days|w|week|weeks)/i);

    // Remove date and duration syntax from title
    const title = input
        .replace(/by:\d{4}-\d{2}-\d{2}/, '')
        .replace(/in:\d+(?:\.\d+)?\s*(?:m|min|minute|minutes|h|hr|hour|hours|d|day|days|w|week|weeks)/i, '')
        .trim();

    let dueDate = null;

    if (dateMatch) {
      dueDate = new Date(dateMatch[1]);
    } else if (durationMatch) {
      const [_, value, unit] = durationMatch;
      const numValue = parseFloat(value);
      const now = new Date();

      switch (unit.toLowerCase()[0]) {
        case 'w':
          dueDate = new Date(now.getTime() + numValue * 7 * 24 * 60 * 60 * 1000);
          break;
        case 'd':
          dueDate = new Date(now.getTime() + numValue * 24 * 60 * 60 * 1000);
          break;
        case 'h':
          dueDate = new Date(now.getTime() + numValue * 60 * 60 * 1000);
          break;
        case 'm':
          dueDate = new Date(now.getTime() + numValue * 60 * 1000);
          break;
      }
    }

    if (dueDate) {
      dueDate = Timestamp.fromDate(dueDate);
    }

    return { title, dueDate };
  }

  const handleEditMilestone = async (milestoneId: string, input: string) => {
    try {
      const { title, dueDate } = parseMilestoneDueDate(input);

      await updateDoc(doc(db, 'milestones', milestoneId), {
        title,
        dueDate,
        updatedAt: serverTimestamp()
      });

      setMilestones(milestones.map(milestone =>
        milestone.id === milestoneId ? { ...milestone, title, dueDate } : milestone
      ));
      toast.success('Milestone updated');
    } catch (error) {
      toast.error('Failed to update milestone');
    }
  };

  const handleDeleteMilestone = async (milestoneId: string) => {
    try {
      await deleteDoc(doc(db, 'milestones', milestoneId));
      setMilestones(milestones.filter(milestone => milestone.id !== milestoneId));
      toast.success('Milestone deleted');
    } catch (error) {
      toast.error('Failed to delete milestone');
    }
  };

  const handleAddMilestone = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const input = formData.get('milestoneInput') as string;

    if (!input.trim()) return;

    try {
      const { title, dueDate } = parseMilestoneDueDate(input);

      const milestoneData = {
        projectId: id,
        title,
        description: '',
        dueDate,
        completed: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'milestones'), milestoneData);
      const docSnap = await getDoc(doc(db, "milestones", docRef.id));

      if (docSnap.exists()) {
        const milestone = { id: docSnap.id, ...docSnap.data() } as Milestone;
        setMilestones([...milestones, {...milestone}]);

        toast.success("Milestone added");
      }
    } catch (error) {
      console.error('Error adding milestone:', error);
      toast.error('Failed to add milestone');
    }
  };

  // const handleAddNote = async (content: string) => {
  const handleAddNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('noteTitle') as string;
    const content = formData.get('noteContent') as string;

    if (!title.trim() || !content.trim()) return;

    try {
      const noteData = {
        projectId: id,
        title: title.trim(),
        content: content.trim(),
        createdBy: user!.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'notes'), noteData);
      const docSnap = await getDoc(doc(db, "notes", docRef.id));

      if (docSnap.exists()) {
        const note = { id: docSnap.id, ...docSnap.data() } as Note;
        setNotes([...notes, {...note}]);

        toast.success("Note added");
      }
    } catch (error) {
      toast.error('Failed to add note');
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteDoc(doc(db, 'notes', noteId));
      setNotes(notes.filter(note => note.id !== noteId));
      toast.success('Note deleted');
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  const handleEditNote = async (noteId: string, title: string, content: string) => {
    try {
      await updateDoc(doc(db, 'notes', noteId), {
        title: title.trim(),
        content: content.trim(),
        updatedAt: serverTimestamp()
      });

      setNotes(notes.map(note =>
        note.id === noteId ? { ...note, title, content } : note
      ));
      toast.success('Note updated');
    } catch (error) {
      toast.error('Failed to update note');
    }
  };


  const handleAddSecret = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('secretName') as string;
    const value = formData.get('secretValue') as string;

    if (!name.trim() || !value.trim()) return;

    try {
      const secretData = {
        projectId: id,
        name: name.trim(),
        value: value.trim(),
        createdBy: user!.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'secrets'), secretData);
      const docSnap = await getDoc(doc(db, "secrets", docRef.id));

      if (docSnap.exists()) {
        const secret = { id: docSnap.id, ...docSnap.data() } as Secret;
        setSecrets([...secrets, {...secret}]);

        toast.success("Secret added");
      }
    } catch (error) {
      toast.error('Failed to add secret');
    }
  };

  const handleDeleteSecret = async (secretId: string) => {
    try {
      await deleteDoc(doc(db, 'secrets', secretId));
      setSecrets(secrets.filter(secret => secret.id !== secretId));
      toast.success('Secret deleted');
    } catch (error) {
      toast.error('Failed to delete secret');
    }
  };

  const handleEditSecret = async (secretId: string, name: string, value: string) => {
    try {
      await updateDoc(doc(db, 'secrets', secretId), {
        name: name.trim(),
        value: value.trim(),
        updatedAt: serverTimestamp()
      });

      setSecrets(secrets.map(secret =>
          secret.id === secretId ? { ...secret, name, value } : secret
      ));
      toast.success('Secret updated');
    } catch (error) {
      toast.error('Failed to update secret');
    }
  };

  const handleAddLink = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('linkName') as string;
    const url = formData.get('linkUrl') as string;
    const type = formData.get('linkType') as ProjectLink['type'];

    if (!name.trim() || !url.trim()) return;

    try {
      const linkData = {
        projectId: id,
        name: name.trim(),
        url: url.trim(),
        type,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'project_links'), linkData);
      const docSnap = await getDoc(doc(db, "project_links", docRef.id));

      if (docSnap.exists()) {
        const link = { id: docSnap.id, ...docSnap.data() } as ProjectLink;
        setLinks([...links, {...link}]);

        toast.success("Link added");
      }
    } catch (error) {
      toast.error('Failed to add link');
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    try {
      await deleteDoc(doc(db, 'project_links', linkId));
      setLinks(links.filter(link => link.id !== linkId));
      toast.success('Link deleted');
    } catch (error) {
      toast.error('Failed to delete link');
    }
  };

  const handleEditLink = async (secretId: string, name: string, url: string, type: ProjectLink['type']) => {
    try {
      await updateDoc(doc(db, 'project_links', secretId), {
        name: name.trim(),
        url: url.trim(),
        type,
        updatedAt: serverTimestamp()
      });

      setLinks(links.map(link =>
          link.id === secretId ? { ...link, name, url, type } : link
      ));
      toast.success('Link updated');
    } catch (error) {
      toast.error('Failed to update link');
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
      <div>
        <button
            onClick={() => navigate('/dashboard')}
            className="hidden sm:inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-1"/>
          Back to Dashboard
        </button>

        <ProjectHeader
            project={project}
            onProjectUpdate={(updatedProject) => setProject(updatedProject)}
        />

        {/* Stats Cards with Glass Morphism */}
        <div className="mb-8 rounded-xl bg-white/10 backdrop-blur-lg dark:bg-gray-800/10">
          <ProjectStats project={project} tasks={tasks} milestones={milestones}/>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Main Content (8 columns) */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            {/* Tasks Card */}
            <div
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 overflow-hidden">
              <TaskList
                  tasks={tasks}
                  onToggleTask={handleToggleTask}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onAddTask={handleAddTask}
              />
            </div>

            {/* Milestones Card */}
            <div
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 overflow-hidden">
              <MilestoneList
                  milestones={milestones}
                  onToggleMilestone={handleToggleMilestone}
                  onEditMilestone={handleEditMilestone}
                  onDeleteMilestone={handleDeleteMilestone}
                  onAddMilestone={handleAddMilestone}
              />
            </div>
          </div>

          {/* Sidebar Content (4 columns) */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            {/* Links Card */}
            <div
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20">
              <LinkList
                  links={links}
                  onDeleteLink={handleDeleteLink}
                  onAddLink={handleAddLink}
                  onEditLink={handleEditLink}
              />
            </div>

            {/* Notes Card */}
            <div
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20">
              <NoteList
                  notes={notes}
                  onUpdateNote={handleEditNote}
                  onDeleteNote={handleDeleteNote}
                  onAddNote={handleAddNote}
              />
            </div>

            {/* Secrets Card */}
            <div
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20">
              <SecretList
                  secrets={secrets}
                  onEditSecret={handleEditSecret}
                  onDeleteSecret={handleDeleteSecret}
                  onAddSecret={handleAddSecret}
              />
            </div>
          </div>
        </div>
      </div>
  );
}
