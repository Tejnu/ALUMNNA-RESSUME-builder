'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WorkExperience } from '@/types/resume';
import { Plus, Trash2, Briefcase } from 'lucide-react';

interface WorkExperienceFormProps {
  workExperience: WorkExperience[];
  onUpdate: (workExperience: WorkExperience[]) => void;
}

export function WorkExperienceForm({ workExperience, onUpdate }: WorkExperienceFormProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const addWorkExperience = () => {
    const newExperience: WorkExperience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      isCurrentJob: false,
      description: '',
    };
    onUpdate([...workExperience, newExperience]);
    setExpandedItems([...expandedItems, newExperience.id]);
  };

  const removeWorkExperience = (id: string) => {
    onUpdate(workExperience.filter(exp => exp.id !== id));
    setExpandedItems(expandedItems.filter(itemId => itemId !== id));
  };

  const updateWorkExperience = (id: string, updates: Partial<WorkExperience>) => {
    onUpdate(workExperience.map(exp => 
      exp.id === id ? { ...exp, ...updates } : exp
    ));
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Work Experience</h3>
        <p className="text-sm text-gray-600">Add your professional work history and achievements</p>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Briefcase className="h-5 w-5 text-purple-600" />
          <span className="font-medium text-gray-700">Experience Entries ({workExperience.length})</span>
        </div>
        <Button 
          onClick={addWorkExperience} 
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg px-4 py-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {workExperience.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-200 bg-gray-50/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">No work experience added yet</p>
            <Button 
              onClick={addWorkExperience} 
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Job
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {workExperience.map((exp) => (
            <Card key={exp.id} className="transition-all duration-200 border border-gray-200 hover:border-purple-300 hover:shadow-md bg-white">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {exp.position || 'New Position'} {exp.company && `at ${exp.company}`}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(exp.id)}
                      className="text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
                    >
                      {expandedItems.includes(exp.id) ? 'Collapse' : 'Expand'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeWorkExperience(exp.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedItems.includes(exp.id) && (
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`company-${exp.id}`} className="text-sm font-medium text-gray-700 mb-2 block">Company *</Label>
                      <Input
                        id={`company-${exp.id}`}
                        value={exp.company}
                        onChange={(e) => updateWorkExperience(exp.id, { company: e.target.value })}
                        placeholder="Company Name"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`position-${exp.id}`} className="text-sm font-medium text-gray-700 mb-2 block">Position *</Label>
                      <Input
                        id={`position-${exp.id}`}
                        value={exp.position}
                        onChange={(e) => updateWorkExperience(exp.id, { position: e.target.value })}
                        placeholder="Job Title"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`startDate-${exp.id}`} className="text-sm font-medium text-gray-700 mb-2 block">Start Date</Label>
                      <Input
                        id={`startDate-${exp.id}`}
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => updateWorkExperience(exp.id, { startDate: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`endDate-${exp.id}`} className="text-sm font-medium text-gray-700 mb-2 block">End Date</Label>
                      <Input
                        id={`endDate-${exp.id}`}
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => updateWorkExperience(exp.id, { endDate: e.target.value })}
                        disabled={exp.isCurrentJob}
                        placeholder={exp.isCurrentJob ? 'Present' : ''}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                    <Checkbox
                      id={`current-${exp.id}`}
                      checked={exp.isCurrentJob}
                      onCheckedChange={(checked) => 
                        updateWorkExperience(exp.id, { 
                          isCurrentJob: !!checked,
                          endDate: checked ? '' : exp.endDate
                        })
                      }
                    />
                    <Label htmlFor={`current-${exp.id}`} className="text-sm font-medium text-gray-700 cursor-pointer">
                      I currently work here
                    </Label>
                  </div>

                  <div>
                    <Label htmlFor={`description-${exp.id}`} className="text-sm font-medium text-gray-700 mb-2 block">Job Description</Label>
                    <Textarea
                      id={`description-${exp.id}`}
                      value={exp.description}
                      onChange={(e) => updateWorkExperience(exp.id, { description: e.target.value })}
                      placeholder="Describe your responsibilities and achievements..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}