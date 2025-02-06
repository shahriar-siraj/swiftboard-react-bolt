import { Timestamp } from "firebase/firestore";

export interface User {
  id: string;
  email: string;
  fullName: string;
  timezone: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export interface Project {
  id: string;
  creatorId: string;
  name: string;
  description?: string;
  status: 'pre_launch' | 'launched';
  expectedLaunchDate?: Timestamp | null;
  actualLaunchDate?: Timestamp | null;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
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
  createdAt: Timestamp | null;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  type: 'general' | 'feature' | 'improvement' | 'bug';
  // type: 'general' | 'future' | 'bug';
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  duration?: string;
  deadline?: Timestamp | null;
  createdBy: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  dueDate?: Timestamp | null;
  completed: boolean;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export interface Note {
  id: string;
  projectId: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export interface ProjectLink {
  id: string;
  projectId: string;
  name: string;
  url: string;
  type: 'production' | 'staging' | 'development' | 'repository' | 'other';
  createdAt: Timestamp | null;
}

export interface Secret {
  id: string;
  projectId: string;
  name: string;
  value: string;
  createdBy: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export interface UserSettings {
  id: string;
  userId: string;
  theme: 'light' | 'dark';
  emailNotifications: boolean;
  updatedAt: Timestamp | null;
}

export interface ProjectReview {
  id: string;
  projectId: string;
  userId: string;
  rating: number;
  content: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}
