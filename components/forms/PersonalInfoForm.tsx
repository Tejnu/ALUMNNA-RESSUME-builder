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
    const currentSummary = personalInfo.summary;
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
      <div>
        <Label htmlFor="fullName">Full Name *</Label>
        <Input
          id="fullName"
          value={personalInfo.fullName}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
          placeholder="John Doe"
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={personalInfo.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="john.doe@email.com"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={personalInfo.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={personalInfo.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          placeholder="New York, NY"
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            value={personalInfo.linkedin}
            onChange={(e) => handleInputChange('linkedin', e.target.value)}
            placeholder="https://linkedin.com/in/johndoe"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={personalInfo.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            placeholder="https://johndoe.com"
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="summary">Professional Summary</Label>
        <Textarea
          id="summary"
          value={personalInfo.summary}
          onChange={(e) => handleInputChange('summary', e.target.value)}
          onFocus={handleSummaryFocus}
          placeholder="Brief professional summary highlighting your key achievements and skills..."
          rows={4}
          className="mt-1"
        />
        {showSuggestions && (
          <SmartSuggestions
            context="summary"
            currentValue={personalInfo.summary}
            onApplySuggestion={applySuggestionToSummary}
            type="summary"
          />
        )}
      </div>
    </div>
  );
}