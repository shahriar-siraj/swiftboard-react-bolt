import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Calendar, ArrowLeft, Loader2, Users, BookTemplate as Template } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { collection, addDoc, writeBatch, doc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import type { Project, ProjectMember } from '../lib/types';
import { PRE_LAUNCH_TEMPLATE } from '../lib/templates';
import Header from '../components/Header';

export default function NewProject() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    expectedLaunchDate: '',
    actualLaunchDate: '',
    status: 'pre_launch' as const,
    useTemplate: true,
    teamMembers: [] as { email: string }[]
  });

  const handleAddTeamMember = () => {
    setFormData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, { email: '' }]
    }));
  };

  const handleTeamMemberChange = (index: number, email: string) => {
    const newTeamMembers = [...formData.teamMembers];
    newTeamMembers[index].email = email;
    setFormData(prev => ({
      ...prev,
      teamMembers: newTeamMembers
    }));
  };

  const handleRemoveTeamMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as 'pre_launch' | 'launched';
    setFormData(prev => ({
      ...prev,
      status: newStatus,
      // Reset useTemplate to false if status is not pre_launch
      useTemplate: newStatus === 'pre_launch' ? prev.useTemplate : false
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setLoading(true);
    const batch = writeBatch(db);

    try {
      // Create project with dynamic launch date field based on status
      const projectData = {
        creatorId: auth.currentUser.uid,
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        status: formData.status,
        ...(formData.status === 'pre_launch'
                ? { expectedLaunchDate: formData.expectedLaunchDate ? new Date(formData.expectedLaunchDate) : null }
                : { actualLaunchDate: formData.actualLaunchDate ? new Date(formData.actualLaunchDate) : null }
        ),
        template: formData.useTemplate ? 'pre_launch' : null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const projectRef = await addDoc(collection(db, 'projects'), projectData);

      // Add creator as owner
      const memberData: ProjectMember = {
        projectId: projectRef.id,
        userId: auth.currentUser.uid,
        role: 'owner',
        email: auth.currentUser.email!,
        fullName: auth.currentUser.displayName || 'Unknown',
        createdAt: new Date()
      };
      await addDoc(collection(db, 'project_members'), memberData);

      // If using template, create template tasks and milestones
      if (formData.useTemplate) {
        // Add tasks
        for (const task of PRE_LAUNCH_TEMPLATE.tasks) {
          const taskRef = doc(collection(db, 'tasks'));
          batch.set(taskRef, {
            ...task,
            projectId: projectRef.id,
            createdBy: auth.currentUser.uid,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }

        // Add milestones
        for (const milestone of PRE_LAUNCH_TEMPLATE.milestones) {
          const milestoneRef = doc(collection(db, 'milestones'));
          batch.set(milestoneRef, {
            ...milestone,
            projectId: projectRef.id,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }

        await batch.commit();
      }

      toast.success('Project created successfully!');
      navigate(`/project/${projectRef.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const isPreLaunch = formData.status === 'pre_launch';
  const dateValue = isPreLaunch ? formData.expectedLaunchDate : formData.actualLaunchDate;
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [isPreLaunch ? 'expectedLaunchDate' : 'actualLaunchDate']: e.target.value
    }));
  };

  return (
      <div>
          <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Project</h1>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500 focus:ring-1 outline-none"
                    placeholder="My Awesome SaaS"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description <span className="text-sm text-gray-500">(optional)</span>
                </label>
                <textarea
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500 focus:ring-1 outline-none"
                    placeholder="Describe your project..."
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Project Status <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative">
                  <Rocket className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"/>
                  <select
                      id="status"
                      value={formData.status}
                      onChange={handleStatusChange}
                      className="block w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="pre_launch">Pre-launch</option>
                    <option value="launched">Launched</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="launchDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {isPreLaunch ? 'Expected Launch Date' : 'Launch Date'}{' '}
                  <span className="text-sm text-gray-500">(optional)</span>
                </label>
                <div className="mt-1 relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"/>
                  <input
                      type="date"
                      id="launchDate"
                      value={dateValue}
                      onChange={handleDateChange}
                      className="block w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500 focus:ring-1 outline-none"
                  />
                </div>
              </div>

              {formData.status === 'pre_launch' && (
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Template className="h-5 w-5 text-gray-400 mr-2"/>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Use Pre-launch Template
                      </label>
                      <input
                          type="checkbox"
                          checked={formData.useTemplate}
                          onChange={(e) => setFormData(prev => ({...prev, useTemplate: e.target.checked}))}
                          className="ml-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </div>
                    {formData.useTemplate && (
                        <div className="pl-7 text-sm text-gray-500 dark:text-gray-400">
                          <p>This will automatically create:</p>
                          <ul className="list-disc pl-5 mt-2">
                            <li>10 pre-configured tasks</li>
                            <li>3 milestone checkpoints</li>
                            <li>Recommended timeframes</li>
                          </ul>
                        </div>
                    )}
                  </div>
              )}

              {/*<div className="space-y-4">*/}
              {/*  <div className="flex items-center justify-between">*/}
              {/*    <div className="flex items-center">*/}
              {/*      <Users className="h-5 w-5 text-gray-400 mr-2"/>*/}
              {/*      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">*/}
              {/*        Team Members*/}
              {/*      </label>*/}
              {/*    </div>*/}
              {/*    <button*/}
              {/*        type="button"*/}
              {/*        onClick={handleAddTeamMember}*/}
              {/*        className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"*/}
              {/*    >*/}
              {/*      + Add Member*/}
              {/*    </button>*/}
              {/*  </div>*/}
              {/*  {formData.teamMembers.map((member, index) => (*/}
              {/*      <div key={index} className="flex items-center space-x-2">*/}
              {/*        <input*/}
              {/*            type="email"*/}
              {/*            value={member.email}*/}
              {/*            onChange={(e) => handleTeamMemberChange(index, e.target.value)}*/}
              {/*            placeholder="team@example.com"*/}
              {/*            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500"*/}
              {/*        />*/}
              {/*        <button*/}
              {/*            type="button"*/}
              {/*            onClick={() => handleRemoveTeamMember(index)}*/}
              {/*            className="text-red-500 hover:text-red-700"*/}
              {/*        >*/}
              {/*          Remove*/}
              {/*        </button>*/}
              {/*      </div>*/}
              {/*  ))}*/}
              {/*</div>*/}

              <div className="flex justify-end pt-4">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mr-4 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4 mr-2"/>
                        Creating...
                      </>
                  ) : (
                      'Create Project'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
  );
}
