
'use client';

import React from 'react';
import { ResumeTemplate } from '@/types/resume';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Sparkles, Award, Target, Zap, Code } from 'lucide-react';

const templates: { 
  id: ResumeTemplate; 
  name: string; 
  description: string; 
  icon: React.ComponentType<any>;
  color: string;
  features: string[];
  isNew?: boolean;
}[] = [
  {
    id: 'modern',
    name: 'Modern Executive',
    description: 'Clean design with gradient accents and modern typography for leadership roles',
    icon: Sparkles,
    color: 'from-indigo-500 to-purple-600',
    features: ['ATS Optimized', 'Color Accents', 'Executive Style'],
    isNew: true
  },
  {
    id: 'classic',
    name: 'Professional Classic',
    description: 'Traditional professional layout perfect for corporate environments',
    icon: Award,
    color: 'from-blue-500 to-cyan-600',
    features: ['Corporate Ready', 'Traditional', 'Conservative']
  },
  {
    id: 'minimal',
    name: 'Clean Minimal',
    description: 'Ultra-clean design focusing purely on content and readability',
    icon: Target,
    color: 'from-gray-500 to-slate-600',
    features: ['Content Focus', 'Readable', 'Minimalist']
  },
  {
    id: 'creative',
    name: 'Creative Impact',
    description: 'Bold design for creative professionals and portfolio showcases',
    icon: Zap,
    color: 'from-purple-500 to-pink-600',
    features: ['Portfolio Ready', 'Creative Fields', 'Visual Impact']
  },
  {
    id: 'executive',
    name: 'Executive Elite',
    description: 'Premium design for C-level executives and senior leadership',
    icon: Award,
    color: 'from-slate-700 to-slate-900',
    features: ['Leadership Focus', 'Premium Design', 'Executive Level'],
    isNew: true
  },
  {
    id: 'technical',
    name: 'Tech Pro',
    description: 'Developer-focused template with technical styling and code aesthetics',
    icon: Code,
    color: 'from-emerald-600 to-teal-700',
    features: ['Developer Ready', 'Technical Focus', 'Code Aesthetic'],
    isNew: true
  }
];

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (template: ResumeTemplate) => void;
}

export function TemplateSelector({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) {
  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Template</h2>
        <p className="text-gray-600">Select a professional template that matches your industry and personal style</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {templates.map((template) => {
          const IconComponent = template.icon;
          const isSelected = selectedTemplate === template.id;
          
          return (
            <Card
              key={template.id}
              className={`relative p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                isSelected
                  ? 'ring-2 ring-black shadow-xl bg-gray-50'
                  : 'border-gray-200 hover:border-black bg-white'
              }`}
              onClick={() => onTemplateChange(template.id)}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-black rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              )}
              
              {/* New Badge */}
              {template.isNew && !isSelected && (
                <div className="absolute -top-2 -left-2 px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold rounded-full shadow-lg">
                  NEW
                </div>
              )}
              
              {/* Template Icon */}
              <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center mb-4 shadow-lg">
                <IconComponent className="h-6 w-6 text-white" />
              </div>
              
              {/* Template Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{template.description}</p>
                </div>
                
                {/* Features */}
                <div className="flex flex-wrap gap-1">
                  {template.features.map((feature, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className={`text-xs ${
                        isSelected 
                          ? 'bg-gray-100 text-gray-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Hover Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${template.color} opacity-0 hover:opacity-5 rounded-lg transition-opacity duration-300`} />
            </Card>
          );
        })}
      </div>
    </div>
  );
}
