
'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Language } from '@/types/resume';

interface LanguagesFormProps {
  languages: Language[];
  onUpdate: (languages: Language[]) => void;
}

export function LanguagesForm({ languages, onUpdate }: LanguagesFormProps) {
  const addLanguage = () => {
    const newLanguage: Language = {
      id: Date.now().toString(),
      name: '',
      proficiency: 'Intermediate'
    };
    onUpdate([...languages, newLanguage]);
  };

  const updateLanguage = (id: string, field: keyof Language, value: string) => {
    onUpdate(
      languages.map(language =>
        language.id === id ? { ...language, [field]: value } : language
      )
    );
  };

  const removeLanguage = (id: string) => {
    onUpdate(languages.filter(language => language.id !== id));
  };

  const proficiencyLevels = [
    'Native',
    'Fluent',
    'Advanced',
    'Intermediate',
    'Beginner'
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Languages</h3>
        <Button onClick={addLanguage} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Language
        </Button>
      </div>

      {languages.map((language, index) => (
        <Card key={language.id} className="relative">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base">Language #{index + 1}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeLanguage(language.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Language</label>
                <Input
                  value={language.name}
                  onChange={(e) => updateLanguage(language.id, 'name', e.target.value)}
                  placeholder="e.g., Spanish, French, Mandarin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Proficiency Level</label>
                <Select
                  value={language.proficiency}
                  onValueChange={(value) => updateLanguage(language.id, 'proficiency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select proficiency" />
                  </SelectTrigger>
                  <SelectContent>
                    {proficiencyLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {languages.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No languages added yet.</p>
          <Button onClick={addLanguage} className="mt-2">
            <Plus className="h-4 w-4 mr-1" />
            Add Your First Language
          </Button>
        </div>
      )}
    </div>
  );
}
