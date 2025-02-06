import type { Task, Milestone } from './types';

export interface ProjectTemplate {
  name: string;
  description: string;
  tasks: Omit<Task, 'id' | 'projectId' | 'createdBy' | 'createdAt' | 'updatedAt'>[];
  milestones: Omit<Milestone, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>[];
}

export const PRE_LAUNCH_TEMPLATE: ProjectTemplate = {
  name: 'SaaS Pre-launch Template',
  description: 'A comprehensive checklist for launching your SaaS project',
  tasks: [
    {
      title: 'Set up authentication system',
      description: 'Implement secure user authentication and authorization',
      type: 'general',
      status: 'todo',
      priority: 'high',
      duration: '3 days',
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Design database schema',
      description: 'Plan and implement the database structure',
      type: 'general',
      status: 'todo',
      priority: 'high',
      duration: '2 days',
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Set up CI/CD pipeline',
      description: 'Configure automated testing and deployment',
      type: 'general',
      status: 'todo',
      priority: 'medium',
      duration: '2 days',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Implement core features',
      description: 'Build the main functionality of your application',
      type: 'general',
      status: 'todo',
      priority: 'high',
      duration: '10 days',
      deadline: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Set up monitoring and logging',
      description: 'Implement error tracking and performance monitoring',
      type: 'general',
      status: 'todo',
      priority: 'medium',
      duration: '2 days',
      deadline: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Create documentation',
      description: 'Write user guides and API documentation',
      type: 'general',
      status: 'todo',
      priority: 'medium',
      duration: '3 days',
      deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Set up payment processing',
      description: 'Integrate payment gateway and subscription management',
      type: 'general',
      status: 'todo',
      priority: 'high',
      duration: '4 days',
      deadline: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Implement email notifications',
      description: 'Set up transactional emails and notifications',
      type: 'general',
      status: 'todo',
      priority: 'medium',
      duration: '2 days',
      deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Security audit',
      description: 'Perform security testing and vulnerability assessment',
      type: 'general',
      status: 'todo',
      priority: 'high',
      duration: '3 days',
      deadline: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Beta testing',
      description: 'Conduct user testing and gather feedback',
      type: 'general',
      status: 'todo',
      priority: 'high',
      duration: '7 days',
      deadline: new Date(Date.now() + 38 * 24 * 60 * 60 * 1000)
    }
  ],
  milestones: [
    {
      title: 'MVP Development Complete',
      description: 'Core features implemented and tested',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      completed: false
    },
    {
      title: 'Beta Launch',
      description: 'Release to beta testers and gather feedback',
      dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      completed: false
    },
    {
      title: 'Public Launch',
      description: 'Official public release',
      dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      completed: false
    }
  ]
};