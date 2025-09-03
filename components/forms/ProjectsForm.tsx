
'use client';

import { Plus, Trash2, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/types/resume';

interface ProjectsFormProps {
  projects: Project[];
  onUpdate: (projects: Project[]) => void;
}

export function ProjectsForm({ projects, onUpdate }: ProjectsFormProps) {
  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: '',
      description: '',
      technologies: [],
      startDate: '',
      endDate: '',
      url: ''
    };
    onUpdate([...projects, newProject]);
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    onUpdate(
      projects.map(project => {
        if (project.id === id) {
          if (field === 'technologies') {
            // Convert comma-separated string to array
            const techArray = value.split(',').map(tech => tech.trim()).filter(tech => tech.length > 0);
            return { ...project, [field]: techArray };
          }
          return { ...project, [field]: value };
        }
        return project;
      })
    );
  };

  const removeProject = (id: string) => {
    onUpdate(projects.filter(project => project.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Projects</h3>
        <p className="text-sm text-gray-600">Showcase your key projects and achievements</p>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FolderOpen className="h-5 w-5 text-purple-600" />
          <span className="font-medium text-gray-700">Projects ({projects.length})</span>
        </div>
        <Button 
          onClick={addProject} 
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg px-4 py-2"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Project
        </Button>
      </div>

      {projects.map((project, index) => (
        <Card key={project.id} className="relative border border-gray-200 hover:border-purple-300 hover:shadow-md bg-white transition-all duration-200">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base font-semibold text-gray-900">
                {project.title || `Project #${index + 1}`}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeProject(project.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                <Input
                  value={project.title}
                  onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                  placeholder="e.g., E-commerce Platform"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project URL</label>
                <Input
                  value={project.url || ''}
                  onChange={(e) => updateProject(project.id, 'url', e.target.value)}
                  placeholder="https://github.com/yourproject"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <Input
                  type="month"
                  value={project.startDate}
                  onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <Input
                  type="month"
                  value={project.endDate}
                  onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Technologies Used</label>
              <Input
                value={Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies || ''}
                onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                placeholder="React, Node.js, MongoDB, AWS"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <Textarea
                value={project.description}
                onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                placeholder="Describe the project, your role, and key achievements..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {projects.length === 0 && (
        <Card className="border-dashed border-2 border-gray-200 bg-gray-50/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">No projects added yet</p>
            <Button 
              onClick={addProject} 
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg"
            >
            <Plus className="h-4 w-4 mr-1" />
              Add Your First Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
