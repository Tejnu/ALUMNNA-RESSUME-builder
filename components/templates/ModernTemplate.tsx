'use client';

import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Languages } from 'lucide-react';

interface ModernTemplateProps {
  resumeData: ResumeData;
}

export function ModernTemplate({ resumeData }: ModernTemplateProps) {
  const { personalInfo, workExperience, education, skills, certifications, projects, languages = [] } = resumeData;

  return (
    <div className="w-full mx-auto bg-white overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 text-white p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="relative flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2">{personalInfo?.fullName || ''}</h1>
            <p className="text-xl opacity-90">{workExperience?.[0]?.position || ''}</p>
          </div>
          <div className="mt-4 md:mt-0 space-y-2 text-sm">
            {personalInfo?.email && (
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo?.phone && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo?.location && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo?.website && (
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                <span>{personalInfo.website}</span>
              </div>
            )}
            {personalInfo?.linkedin && (
              <div className="flex items-center">
                <Linkedin className="h-4 w-4 mr-2" />
                <span>{personalInfo.linkedin}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Summary */}
        {personalInfo?.summary && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gradient-to-r from-purple-600 to-pink-500 pb-2 relative">
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Professional Summary</span>
            </h2>
            <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </section>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Work Experience */}
            {workExperience && workExperience.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gradient-to-r from-purple-600 to-pink-500 pb-2 relative">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Work Experience</span>
                </h2>
                <div className="space-y-6">
                  {workExperience.map((job, index) => (
                    <div key={job.id} className="relative pl-8 border-l-2 border-gradient-to-b from-purple-300 to-pink-300 transition-all duration-300 hover:border-purple-500 hover:pl-10">
                      <div className="absolute w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full -left-2 top-0 shadow-lg animate-pulse" style={{ animationDelay: `${index * 100}ms` }}></div>
                      <div className="mb-2">
                        <h3 className="text-xl font-semibold text-gray-800">{job.position}</h3>
                        <p className="text-lg bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent font-medium">{job.company}</p>
                        <p className="text-sm text-gray-600">
                          {job.startDate} - {job.isCurrentJob ? 'Present' : job.endDate}
                        </p>
                      </div>
                      {job.description && (
                        <p className="text-gray-700 leading-relaxed">{job.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {projects && projects.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gradient-to-r from-purple-600 to-pink-500 pb-2 relative">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Projects</span>
                </h2>
                <div className="space-y-4">
                  {projects.map((project, index) => (
                    <div key={project.id} className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100 transition-all duration-300 hover:shadow-md hover:scale-[1.02]" style={{ animationDelay: `${index * 50}ms` }}>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.title || project.name}</h3>
                      {project.description && (
                        <p className="text-gray-700 mb-3">{project.description}</p>
                      )}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {project.technologies.map((tech, techIndex) => (
                            <span key={techIndex} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      {(project.url || project.link || project.github) && (
                        <div className="flex gap-2 text-sm">
                          {(project.url || project.link) && (
                            <a href={project.url || project.link} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800">
                              View Project
                            </a>
                          )}
                          {project.github && (
                            <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800">
                              GitHub
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skills */}
            {skills && skills.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-300 pb-2">Skills</h2>
                <div className="space-y-2">
                  {skills.map((skill, index) => (
                    <div key={skill.id} className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-4 py-2 rounded-full text-sm inline-block mr-2 mb-2 border border-purple-200 transition-all duration-300 hover:shadow-md hover:scale-105" style={{ animationDelay: `${index * 30}ms` }}>
                      {skill.name}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {education && education.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-300 pb-2">Education</h2>
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <h3 className="font-semibold text-gray-800">{edu.degree}</h3>
                      <p className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent font-medium">{edu.school}</p>
                      {edu.field && <p className="text-sm text-gray-600">{edu.field}</p>}
                      {edu.graduationDate && <p className="text-sm text-gray-600">{edu.graduationDate}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-300 pb-2">Certifications</h2>
                <div className="space-y-2">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="text-sm">
                      <p className="font-semibold text-gray-800">{cert.name}</p>
                      {cert.description && <p className="text-gray-600">{cert.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {languages && languages.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-300 pb-2">
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4" />
                    <span>Languages</span>
                  </div>
                </h2>
                <div className="space-y-2">
                  {languages.map((lang) => (
                    <div key={lang.id} className="flex justify-between items-center">
                      <span className="text-gray-900">{lang.name}</span>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {lang.proficiency}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}