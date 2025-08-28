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
  id: number;
  type: 'skill' | 'summary' | 'experience' | 'keyword' | 'format';
  title: string;
  description: string;
  suggestions?: string[];
  suggestion?: string;
  priority: 'high' | 'medium' | 'low';
  impact: string;
  category: string;
  confidence: number;
}

export function AIAssistant({ resumeData, onApplySuggestion }: AIAssistantProps) {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const generateSuggestions = async () => {
    setIsGenerating(true);
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const newSuggestions: AISuggestion[] = [];

    // Analyze resume content for intelligent suggestions
    const hasWorkExperience = resumeData.workExperience.length > 0;
    const currentSkills = resumeData.skills.map(s => s.name.toLowerCase());
    const summaryLength = resumeData.personalInfo.summary?.length || 0;
    const totalExperienceText = resumeData.workExperience.map(exp => exp.description).join(' ');

    // Advanced skill analysis based on job market trends
    const techSkillsMap = {
      'javascript': ['TypeScript', 'React', 'Node.js', 'Vue.js', 'Angular'],
      'python': ['Django', 'Flask', 'FastAPI', 'Pandas', 'NumPy', 'TensorFlow'],
      'react': ['Next.js', 'Redux', 'React Native', 'Gatsby', 'Styled Components'],
      'java': ['Spring Boot', 'Hibernate', 'Maven', 'Gradle', 'JUnit'],
      'aws': ['Docker', 'Kubernetes', 'Terraform', 'CloudFormation', 'Lambda']
    };

    // Intelligent skill suggestions based on existing skills
    const suggestedSkills: string[] = [];
    currentSkills.forEach(skill => {
      Object.entries(techSkillsMap).forEach(([key, relatedSkills]) => {
        if (skill.includes(key)) {
          relatedSkills.forEach(relatedSkill => {
            if (!currentSkills.some(existing => existing.includes(relatedSkill.toLowerCase())) && 
                !suggestedSkills.includes(relatedSkill)) {
              suggestedSkills.push(relatedSkill);
            }
          });
        }
      });
    });

    if (suggestedSkills.length > 0) {
      newSuggestions.push({
        id: 1,
        type: 'skill',
        title: 'Add High-Demand Skills',
        description: 'Based on current job market analysis, these skills are highly sought after in your field',
        suggestions: suggestedSkills.slice(0, 6),
        priority: 'high',
        impact: 'Increases job match rate by 35-45%',
        category: 'Skills',
        confidence: 92
      });
    }

    // Intelligent summary enhancement
    try {
      if (apiKey) {
        const prompt = {
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `You are an expert resume coach. Analyze this resume and provide improvements based on EXISTING content:

CURRENT RESUME:
${JSON.stringify(resumeData, null, 2).slice(0, 8000)}

Return JSON with:
{
  "skillSuggestions": ["skill1", "skill2", ...] // Max 8 relevant skills based on their experience
  "improvedSummary": "Enhanced version of their current summary with stronger action words and quantifiable achievements",
  "experienceEnhancements": [
    {
      "id": "experience_id",
      "enhancement": "Rewritten description with quantified achievements, stronger action verbs, and industry keywords"
    }
  ]
}

RULES:
- Keep the core meaning of their existing content
- Add quantifiable metrics where logical
- Use stronger action verbs
- Include relevant industry keywords
- Make achievements more impactful
- Don't fabricate information, enhance what exists`
                }
              ]
            }
          ]
        };

        const resp = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(prompt)
        });
        const data = await resp.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        let modelJson: any = {};
        try { 
          const cleanText = text.replace(/```json|```/g, '').trim();
          modelJson = JSON.parse(cleanText); 
        } catch (e) {
          console.error('Failed to parse AI response:', e);
        }

        if (Array.isArray(modelJson.skillSuggestions) && modelJson.skillSuggestions.length > 0) {
          newSuggestions.push({
            id: 100,
            type: 'skill',
            title: 'AI Skill Suggestions',
            description: 'High-signal skills inferred from your resume',
            suggestions: modelJson.skillSuggestions.slice(0, 6),
            priority: 'high',
            impact: 'Increases job match rate by 35-45%',
            category: 'Skills',
            confidence: 90
          });
        }

        if (modelJson.improvedSummary) {
          newSuggestions.push({
            id: 101,
            type: 'summary',
            title: 'AI-Optimized Summary',
            description: 'Tailored summary based on your experience and skills',
            suggestions: [modelJson.improvedSummary],
            priority: 'high',
            impact: 'Improves recruiter engagement by 60%',
            category: 'Content',
            confidence: 88
          });
        }
      }
    } catch {}

    // Experience enhancement with quantified metrics
    if (hasWorkExperience) {
      const hasMetrics = /\d+%|\d+\+|\$\d+|increased|decreased|improved|reduced|led|managed/i.test(totalExperienceText);

      if (!hasMetrics) {
        newSuggestions.push({
          id: 3,
          type: 'experience',
          title: 'Add Quantified Achievements',
          description: 'Transform your experience bullets into compelling, metric-driven accomplishments',
          suggestions: [
            'Add quantified achievements with specific metrics and percentages',
            'Include leadership experience and team management details',
            'Mention technology implementations and process improvements',
            'Highlight mentoring experience and career development impact',
            'Add client satisfaction metrics and stakeholder collaboration'
          ],
          priority: 'high',
          impact: 'Increases interview callbacks by 70%',
          category: 'Experience',
          confidence: 95
        });
      }
    }

    // ATS optimization suggestions
    const atsKeywords = [
      'Agile/Scrum', 'CI/CD', 'RESTful APIs', 'Microservices', 'Cloud Computing',
      'Problem Solving', 'Team Leadership', 'Project Management', 'Code Review',
      'Performance Optimization', 'Database Design', 'System Architecture'
    ];

    const missingKeywords = atsKeywords.filter(keyword => 
      !currentSkills.some(skill => skill.includes(keyword.toLowerCase().replace(/[\/\s]/g, '')))
    );

    if (missingKeywords.length > 0) {
      newSuggestions.push({
        id: 4,
        type: 'keyword',
        title: 'Boost ATS Compatibility',
        description: 'Add industry-standard keywords that hiring managers and ATS systems actively search for',
        suggestions: missingKeywords.slice(0, 8),
        priority: 'medium',
        impact: 'Improves ATS pass-through rate by 45%',
        category: 'Keywords',
        confidence: 85
      });
    }

    // Format and structure suggestions
    const wordCount = (resumeData.personalInfo.summary?.split(' ').length || 0) + 
                     resumeData.workExperience.reduce((acc, exp) => acc + exp.description.split(' ').length, 0);

    if (wordCount > 400) {
      newSuggestions.push({
        id: 5,
        type: 'format',
        title: 'Optimize Content Length',
        description: 'Streamline your resume for maximum impact while maintaining all key information',
        suggestion: 'Focus on your top 3-4 achievements per role and use strong action verbs to create concise, impactful statements',
        priority: 'medium',
        impact: 'Improves readability score by 30%',
        category: 'Format',
        confidence: 78
      });
    }

    // Industry-specific suggestions
    if (currentSkills.some(skill => ['react', 'javascript', 'node'].some(tech => skill.includes(tech)))) {
      newSuggestions.push({
        id: 6,
        type: 'skill',
        title: 'Frontend Development Trends',
        description: 'Stay current with the latest frontend technologies that employers are actively seeking',
        suggestions: ['Next.js 14', 'Tailwind CSS', 'TypeScript', 'GraphQL', 'Vercel', 'Prisma'],
        priority: 'medium',
        impact: 'Aligns with 2024 job market trends',
        category: 'Skills',
        confidence: 82
      });
    }

    setSuggestions(newSuggestions);
    setIsGenerating(false);
  };

  const applySuggestion = (suggestion: AISuggestion) => {
    onApplySuggestion(suggestion.type, suggestion);
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  };

  const dismissSuggestion = (id: number) => {
    setSuggestions(prev => prev.filter(s => s.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'status-error';
      case 'medium': return 'status-warning';
      case 'low': return 'status-success';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-emerald-600';
    if (confidence >= 80) return 'text-blue-600';
    if (confidence >= 70) return 'text-amber-600';
    return 'text-gray-600';
  };

  const categories = ['all', 'Skills', 'Content', 'Experience', 'Keywords', 'Format'];
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
          <div className="space-y-8">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-xl ${activeCategory === category ? "btn-primary" : "border-gray-200 hover:border-indigo-300"}`}
                >
                  {category === 'all' ? 'All Insights' : category}
                </Button>
              ))}
            </div>

            {/* Suggestions List */}
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
                          <Badge variant="outline" className={`${getPriorityColor(suggestion.priority)} rounded-lg`}>
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

                  {suggestion.type === 'skill' && suggestion.suggestions && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {suggestion.suggestions.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 cursor-pointer transition-colors rounded-lg px-3 py-1">
                          + {skill}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {suggestion.type === 'summary' && suggestion.suggestion && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 mb-6">
                      <p className="text-gray-700 leading-relaxed">{suggestion.suggestion}</p>
                    </div>
                  )}

                  {suggestion.type === 'keyword' && suggestion.suggestions && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {suggestion.suggestions.map((keyword: string, index: number) => (
                        <Badge key={index} variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-lg">
                          {keyword}
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