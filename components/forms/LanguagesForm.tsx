
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
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Languages</h3>
        <p className="text-sm text-gray-600">Add languages you speak and your proficiency levels</p>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Languages className="h-5 w-5 text-purple-600" />
          <span className="font-medium text-gray-700">Languages ({languages.length})</span>
        </div>
        <Button 
          onClick={addLanguage} 
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg px-4 py-2"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Language
        </Button>
      </div>

      {languages.map((language, index) => (
        <Card key={language.id} className="relative border border-gray-200 hover:border-purple-300 hover:shadow-md bg-white transition-all duration-200">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base font-semibold text-gray-900">
                {language.name || `Language #${index + 1}`}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeLanguage(language.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <Input
                  value={language.name}
                  onChange={(e) => updateLanguage(language.id, 'name', e.target.value)}
                  placeholder="e.g., Spanish, French, Mandarin"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Proficiency Level</label>
                <Select
                  value={language.proficiency}
                  onValueChange={(value) => updateLanguage(language.id, 'proficiency', value)}
                >
                  <SelectTrigger className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200">
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
        <Card className="border-dashed border-2 border-gray-200 bg-gray-50/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Languages className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">No languages added yet</p>
            <Button 
              onClick={addLanguage} 
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg"
            >
            <Plus className="h-4 w-4 mr-1" />
              Add Your First Language
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
