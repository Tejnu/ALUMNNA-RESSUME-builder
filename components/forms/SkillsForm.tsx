'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skill } from '@/types/resume';
import { Plus, X, Code } from 'lucide-react';
import { SmartSuggestions } from '@/components/SmartSuggestions';

interface SkillsFormProps {
  skills: Skill[];
  onUpdate: (skills: Skill[]) => void;
}

export function SkillsForm({ skills, onUpdate }: SkillsFormProps) {
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<Skill['level']>('Intermediate');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const addSkill = () => {
    if (!newSkillName.trim()) return;

    const newSkill: Skill = {
      id: Date.now().toString(),
      name: newSkillName.trim(),
      level: newSkillLevel,
    };

    onUpdate([...skills, newSkill]);
    setNewSkillName('');
    setNewSkillLevel('Intermediate');
  };

  const removeSkill = (id: string) => {
    onUpdate(skills.filter(skill => skill.id !== id));
  };

  const updateSkill = (id: string, updates: Partial<Skill>) => {
    onUpdate(skills.map(skill => 
      skill.id === id ? { ...skill, ...updates } : skill
    ));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSkillInputFocus = () => {
    setShowSuggestions(true);
  };

  const applySkillSuggestion = (suggestion: string) => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: suggestion,
      level: 'Intermediate',
    };
    onUpdate([...skills, newSkill]);
    setShowSuggestions(false);
  };

  const getLevelColor = (level: Skill['level']) => {
    switch (level) {
      case 'Beginner': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Intermediate': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Advanced': return 'bg-green-100 text-green-800 border-green-200';
      case 'Expert': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Skills & Technologies</h3>
        <p className="text-sm text-gray-600">Add your technical and professional skills</p>
      </div>

      <Card className="border border-gray-200 bg-white shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-gray-900 flex items-center space-x-2">
            <Code className="h-5 w-5 text-purple-600" />
            <span>Add New Skill</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={handleSkillInputFocus}
                placeholder="Enter a skill (e.g., JavaScript, Project Management)"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
              {showSuggestions && (
                <SmartSuggestions
                  context="skills"
                  currentValue={skills.map(s => s.name).join(', ')}
                  onApplySuggestion={applySkillSuggestion}
                  type="skills"
                />
              )}
            </div>
            <div className="w-40">
              <Select value={newSkillLevel} onValueChange={(value: Skill['level']) => setNewSkillLevel(value)}>
                <SelectTrigger className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={addSkill} 
              disabled={!newSkillName.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {skills.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-200 bg-gray-50/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Code className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">No skills added yet</p>
            <p className="text-sm text-gray-400">Add your first skill using the form above</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900 flex items-center space-x-2">
              <Target className="h-5 w-5 text-purple-600" />
              <span>Your Skills ({skills.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-900">{skill.name}</span>
                    <Badge variant="outline" className={getLevelColor(skill.level)}>
                      {skill.level}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select
                      value={skill.level}
                      onValueChange={(value: Skill['level']) => updateSkill(skill.id, { level: value })}
                    >
                      <SelectTrigger className="w-32 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSkill(skill.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}