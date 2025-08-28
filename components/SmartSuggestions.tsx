'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Plus, X } from 'lucide-react';

interface SmartSuggestionsProps {
  context: string;
  currentValue: string;
  onApplySuggestion: (suggestion: string) => void;
  type: 'skills' | 'summary' | 'description';
}

export function SmartSuggestions({ context, currentValue, onApplySuggestion, type }: SmartSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (currentValue.length > 10) {
      generateSuggestions();
    }
  }, [currentValue, context]);

  const generateSuggestions = () => {
    let newSuggestions: string[] = [];

    switch (type) {
      case 'skills':
        newSuggestions = [
          'TypeScript', 'React Native', 'GraphQL', 'Kubernetes', 'MongoDB',
          'Redis', 'Elasticsearch', 'Jenkins', 'Terraform', 'Microservices'
        ].filter(skill => 
          !currentValue.toLowerCase().includes(skill.toLowerCase())
        ).slice(0, 5);
        break;

      case 'summary':
        newSuggestions = [
          'Add specific years of experience',
          'Include key technologies you specialize in',
          'Mention leadership or team management experience',
          'Highlight major achievements or metrics',
          'Include industry certifications'
        ];
        break;

      case 'description':
        newSuggestions = [
          'Led cross-functional team of X members',
          'Improved system performance by X%',
          'Reduced processing time by X minutes',
          'Implemented automated testing reducing bugs by X%',
          'Collaborated with stakeholders to define requirements'
        ];
        break;
    }

    setSuggestions(newSuggestions);
    setIsVisible(newSuggestions.length > 0);
  };

  if (!isVisible || suggestions.length === 0) return null;

  return (
    <Card className="mt-2 border-yellow-200 bg-yellow-50">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Lightbulb className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">Smart Suggestions</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6 p-0 text-yellow-600 hover:text-yellow-800"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>

        <div className="space-y-2">
          {type === 'skills' ? (
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-yellow-100 border-yellow-300 text-yellow-800"
                  onClick={() => onApplySuggestion(suggestion)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {suggestion}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="text-xs text-yellow-700 cursor-pointer hover:text-yellow-900 p-1 rounded hover:bg-yellow-100"
                  onClick={() => onApplySuggestion(suggestion)}
                >
                  • {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}