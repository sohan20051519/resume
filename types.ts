
import type React from 'react';

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  portfolio: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate:string;
  gpa: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Technical' | 'Soft';
}

export interface ResumeData {
  personal: PersonalInfo;
  summary: string;
  education: Education[];
  experience: WorkExperience[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
}

export type SectionName = keyof Omit<ResumeData, 'personal'>;

export interface Template {
    id: string;
    name: string;
    component: React.FC<{ data: ResumeData }>;
}

export enum AITone {
    Formal = 'Formal',
    Concise = 'Concise',
    Creative = 'Creative'
}
