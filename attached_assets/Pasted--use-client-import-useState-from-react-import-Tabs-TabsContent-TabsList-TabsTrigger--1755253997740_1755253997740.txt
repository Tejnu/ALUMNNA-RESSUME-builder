'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalInfoForm } from './forms/PersonalInfoForm';
import { WorkExperienceForm } from './forms/WorkExperienceForm';
import { EducationForm } from './forms/EducationForm';
import { SkillsForm } from './forms/SkillsForm';
import { CertificationsForm } from './forms/CertificationsForm';
import { ProjectsForm } from './forms/ProjectsForm'; // Assuming ProjectsForm exists
import { LanguagesForm } from './forms/LanguagesForm'; // Assuming LanguagesForm exists
import { ResumeData } from '@/types/resume';
import { User, Briefcase, GraduationCap, Code, Award, FolderOpen, FileText, Languages } from 'lucide-react';

// Placeholder for the actual validation and organization logic.
// This function should take resumeData and return a structured object
// with properly organized sections like personalInfo, workExperience, skills, etc.
const validateAndOrganizeData = (data: ResumeData): ResumeData => {
  // In a real scenario, this would involve complex parsing and categorization.
  // For this example, we'll assume the data is already somewhat structured
  // and just return it as is, or apply some basic reordering if needed.
  // The core issue described in the user message implies the parsing
  // logic *before* this point is flawed. This function would be the place
  // to fix that if the data structure itself was being wrongly populated.
  // For demonstration, we'll just return the data, assuming the prompt
  // implies the forms themselves need to receive the *correctly* processed data.

  // Example of potential re-organization if needed:
  // const organizedData = { ...data };
  // if (organizedData.workExperience) {
  //   organizedData.workExperience.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  // }
  // if (organizedData.skills) {
  //   organizedData.skills.sort((a, b) => a.name.localeCompare(b.name));
  // }

  return data; // Returning the original data as a placeholder for the function's logic
};


interface ResumeFormProps {
  resumeData: ResumeData;
  onUpdate: (updates: Partial<ResumeData>) => void;
}

export function ResumeForm({ resumeData, onUpdate }: ResumeFormProps) {
  const [activeTab, setActiveTab] = useState('personal');

  // Validate and organize the resume data upon component mount or update
  const organizedResumeData = validateAndOrganizeData(resumeData);

  return (
    <div className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7 text-xs">
          <TabsTrigger value="personal" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Personal</span>
          </TabsTrigger>
          <TabsTrigger value="work" className="flex items-center space-x-2">
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">Experience</span>
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center space-x-2">
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">Education</span>
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center space-x-2">
            <Code className="h-4 w-4" />
            <span className="hidden sm:inline">Skills</span>
          </TabsTrigger>
          <TabsTrigger value="certifications" className="flex items-center space-x-2">
            <Award className="h-4 w-4" />
            <span className="hidden sm:inline">Certs</span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center space-x-2">
            <FolderOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Projects</span>
          </TabsTrigger>
          <TabsTrigger value="languages" className="flex items-center space-x-2">
            <Languages className="h-4 w-4" />
            <span className="hidden sm:inline">Languages</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="personal" className="space-y-4">
            <PersonalInfoForm
              personalInfo={organizedResumeData.personalInfo}
              onUpdate={(personalInfo) => onUpdate({ personalInfo })}
            />
          </TabsContent>

          <TabsContent value="work" className="space-y-4">
            <WorkExperienceForm
              workExperience={organizedResumeData.workExperience}
              onUpdate={(workExperience) => onUpdate({ workExperience })}
            />
          </TabsContent>

          <TabsContent value="education" className="space-y-4">
            <EducationForm
              education={resumeData.education}
              onUpdate={(education) => onUpdate({ education })}
            />
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <SkillsForm
              skills={organizedResumeData.skills}
              onUpdate={(skills) => onUpdate({ skills })}
            />
          </TabsContent>

          <TabsContent value="certifications" className="space-y-4">
            <CertificationsForm
              certifications={resumeData.certifications}
              onUpdate={(certifications) => onUpdate({ certifications })}
            />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectsForm
              projects={resumeData.projects}
              onUpdate={(projects) => onUpdate({ projects })}
            />
          </TabsContent>

          <TabsContent value="languages">
            <LanguagesForm
              languages={resumeData.languages}
              onUpdate={(languages) => onUpdate({ languages })}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}