'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ArrowRight, ArrowLeft, Target, User, Briefcase, GraduationCap, Award } from 'lucide-react';

interface GuidedWizardProps {
  onComplete: (data: any) => void;
  onSkip: () => void;
}

const wizardSteps = [
  {
    id: 'goal',
    title: 'What\'s your goal?',
    description: 'Tell us what you\'re looking for',
    icon: Target,
    options: [
      { id: 'new-job', label: 'Find a new job', description: 'Looking for new opportunities' },
      { id: 'career-change', label: 'Change careers', description: 'Switching to a new field' },
      { id: 'promotion', label: 'Get promoted', description: 'Advance in current role' },
      { id: 'freelance', label: 'Start freelancing', description: 'Work independently' }
    ]
  },
  {
    id: 'experience',
    title: 'Experience Level',
    description: 'How much work experience do you have?',
    icon: Briefcase,
    options: [
      { id: 'entry', label: 'Entry Level', description: '0-2 years of experience' },
      { id: 'mid', label: 'Mid Level', description: '3-7 years of experience' },
      { id: 'senior', label: 'Senior Level', description: '8-15 years of experience' },
      { id: 'executive', label: 'Executive', description: '15+ years of experience' }
    ]
  },
  {
    id: 'industry',
    title: 'Industry Focus',
    description: 'What industry are you targeting?',
    icon: Award,
    options: [
      { id: 'tech', label: 'Technology', description: 'Software, IT, Engineering' },
      { id: 'healthcare', label: 'Healthcare', description: 'Medical, Nursing, Therapy' },
      { id: 'finance', label: 'Finance', description: 'Banking, Accounting, Investment' },
      { id: 'education', label: 'Education', description: 'Teaching, Training, Research' },
      { id: 'marketing', label: 'Marketing', description: 'Digital, Content, Sales' },
      { id: 'other', label: 'Other', description: 'Different industry' }
    ]
  }
];

export function GuidedWizard({ onComplete, onSkip }: GuidedWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentStepData = wizardSteps[currentStep];
  const progress = ((currentStep + 1) / wizardSteps.length) * 100;

  const handleAnswer = (optionId: string) => {
    const newAnswers = { ...answers, [currentStepData.id]: optionId };
    setAnswers(newAnswers);

    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <currentStepData.icon className="h-8 w-8 text-blue-600" />
        </div>
        <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
        <p className="text-gray-600">{currentStepData.description}</p>
        <div className="mt-4">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-gray-500 mt-2">
            Step {currentStep + 1} of {wizardSteps.length}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {currentStepData.options.map((option) => (
            <Button
              key={option.id}
              variant="outline"
              className="w-full p-6 h-auto text-left justify-start hover:border-blue-500 hover:bg-blue-50"
              onClick={() => handleAnswer(option.id)}
            >
              <div>
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-gray-500 mt-1">{option.description}</div>
              </div>
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Button>
          ))}
        </div>

        <div className="flex justify-between mt-8">
          <Button
            variant="ghost"
            onClick={goBack}
            disabled={currentStep === 0}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button variant="ghost" onClick={onSkip}>
            Skip Setup
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}