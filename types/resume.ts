export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
  summary?: string;
  title?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  isCurrentJob?: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  school?: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  graduationDate?: string;
  current: boolean;
  gpa?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
}

export interface Project {
  id: string;
  title: string;
  name?: string;
  description: string;
  technologies: string[];
  link?: string;
  url?: string;
  github?: string;
  startDate?: string;
  endDate?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  dateObtained?: string;
  expiryDate?: string;
  expirationDate?: string;
  credentialId?: string;
  link?: string;
  url?: string;
  description?: string;
}

export interface Language {
  id: string;
  name: string;
  language?: string;
  proficiency: 'basic' | 'conversational' | 'proficient' | 'fluent' | 'native';
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  references?: any[];
  customSections?: CustomSection[];
  selectedTemplate: ResumeTemplate;
}

export type ResumeTemplate = 'modern' | 'classic' | 'minimal' | 'creative' | 'executive' | 'technical';

export interface ResumeState {
  data: ResumeData;
  selectedTemplate: ResumeTemplate;
  isGenerating: boolean;
  lastSaved: Date | null;
}