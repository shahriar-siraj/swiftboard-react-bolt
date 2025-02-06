import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star,
  Users,
  MoreVertical,
  Calendar,
  Pencil,
  Archive,
  Trash2,
  Rocket,
  X,
  Mail,
  AlertTriangle,
  MessageSquare,
  Shield,
  UserX,
  Globe,
  Twitter,
  Loader2,
  FilePenLine
} from 'lucide-react';
import type { Project, ProjectMember } from '../../lib/types';
import {doc, updateDoc, deleteDoc, collection, addDoc, query, where, getDocs, Timestamp} from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { toast } from 'react-hot-toast';

interface ProjectHeaderProps {
  project: Project;
  onProjectUpdate: (project: Project) => void;
}

export default function ProjectHeader({ project, onProjectUpdate }: ProjectHeaderProps) {
  const navigate = useNavigate();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [projectName, setProjectName] = useState(project.name);
  const [projectDescription, setProjectDescription] = useState(project.description || '');
  const [isStarred, setIsStarred] = useState(project.isStarred || false);
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessStoryModal, setShowSuccessStoryModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [storyContent, setStoryContent] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      const membersRef = collection(db, 'project_members');
      const q = query(membersRef, where('projectId', '==', project.id));
      const snapshot = await getDocs(q);
      const membersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ProjectMember[];
      setMembers(membersData);

      // Check if current user is admin
      const currentUser = auth.currentUser;
      if (currentUser) {
        const isUserAdmin = membersData.some(
          member => member.userId === currentUser.uid && member.role === 'owner'
        );
        setIsAdmin(isUserAdmin);
      }
    };

    fetchMembers();
  }, [project.id]);

  const handleNameUpdate = async () => {
    if (!projectName.trim() || projectName === project.name) {
      setIsEditingName(false);
      setProjectName(project.name);
      return;
    }

    try {
      const updatedProject = {
        ...project,
        name: projectName.trim(),
        updatedAt: new Date()
      };

      await updateDoc(doc(db, 'projects', project.id), {
        name: projectName.trim(),
        updatedAt: new Date()
      });

      onProjectUpdate(updatedProject);
      toast.success('Project name updated');
      setIsEditingName(false);
    } catch (error) {
      toast.error('Failed to update project name');
      setProjectName(project.name);
    }
  };

  const handleDescriptionUpdate = async () => {
    if (!projectDescription.trim() || projectDescription === project.description) {
      setIsEditingDescription(false);
      setProjectDescription(project.description || '');
      return;
    }

    try {
      const updatedProject = {
        ...project,
        description: projectDescription.trim(),
        updatedAt: new Date()
      };

      await updateDoc(doc(db, 'projects', project.id), {
        description: projectDescription.trim(),
        updatedAt: new Date()
      });

      onProjectUpdate(updatedProject);
      toast.success('Project description updated');
      setIsEditingDescription(false);
    } catch (error) {
      toast.error('Failed to update project description');
      setProjectDescription(project.description || '');
    }
  };

  const handleStatusUpdate = async () => {
    try {
      const now = new Date();
      const updates = {
        status: project.status === 'pre_launch' ? 'launched' : 'pre_launch',
        actualLaunchDate: project.status === 'pre_launch' ? now : null,
        expectedLaunchDate: project.status === 'pre_launch' ? null : project.expectedLaunchDate,
        updatedAt: now
      };

      await updateDoc(doc(db, 'projects', project.id), updates);

      const updatedProject = {
        ...project,
        ...updates
      };

      onProjectUpdate(updatedProject);
      toast.success(project.status === 'pre_launch' ? 'Project launched! 🚀' : 'Project status updated');
    } catch (error) {
      toast.error('Failed to update project status');
    }
  };

  const handleDateUpdate = async (date: Date | null) => {
    try {
      date = Timestamp.fromDate(date);

      const updates = {
        [project.status === 'pre_launch' ? 'expectedLaunchDate' : 'actualLaunchDate']: date,
        updatedAt: new Date()
      };

      await updateDoc(doc(db, 'projects', project.id), updates);

      const updatedProject = {
        ...project,
        ...updates
      };

      onProjectUpdate(updatedProject);
      toast.success('Launch date updated');
    } catch (error) {
      toast.error('Failed to update launch date');
    }
  };

  const handleStarToggle = async () => {
    try {
      const updatedProject = {
        ...project,
        isStarred: !isStarred,
        updatedAt: new Date()
      };

      await updateDoc(doc(db, 'projects', project.id), {
        isStarred: !isStarred,
        updatedAt: new Date()
      });

      onProjectUpdate(updatedProject);
      setIsStarred(!isStarred);
      toast.success(isStarred ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      toast.error('Failed to update favorite status');
    }
  };

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    try {
      // Check if user already exists
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', inviteEmail.trim()));
      const userSnapshot = await getDocs(q);

      if (userSnapshot.empty) {
        toast.error('User not found. They need to create an account first.');
        return;
      }

      const userId = userSnapshot.docs[0].id;

      // Check if already a member
      const membersRef = collection(db, 'project_members');
      const memberQuery = query(
        membersRef,
        where('projectId', '==', project.id),
        where('userId', '==', userId)
      );
      const memberSnapshot = await getDocs(memberQuery);

      if (!memberSnapshot.empty) {
        toast.error('User is already a member of this project');
        return;
      }

      await addDoc(collection(db, 'project_members'), {
        projectId: project.id,
        userId,
        email: inviteEmail.trim(),
        role: 'member',
        createdAt: new Date()
      });

      toast.success('Member added successfully');
      setInviteEmail('');
      setShowShareModal(false);

      // Refresh members list
      const newMembersSnapshot = await getDocs(query(membersRef, where('projectId', '==', project.id)));
      setMembers(newMembersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ProjectMember[]);
    } catch (error) {
      toast.error('Failed to add member');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await deleteDoc(doc(db, 'project_members', memberId));
      setMembers(members.filter(m => m.id !== memberId));
      toast.success('Member removed');
    } catch (error) {
      toast.error('Failed to remove member');
    }
  };

  const handleEdit = () => {
    // setIsEditingDescription(true);
    setIsEditingName(true);
  }

  const handleArchive = async () => {
    try {
      const updatedProject = {
        ...project,
        archived: true,
        updatedAt: new Date()
      };

      await updateDoc(doc(db, 'projects', project.id), {
        archived: true,
        updatedAt: new Date()
      });

      onProjectUpdate(updatedProject);
      toast.success('Project archived');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to archive project');
    }
  };

  const handleDelete = async () => {
    if (!isAdmin) {
      toast.error('Only the project owner can delete the project');
      return;
    }

    try {
      // Delete all related data
      const collections = ['tasks', 'milestones', 'notes', 'project_members', 'project_links'];

      for (const collectionName of collections) {
        const itemsRef = collection(db, collectionName);
        const q = query(itemsRef, where('projectId', '==', project.id));
        const snapshot = await getDocs(q);

        for (const doc of snapshot.docs) {
          await deleteDoc(doc.ref);
        }
      }

      // Finally delete the project
      await deleteDoc(doc(db, 'projects', project.id));
      toast.success('Project deleted');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const handleSubmitSuccessStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyContent.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'success_stories'), {
        projectId: project.id,
        projectName: project.name,
        userId: auth.currentUser?.uid,
        userEmail: auth.currentUser?.email,
        content: storyContent.trim(),
        projectUrl: projectUrl.trim() || null,
        twitterHandle: twitterHandle.trim() || null,
        status: 'pending',
        createdAt: new Date()
      });

      toast.success('Thank you for sharing your story! It will be reviewed and featured soon.');
      setShowSuccessStoryModal(false);
      setStoryContent('');
      setProjectUrl('');
      setTwitterHandle('');
    } catch (error) {
      toast.error('Failed to submit story');
    } finally {
      setLoading(false);
    }
  };

  const canRemoveMember = (member: Member) => {
    if (isAdmin && member.role !== "owner") return true;
    if (!isAdmin && member.userId === auth.currentUser?.uid) return true;
    return false;
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="space-y-1 flex-1 w-full">
              {isEditingName ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    onBlur={handleNameUpdate}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleNameUpdate();
                      if (e.key === 'Escape') {
                        setIsEditingName(false);
                        setProjectName(project.name);
                      }
                    }}
                    className="text-2xl font-semibold bg-transparent border-b-2 border-primary-500 focus:outline-none focus:border-primary-600 text-gray-900 dark:text-white"
                    autoFocus
                  />
                </div>
              ) : (
                  <div className="flex items-center justify-between space-x-2">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white" onClick={() => setIsEditingName(true)}>
                      {project.name}
                    </h1>
                    <div className="relative md:hidden">
                      <button
                          onClick={() => setShowMobileMenu(!showMobileMenu)}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <MoreVertical className="h-5 w-5"/>
                      </button>
                      {showMobileMenu && (
                        <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                          <div className="py-1">
                            <button
                                onClick={() => setIsEditingName(true)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                            >
                              <Pencil className="h-4 w-4 mr-2"/>
                              Edit Name
                            </button>
                            <button
                                onClick={() => setIsEditingDescription(true)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                            >
                              <FilePenLine className="h-4 w-4 mr-2"/>
                              Edit Description
                            </button>
                            <button
                                onClick={handleStatusUpdate}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                            >
                              <Rocket className="h-4 w-4 mr-2"/>
                              {project.status === 'pre_launch' ? 'Launch Project' : 'Revert to Pre-launch'}
                            </button>
                            <button
                                onClick={handleStarToggle}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                            >
                              <Star className="h-4 w-4 mr-2"/>
                              {isStarred ? 'Remove from favorites' : 'Add to favorites'}
                            </button>
                            <button
                                onClick={() => setShowSuccessStoryModal(true)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                            >
                              <MessageSquare className="h-4 w-4 mr-2"/>
                              Share Your Story
                            </button>
                            <button
                                onClick={() => setShowShareModal(true)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                            >
                              <Users className="h-4 w-4 mr-2"/>
                              Invite Members
                            </button>
                            <button
                                onClick={handleArchive}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                            >
                              <Archive className="h-4 w-4 mr-2"/>
                              Archive Project
                            </button>
                            {isAdmin && (
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                                >
                                  <Trash2 className="h-4 w-4 mr-2"/>
                                  Delete Project
                                </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    {/*<button*/}
                    {/*  onClick={() => setIsEditingName(true)}*/}
                    {/*  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"*/}
                    {/*>*/}
                    {/*  <Pencil className="h-4 w-4" />*/}
                    {/*</button>*/}
                  </div>
              )}

              {isEditingDescription ? (
                  <div className="mt-2">
                    <textarea
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        onBlur={handleDescriptionUpdate}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleDescriptionUpdate();
                          }
                          if (e.key === 'Escape') {
                            setIsEditingDescription(false);
                            setProjectDescription(project.description || '');
                          }
                        }}
                        className="w-full p-2 bg-transparent border-b-2 border-primary-500 focus:outline-none focus:border-primary-600 text-gray-900 dark:text-white"
                        autoFocus
                    />
                  </div>
              ) : (
                  <div className="mt-2 flex items-center space-x-2">
                    <p className="text-gray-500 dark:text-gray-400 pr-3" onClick={() => setIsEditingDescription(true)}>
                      {project.description || ''}
                    </p>
                    {/*<button*/}
                    {/*    onClick={() => setIsEditingDescription(true)}*/}
                    {/*    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"*/}
                    {/*>*/}
                    {/*  <Pencil className="h-4 w-4" />*/}
                    {/*</button>*/}
                  </div>
              )}



              {/*{project.description && (*/}
              {/*  <p className="text-gray-500 dark:text-gray-400">{project.description}</p>*/}
              {/*)}*/}
              <div className="flex items-center space-x-4 pt-2">
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  project.status === 'pre_launch'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}>
                  <Rocket className="h-3 w-3 mr-1" />
                  {project.status === 'pre_launch' ? 'Pre-launch' : 'Launched'}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                  <input
                    type="date"
                    value={project.status === 'pre_launch'
                      ? project.expectedLaunchDate?.seconds
                        ? new Date(project.expectedLaunchDate.seconds * 1000).toISOString().split('T')[0]
                        : ''
                      : project.actualLaunchDate?.seconds
                        ? new Date(project.actualLaunchDate.seconds * 1000).toISOString().split('T')[0]
                        : new Date().toISOString().split('T')[0]
                    }
                    onChange={(e) => handleDateUpdate(e.target.value ? new Date(e.target.value) : null)}
                    className="text-sm text-gray-500 dark:text-gray-400 bg-transparent border-none focus:ring-0 cursor-pointer"
                  />
                </div>
                {isAdmin && (
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-primary-500 mr-1" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Owner</span>
                  </div>
                )}
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={handleStarToggle}
                className={`p-2 rounded-lg transition-colors ${
                  isStarred
                    ? 'text-yellow-500 hover:text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
                    : 'text-gray-400 hover:text-yellow-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Star className="h-5 w-5" fill={isStarred ? 'currentColor' : 'none'} />
              </button>

              <button
                onClick={() => setShowSuccessStoryModal(true)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                <span className="hidden lg:block">Share Your Story</span>
              </button>

              <button
                onClick={() => setShowShareModal(true)}
                className="p-2 text-gray-400 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Users className="h-5 w-5" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <button
                          onClick={() => setIsEditingName(true)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      >
                        <Pencil className="h-4 w-4 mr-2"/>
                        Edit Name
                      </button>
                      <button
                          onClick={() => setIsEditingDescription(true)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      >
                        <FilePenLine className="h-4 w-4 mr-2"/>
                        Edit Description
                      </button>
                      <button
                          onClick={handleStatusUpdate}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      >
                        <Rocket className="h-4 w-4 mr-2"/>
                        {project.status === 'pre_launch' ? 'Launch Project' : 'Revert to Pre-launch'}
                      </button>
                      <button
                          onClick={handleArchive}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      >
                        <Archive className="h-4 w-4 mr-2"/>
                        Archive Project
                      </button>
                      {isAdmin && (
                          <button
                              onClick={() => setShowDeleteModal(true)}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                          >
                            <Trash2 className="h-4 w-4 mr-2"/>
                            Delete Project
                          </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Project Members</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Current Members</h3>
                <div className="space-y-3">
                  {members.map(member => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                          <span className="text-primary-600 dark:text-primary-400 font-medium">
                            {member.email[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{member.email}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{isAdmin ? 'Owner' : 'Member'}</p>
                        </div>
                      </div>
                      {canRemoveMember(member) && (
                          <button
                              onClick={() => handleRemoveMember(member.id)}
                              className="p-1 text-gray-400 hover:text-red-500"
                          >
                            <UserX className="h-4 w-4" />
                          </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <form onSubmit={handleShare}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Invite new member
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="pl-10 h-[40px] w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="colleague@example.com"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      Invite
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white text-center">
                Delete Project
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                Are you sure you want to delete this project? This action cannot be undone.
              </p>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Delete Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Story Modal */}
      {showSuccessStoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Share Your Success Story</h2>
              <button
                onClick={() => setShowSuccessStoryModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitSuccessStory} className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tell Your Story
                  </label>
                  <textarea
                    value={storyContent}
                    onChange={(e) => setStoryContent(e.target.value)}
                    rows={6}
                    className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Share your journey, challenges, and how you overcame them. What advice would you give to fellow indie developers?"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Project URL (optional)
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="url"
                        value={projectUrl}
                        onChange={(e) => setProjectUrl(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="https://your-project.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Twitter Handle (optional)
                    </label>
                    <div className="relative">
                      <Twitter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={twitterHandle}
                        onChange={(e) => setTwitterHandle(e.target.value.replace(/^@/, ''))}
                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="username"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Your story will be reviewed and may be featured on our landing page to inspire other indie developers.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowSuccessStoryModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Share Story'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
