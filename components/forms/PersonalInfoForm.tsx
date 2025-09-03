'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SmartSuggestions } from '@/components/SmartSuggestions';
import { PersonalInfo } from '@/types/resume';
import { useState } from 'react';

interface PersonalInfoFormProps {
  personalInfo: PersonalInfo;
  onUpdate: (personalInfo: PersonalInfo) => void;
}

export function PersonalInfoForm({ personalInfo, onUpdate }: PersonalInfoFormProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (field: keyof PersonalInfo, value: string) => {
    onUpdate({
      ...personalInfo,
      [field]: value,
    });
  };

  const handleSummaryFocus = () => {
    setShowSuggestions(true);
  };

  const applySuggestionToSummary = (suggestion: string) => {
    const currentSummary = personalInfo.summary || '';
    let newSummary = currentSummary;
    
    if (suggestion.includes('Add specific years')) {
      newSummary = currentSummary.replace(/experienced/i, 'Experienced (5+ years)');
    } else if (suggestion.includes('key technologies')) {
      newSummary += newSummary.endsWith('.') ? '' : '.';
      newSummary += ' Specialized in React, Node.js, and cloud technologies.';
    } else {
      newSummary += ' ' + suggestion;
    }
    
    handleInputChange('summary', newSummary);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Information</h3>
        <p className="text-sm text-gray-600">Enter your basic contact information and professional summary</p>
      </div>
      
      <div>
        <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 mb-2 block">Full Name *</Label>
        <Input
          id="fullName"
          value={personalInfo.fullName}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
          placeholder="John Doe"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">Email *</Label>
          <Input
            id="email"
            type="email"
            value={personalInfo.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="john.doe@email.com"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div>
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">Phone</Label>
          <Input
            id="phone"
            value={personalInfo.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="location" className="text-sm font-medium text-gray-700 mb-2 block">Location</Label>
        <Input
          id="location"
          value={personalInfo.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          placeholder="New York, NY"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="linkedin" className="text-sm font-medium text-gray-700 mb-2 block">LinkedIn</Label>
          <Input
            id="linkedin"
            value={personalInfo.linkedin}
            onChange={(e) => handleInputChange('linkedin', e.target.value)}
            placeholder="https://linkedin.com/in/johndoe"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div>
          <Label htmlFor="website" className="text-sm font-medium text-gray-700 mb-2 block">Website</Label>
          <Input
            id="website"
            value={personalInfo.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            placeholder="https://johndoe.com"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="summary" className="text-sm font-medium text-gray-700 mb-2 block">Professional Summary</Label>
        <Textarea
          id="summary"
          value={personalInfo.summary}
          onChange={(e) => handleInputChange('summary', e.target.value)}
          onFocus={handleSummaryFocus}
          placeholder="Brief professional summary highlighting your key achievements and skills..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
        />
        {showSuggestions && (
          <SmartSuggestions
            context="summary"
            currentValue={personalInfo.summary || ''}
            onApplySuggestion={applySuggestionToSummary}
            type="summary"
          />
        )}
      </div>
    </div>
  )
}