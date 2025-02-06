export interface User {
  id: string;
  email: string;
  fullName: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  creatorId: string;
  name: string;
  description?: string;
  status: 'pre_launch' | 'launched';
  expectedLaunchDate?: Date;
  actualLaunchDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  template?: string;
  isStarred?: boolean;
  archived?: boolean;
}

export interface ProjectMember {
  projectId: string;
  userId: string;
  role: 'owner' | 'member';
  email: string;
  fullName: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  type: 'general' | 'future' | 'bug';
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  duration?: string;
  deadline?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  dueDate?: Date;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Note {
  id: string;
  projectId: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectLink {
  id: string;
  projectId: string;
  name: string;
  url: string;
  type: 'production' | 'staging' | 'development' | 'repository' | 'other';
  createdAt: Date;
}

export interface Secret {
  id: string;
  projectId: string;
  name: string;
  value: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  id: string;
  userId: string;
  theme: 'light' | 'dark';
  emailNotifications: boolean;
  updatedAt: Date;
}

export interface ProjectReview {
  id: string;
  projectId: string;
  userId: string;
  rating: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}