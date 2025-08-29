
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalInfoForm } from './forms/PersonalInfoForm';
import { WorkExperienceForm } from './forms/WorkExperienceForm';
import { EducationForm } from './forms/EducationForm';
import { SkillsForm } from './forms/SkillsForm';
import { CertificationsForm } from './forms/CertificationsForm';
import { ProjectsForm } from './forms/ProjectsForm';
import { LanguagesForm } from './forms/LanguagesForm';
import { ResumeData } from '@/types/resume';
import { User, Briefcase, GraduationCap, Code, Award, FolderOpen, Languages } from 'lucide-react';

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
    <Card className="card-modern">
      <CardHeader>
        <CardTitle className="text-xl font-semibold gradient-text">Edit Resume</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-7 gap-1 p-1 bg-gradient-to-r from-purple-50 to-pink-50 border border-border-color rounded-xl">
            <TabsTrigger value="personal" className="tab-trigger flex items-center justify-center space-x-1 min-h-[3rem]">
              <User className="h-4 w-4" />
              <span className="hidden md:inline text-sm">Personal</span>
            </TabsTrigger>
            <TabsTrigger value="work" className="tab-trigger flex items-center justify-center space-x-1 min-h-[3rem]">
              <Briefcase className="h-4 w-4" />
              <span className="hidden md:inline text-sm">Experience</span>
            </TabsTrigger>
            <TabsTrigger value="education" className="tab-trigger flex items-center justify-center space-x-1 min-h-[3rem]">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden md:inline text-sm">Education</span>
            </TabsTrigger>
            <TabsTrigger value="skills" className="tab-trigger flex items-center justify-center space-x-1 min-h-[3rem]">
              <Code className="h-4 w-4" />
              <span className="hidden md:inline text-sm">Skills</span>
            </TabsTrigger>
            <TabsTrigger value="certifications" className="tab-trigger flex items-center justify-center space-x-1 min-h-[3rem]">
              <Award className="h-4 w-4" />
              <span className="hidden lg:inline text-sm">Certs</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="tab-trigger flex items-center justify-center space-x-1 min-h-[3rem]">
              <FolderOpen className="h-4 w-4" />
              <span className="hidden lg:inline text-sm">Projects</span>
            </TabsTrigger>
            <TabsTrigger value="languages" className="tab-trigger flex items-center justify-center space-x-1 min-h-[3rem]">
              <Languages className="h-4 w-4" />
              <span className="hidden lg:inline text-sm">Languages</span>
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
                education={organizedResumeData.education}
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
                certifications={organizedResumeData.certifications}
                onUpdate={(certifications) => onUpdate({ certifications })}
              />
            </TabsContent>

            <TabsContent value="projects">
              <ProjectsForm
                projects={organizedResumeData.projects}
                onUpdate={(projects) => onUpdate({ projects })}
              />
            </TabsContent>

            <TabsContent value="languages">
              <LanguagesForm
                languages={organizedResumeData.languages}
                onUpdate={(languages) => onUpdate({ languages })}
              />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
