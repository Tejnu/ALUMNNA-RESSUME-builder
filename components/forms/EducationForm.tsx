'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Education } from '@/types/resume';
import { Plus, Trash2, GraduationCap } from 'lucide-react';

interface EducationFormProps {
  education: Education[];
  onUpdate: (education: Education[]) => void;
}

export function EducationForm({ education, onUpdate }: EducationFormProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      school: '',
      degree: '',
      field: '',
      graduationDate: '',
      gpa: '',
    };
    onUpdate([...education, newEducation]);
    setExpandedItems([...expandedItems, newEducation.id]);
  };

  const removeEducation = (id: string) => {
    onUpdate(education.filter(edu => edu.id !== id));
    setExpandedItems(expandedItems.filter(itemId => itemId !== id));
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    onUpdate(education.map(edu => 
      edu.id === id ? { ...edu, ...updates } : edu
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Education</h3>
        <p className="text-sm text-gray-600">Add your educational background and qualifications</p>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-5 w-5 text-purple-600" />
          <span className="font-medium text-gray-700">Education Entries ({education.length})</span>
        </div>
        <Button 
          onClick={addEducation} 
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg px-4 py-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>

      {education.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-200 bg-gray-50/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GraduationCap className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">No education added yet</p>
            <Button 
              onClick={addEducation} 
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your Education
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {education.map((edu) => (
            <Card key={edu.id} className="transition-all duration-200 border border-gray-200 hover:border-purple-300 hover:shadow-md bg-white">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {edu.degree || 'New Degree'} {edu.school && `at ${edu.school}`}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(edu.id)}
                      className="text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
                    >
                      {expandedItems.includes(edu.id) ? 'Collapse' : 'Expand'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEducation(edu.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedItems.includes(edu.id) && (
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor={`school-${edu.id}`}>School/University *</Label>
                    <Input
                      id={`school-${edu.id}`}
                      value={edu.school}
                      onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
                      placeholder="University Name"
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`degree-${edu.id}`}>Degree *</Label>
                      <Input
                        id={`degree-${edu.id}`}
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                        placeholder="Bachelor of Science"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`field-${edu.id}`}>Field of Study</Label>
                      <Input
                        id={`field-${edu.id}`}
                        value={edu.field}
                        onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                        placeholder="Computer Science"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`graduationDate-${edu.id}`}>Graduation Date</Label>
                      <Input
                        id={`graduationDate-${edu.id}`}
                        type="month"
                        value={edu.graduationDate}
                        onChange={(e) => updateEducation(edu.id, { graduationDate: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`gpa-${edu.id}`}>GPA (Optional)</Label>
                      <Input
                        id={`gpa-${edu.id}`}
                        value={edu.gpa}
                        onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                        placeholder="3.8/4.0"
                        className="mt-1"
                      />
                    </div>
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