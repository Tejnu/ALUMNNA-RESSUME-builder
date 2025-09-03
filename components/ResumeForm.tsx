
'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalInfoForm } from './forms/PersonalInfoForm';
import { WorkExperienceForm } from './forms/WorkExperienceForm';
import { EducationForm } from './forms/EducationForm';
import { SkillsForm } from './forms/SkillsForm';
import { CertificationsForm } from './forms/CertificationsForm';
import { ProjectsForm } from './forms/ProjectsForm';
import { LanguagesForm } from './forms/LanguagesForm';
import { ResumeData } from '@/types/resume';
import { User, Briefcase, GraduationCap, Code, Award, FolderOpen, Globe as Languages } from 'lucide-react';

// Smart validation and organization logic for resume data
const validateAndOrganizeData = (data: ResumeData): ResumeData => {
  const organized = { ...data };

  // Sort work experience by date (most recent first)
  if (organized.workExperience && organized.workExperience.length > 0) {
    organized.workExperience.sort((a, b) => {
      const dateA = new Date(a.startDate || '2000-01-01');
      const dateB = new Date(b.startDate || '2000-01-01');
      return dateB.getTime() - dateA.getTime();
    });
  }

  // Sort education by graduation date (most recent first)
  if (organized.education && organized.education.length > 0) {
    organized.education.sort((a, b) => {
      const dateA = new Date(a.graduationDate || '2000-01-01');
      const dateB = new Date(b.graduationDate || '2000-01-01');
      return dateB.getTime() - dateA.getTime();
    });
  }

  // Organize skills by removing duplicates and sorting alphabetically
  if (organized.skills && organized.skills.length > 0) {
    const uniqueSkills = organized.skills.filter((skill, index, self) => 
      index === self.findIndex(s => s.name.toLowerCase() === skill.name.toLowerCase())
    );
    organized.skills = uniqueSkills.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Ensure personal info has proper formatting
  if (organized.personalInfo) {
    const info = organized.personalInfo;
    
    // Format phone number
    if (info.phone) {
      info.phone = info.phone.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
    
    // Ensure proper capitalization for name
    if (info.fullName) {
      info.fullName = info.fullName.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
    }
    
    // Clean up LinkedIn URL
    if (info.linkedin && !info.linkedin.startsWith('http')) {
      if (info.linkedin.includes('linkedin.com')) {
        info.linkedin = `https://${info.linkedin}`;
      } else {
        info.linkedin = `https://linkedin.com/in/${info.linkedin}`;
      }
    }
  }

  return organized;
};

interface ResumeFormProps {
  resumeData: ResumeData;
  onUpdate: (updates: Partial<ResumeData>) => void;
}

export function ResumeForm({ resumeData, onUpdate }: ResumeFormProps) {
  const [activeTab, setActiveTab] = useState('personal');

  // Validate and organize the resume data
  const organizedResumeData = validateAndOrganizeData(resumeData);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Resume Builder</h2>
        <p className="text-gray-600">Build and customize your professional resume</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          <TabsTrigger 
            value="personal" 
            className="flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-50"
          >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Personal</span>
            </TabsTrigger>
            <TabsTrigger 
              value="work" 
              className="flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-50"
            >
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Experience</span>
            </TabsTrigger>
            <TabsTrigger 
              value="education" 
              className="flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-50"
            >
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Education</span>
            </TabsTrigger>
            <TabsTrigger 
              value="skills" 
              className="flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-50"
            >
              <Code className="h-4 w-4" />
              <span className="hidden sm:inline">Skills</span>
            </TabsTrigger>
            <TabsTrigger 
              value="certifications" 
              className="flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-50"
            >
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">Certs</span>
            </TabsTrigger>
            <TabsTrigger 
              value="projects" 
              className="flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-50"
            >
              <FolderOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Projects</span>
            </TabsTrigger>
            <TabsTrigger 
              value="languages" 
              className="flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-50"
            >
              <Languages className="h-4 w-4" />
              <span className="hidden sm:inline">Languages</span>
            </TabsTrigger>
          </TabsList>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <TabsContent value="personal" className="space-y-6 mt-0">
              <PersonalInfoForm
                personalInfo={organizedResumeData.personalInfo}
                onUpdate={(personalInfo) => onUpdate({ personalInfo })}
              />
            </TabsContent>

            <TabsContent value="work" className="space-y-6 mt-0">
              <WorkExperienceForm
                workExperience={organizedResumeData.workExperience}
                onUpdate={(workExperience) => onUpdate({ workExperience })}
              />
            </TabsContent>

            <TabsContent value="education" className="space-y-6 mt-0">
              <EducationForm
                education={organizedResumeData.education}
                onUpdate={(education) => onUpdate({ education })}
              />
            </TabsContent>

            <TabsContent value="skills" className="space-y-6 mt-0">
              <SkillsForm
                skills={organizedResumeData.skills}
                onUpdate={(skills) => onUpdate({ skills })}
              />
            </TabsContent>

            <TabsContent value="certifications" className="space-y-6 mt-0">
              <CertificationsForm
                certifications={organizedResumeData.certifications}
                onUpdate={(certifications) => onUpdate({ certifications })}
              />
            </TabsContent>

            <TabsContent value="projects" className="mt-0">
              <ProjectsForm
                projects={organizedResumeData.projects}
                onUpdate={(projects) => onUpdate({ projects })}
              />
            </TabsContent>

            <TabsContent value="languages" className="mt-0">
              <LanguagesForm
                languages={organizedResumeData.languages}
                onUpdate={(languages) => onUpdate({ languages })}
              />
            </TabsContent>
          </div>
        </Tabs>
    </div>
  );
}
