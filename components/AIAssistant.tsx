'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Lightbulb, TrendingUp, CheckCircle, X, Zap, Target, Brain, Wand2 } from 'lucide-react';
import { ResumeData } from '@/types/resume';

interface AIAssistantProps {
  resumeData: ResumeData;
  onApplySuggestion: (type: string, suggestion: any) => void;
}

interface AISuggestion {
  id: string;
  type: 'skill' | 'summary' | 'experience' | 'keyword' | 'format' | 'section';
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;
  impact: string;
  category: string;
  before?: string;
  after: string;
  applicableData: any;
}

export function AIAssistant({ resumeData, onApplySuggestion }: AIAssistantProps) {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const generateSuggestions = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/enhance-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          resumeData, 
          enhancementType: 'comprehensive' 
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setSuggestions(result.suggestions || []);
      } else {
        // Fallback to basic suggestions
        setSuggestions(getFallbackSuggestions());
      }
    } catch (error) {
      console.error('Failed to generate AI suggestions:', error);
      setSuggestions(getFallbackSuggestions());
    }

    setIsGenerating(false);
  };

  const getFallbackSuggestions = (): AISuggestion[] => {
    const suggestions: AISuggestion[] = [];
    
    // Summary enhancement
    if (!resumeData.personalInfo?.summary || resumeData.personalInfo.summary.length < 100) {
      suggestions.push({
        id: 'summary_enhance',
        type: 'summary',
        title: 'Enhance Professional Summary',
        description: 'Your summary needs to be more compelling and showcase your unique value proposition',
        priority: 'high',
        confidence: 90,
        impact: 'Increases recruiter engagement by 65%',
        category: 'Content',
        before: resumeData.personalInfo?.summary || '',
        after: 'Results-driven professional with proven expertise in delivering high-impact solutions and leading cross-functional teams to achieve organizational objectives.',
        applicableData: {
          section: 'personalInfo',
          field: 'summary',
          value: 'Results-driven professional with proven expertise in delivering high-impact solutions and leading cross-functional teams to achieve organizational objectives.'
        }
      });
    }

    // Skills enhancement
    const currentSkills = resumeData.skills?.map((s: any) => s.name.toLowerCase()) || [];
    const marketSkills = ['Problem Solving', 'Team Leadership', 'Project Management', 'Communication'];
    const missingSkills = marketSkills.filter(skill => 
      !currentSkills.includes(skill.toLowerCase())
    );

    if (missingSkills.length > 0) {
      suggestions.push({
        id: 'skills_enhance',
        type: 'skill',
        title: 'Add Essential Professional Skills',
        description: 'These skills are highly valued across industries and will improve your resume\'s appeal',
        priority: 'high',
        confidence: 85,
        impact: 'Improves ATS compatibility by 40%',
        category: 'Skills',
        after: missingSkills.join(', '),
        applicableData: {
          section: 'skills',
          field: 'add',
          value: missingSkills.map(skill => ({ name: skill, level: 'Intermediate' }))
        }
      });
    }

    return suggestions;
  };

  const applySuggestion = (suggestion: AISuggestion) => {
    try {
      const { applicableData } = suggestion;
      
      if (!applicableData) {
        console.error('No applicable data found for suggestion');
        return;
      }

      // Create the update object based on the suggestion
      const updateData = {
        type: applicableData.section,
        suggestion: {
          field: applicableData.field,
          value: applicableData.value,
          index: applicableData.index
        }
      };

      // Call the parent's apply function
      onApplySuggestion(updateData.type, updateData.suggestion);
      
      // Remove the applied suggestion from the list
      setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
      
    } catch (error) {
      console.error('Failed to apply suggestion:', error);
    }
  };

  const dismissSuggestion = (suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-emerald-600';
    if (confidence >= 80) return 'text-blue-600';
    if (confidence >= 70) return 'text-amber-600';
    return 'text-gray-600';
  };

  const categories = ['all', 'Skills', 'Content', 'Experience', 'Keywords', 'Formatting'];
  const filteredSuggestions = activeCategory === 'all' 
    ? suggestions 
    : suggestions.filter(s => s.category === activeCategory);

  return (
    <Card className="ai-gradient rounded-2xl border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-semibold text-gray-900">AI Career Assistant</span>
            {suggestions.length > 0 && (
              <Badge variant="secondary" className="ml-3 bg-indigo-100 text-indigo-700">
                {suggestions.length} insights
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-8">
              <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-6">
                <Wand2 className="h-10 w-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">AI-Powered Resume Enhancement</h3>
              <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                Get personalized, data-driven suggestions to optimize your resume for maximum impact and ATS compatibility
              </p>
            </div>
            <Button 
              onClick={generateSuggestions}
              disabled={isGenerating}
              className="btn-primary text-base px-8 py-3"
            >
              {isGenerating ? (
                <>
                  <div className="loading-spinner h-5 w-5 mr-3" />
                  Analyzing Your Resume...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-3" />
                  Generate AI Insights
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-xl ${activeCategory === category ? "btn-primary" : "border-gray-200 hover:border-indigo-300"}`}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Suggestions */}
            <div className="space-y-6">
              {filteredSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
                        <Target className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg text-gray-900 mb-2">{suggestion.title}</h4>
                        <div className="flex items-center space-x-3 mb-3">
                          <Badge className={`px-3 py-1 rounded-full font-semibold ${getPriorityColor(suggestion.priority)}`}>
                            {suggestion.priority} priority
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                            <span className={`text-sm font-medium ${getConfidenceColor(suggestion.confidence)}`}>
                              {suggestion.confidence}% confidence
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{suggestion.description}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissSuggestion(suggestion.id)}
                      className="hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Before/After Preview */}
                  {suggestion.before && (
                    <div className="mb-4 space-y-3">
                      <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                        <div className="text-sm font-medium text-red-700 mb-1">Current:</div>
                        <p className="text-sm text-red-600">{suggestion.before}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                        <div className="text-sm font-medium text-emerald-700 mb-1">Improved:</div>
                        <p className="text-sm text-emerald-600">{suggestion.after}</p>
                      </div>
                    </div>
                  )}

                  {/* Skills or Keywords Display */}
                  {(suggestion.type === 'skill' || suggestion.type === 'keyword') && suggestion.after && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {suggestion.after.split(', ').map((item: string, index: number) => (
                        <Badge key={index} variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 cursor-pointer transition-colors rounded-lg px-3 py-1">
                          + {item}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm text-emerald-600 font-medium">{suggestion.impact}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => dismissSuggestion(suggestion.id)}
                        className="rounded-lg border-gray-200 hover:border-gray-300"
                      >
                        Maybe Later
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => applySuggestion(suggestion)}
                        className="btn-primary rounded-lg"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Generate More Button */}
            <div className="text-center pt-6 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={generateSuggestions}
                disabled={isGenerating}
                className="rounded-xl border-indigo-200 text-indigo-700 hover:bg-indigo-50"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate More Insights
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
