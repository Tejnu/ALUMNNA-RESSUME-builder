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
      <h3 className="text-lg font-medium">Skills</h3>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Add New Skill</CardTitle>
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
                <SelectTrigger>
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
            <Button onClick={addSkill} disabled={!newSkillName.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {skills.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Code className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">No skills added yet</p>
            <p className="text-sm text-gray-400">Add your first skill using the form above</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Skills ({skills.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">{skill.name}</span>
                    <Badge variant="outline" className={getLevelColor(skill.level)}>
                      {skill.level}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select
                      value={skill.level}
                      onValueChange={(value: Skill['level']) => updateSkill(skill.id, { level: value })}
                    >
                      <SelectTrigger className="w-32">
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
                      className="text-red-600 hover:text-red-700"
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