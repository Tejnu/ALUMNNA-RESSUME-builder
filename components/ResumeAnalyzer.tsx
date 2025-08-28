'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ResumeData } from '@/types/resume';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  TrendingUp, 
  Eye, 
  FileText,
  Target,
  Zap,
  BarChart3,
  Shield,
  Clock,
  Lightbulb
} from 'lucide-react';

interface ResumeAnalyzerProps {
  resumeData: ResumeData;
  onApplyFix: (fix: any) => void;
}

interface AnalysisResult {
  score: number;
  issues: Issue[];
  strengths: string[];
  suggestions: Suggestion[];
  atsCompatibility: number;
  readabilityScore: number;
  completenessScore: number;
}

interface Issue {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  fix?: any;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

interface Suggestion {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  action: any;
  category: string;
}

export function ResumeAnalyzer({ resumeData, onApplyFix }: ResumeAnalyzerProps) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'issues' | 'suggestions'>('overview');

  const analyzeResume = async () => {
    setIsAnalyzing(true);
    
    // Simulate comprehensive analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const issues: Issue[] = [];
    const strengths: string[] = [];
    const suggestions: Suggestion[] = [];
    let score = 100;
    let atsCompatibility = 100;
    let readabilityScore = 100;
    let completenessScore = 100;

    // Analyze personal information
    if (!resumeData.personalInfo.summary || resumeData.personalInfo.summary.length < 50) {
      issues.push({
        id: 'missing-summary',
        type: 'error',
        title: 'Missing or Weak Professional Summary',
        description: 'A compelling 2-3 sentence summary helps recruiters understand your value proposition quickly',
        fix: { type: 'add-summary' },
        severity: 'critical'
      });
      score -= 20;
      completenessScore -= 25;
    } else {
      strengths.push('Comprehensive professional summary');
    }

    if (!resumeData.personalInfo.phone || !resumeData.personalInfo.email) {
      issues.push({
        id: 'missing-contact',
        type: 'error',
        title: 'Incomplete Contact Information',
        description: 'Missing phone number or email address makes it difficult for recruiters to reach you',
        severity: 'critical'
      });
      score -= 15;
      completenessScore -= 20;
    } else {
      strengths.push('Complete contact information provided');
    }

    // Analyze work experience
    if (resumeData.workExperience.length === 0) {
      issues.push({
        id: 'no-experience',
        type: 'error',
        title: 'No Work Experience Listed',
        description: 'Add your professional experience to showcase your career progression',
        severity: 'critical'
      });
      score -= 30;
      completenessScore -= 40;
    } else {
      strengths.push(`${resumeData.workExperience.length} work experience entries`);
      
      // Check for quantified achievements
      const hasQuantifiedAchievements = resumeData.workExperience.some(exp => 
        /\d+%|\d+\+|\$\d+|increased|decreased|improved|reduced/i.test(exp.description)
      );
      
      if (!hasQuantifiedAchievements) {
        issues.push({
          id: 'no-metrics',
          type: 'warning',
          title: 'Missing Quantified Achievements',
          description: 'Add specific numbers, percentages, and metrics to demonstrate your impact',
          fix: { type: 'enhance-experience' },
          severity: 'high'
        });
        score -= 15;
        readabilityScore -= 20;
      } else {
        strengths.push('Quantified achievements included');
      }
    }

    // Analyze education
    if (resumeData.education.length === 0) {
      issues.push({
        id: 'no-education',
        type: 'warning',
        title: 'No Education Listed',
        description: 'Include your educational background, even if it\'s not directly related to your field',
        severity: 'medium'
      });
      score -= 10;
      completenessScore -= 15;
    } else {
      strengths.push('Educational background included');
    }

    // Analyze skills
    if (resumeData.skills.length < 5) {
      issues.push({
        id: 'few-skills',
        type: 'warning',
        title: 'Limited Skills Listed',
        description: 'Add 8-12 relevant skills to improve keyword matching and showcase your expertise',
        severity: 'medium'
      });
      score -= 12;
      atsCompatibility -= 20;
    } else if (resumeData.skills.length >= 8) {
      strengths.push('Comprehensive skill set');
    }

    // ATS Compatibility checks
    const hasKeywords = resumeData.skills.some(skill => 
      ['JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'SQL', 'Git', 'Docker'].some(keyword =>
        skill.name.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    
    if (!hasKeywords && resumeData.skills.length > 0) {
      issues.push({
        id: 'missing-keywords',
        type: 'info',
        title: 'Missing Industry Keywords',
        description: 'Include relevant industry keywords to improve ATS compatibility',
        fix: { type: 'add-keywords' },
        severity: 'medium'
      });
      atsCompatibility -= 25;
    }

    // Length analysis
    const totalLength = (resumeData.personalInfo.summary?.length || 0) + 
                       resumeData.workExperience.reduce((acc, exp) => acc + exp.description.length, 0);
    
    if (totalLength < 500) {
      issues.push({
        id: 'too-short',
        type: 'warning',
        title: 'Resume Content Too Brief',
        description: 'Expand your descriptions to provide more context about your achievements',
        severity: 'medium'
      });
      readabilityScore -= 15;
    } else if (totalLength > 2000) {
      issues.push({
        id: 'too-long',
        type: 'info',
        title: 'Resume Content Lengthy',
        description: 'Consider condensing your descriptions to keep recruiters engaged',
        severity: 'low'
      });
      readabilityScore -= 10;
    } else {
      strengths.push('Appropriate content length');
    }

    // Generate suggestions
    suggestions.push({
      id: 'add-certifications',
      title: 'Add Professional Certifications',
      description: 'Include relevant certifications to demonstrate your commitment to professional development',
      impact: 'medium',
      action: { type: 'add-certifications' },
      category: 'Enhancement'
    });

    suggestions.push({
      id: 'optimize-keywords',
      title: 'Optimize for ATS',
      description: 'Include more industry-specific keywords throughout your resume',
      impact: 'high',
      action: { type: 'add-keywords' },
      category: 'ATS'
    });

    suggestions.push({
      id: 'improve-formatting',
      title: 'Enhance Visual Formatting',
      description: 'Use consistent formatting and clear section headers for better readability',
      impact: 'medium',
      action: { type: 'improve-formatting' },
      category: 'Design'
    });

    // Calculate final scores
    score = Math.max(score, 0);
    atsCompatibility = Math.max(atsCompatibility, 0);
    readabilityScore = Math.max(readabilityScore, 0);
    completenessScore = Math.max(completenessScore, 0);

    setAnalysis({
      score: Math.round(score),
      issues,
      strengths,
      suggestions,
      atsCompatibility: Math.round(atsCompatibility),
      readabilityScore: Math.round(readabilityScore),
      completenessScore: Math.round(completenessScore)
    });
    
    setIsAnalyzing(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'score-excellent';
    if (score >= 70) return 'score-good';
    if (score >= 50) return 'score-fair';
    return 'score-poor';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Needs Improvement';
  };

  const getIssueIcon = (type: Issue['type']) => {
    switch (type) {
      case 'error': return <XCircle className="h-4 w-4 icon-error" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 icon-warning" />;
      case 'info': return <Eye className="h-4 w-4 icon-primary" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'status-error';
      case 'high': return 'status-warning';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'status-info';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'status-success';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'status-info';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <Card className="card-modern">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 gradient-text">
          <BarChart3 className="h-5 w-5" />
          <span>Resume Analyzer</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!analysis ? (
          <div className="text-center py-8">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
                   style={{ background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.1) 0%, rgba(30, 58, 138, 0.1) 100%)' }}>
                <FileText className="h-8 w-8 icon-success" />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--figma-neutral-800)' }}>Comprehensive Resume Analysis</h3>
              <p className="mb-6 max-w-md mx-auto" style={{ color: 'var(--figma-neutral-600)' }}>
                Get detailed insights on your resume's effectiveness, ATS compatibility, and areas for improvement
              </p>
            </div>
            <Button 
              onClick={analyzeResume}
              disabled={isAnalyzing}
              className="btn-primary w-full text-lg py-4"
            >
              {isAnalyzing ? (
                <>
                  <div className="loading-spinner h-4 w-4 mr-2" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Analyze Resume
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex space-x-1 p-1 rounded-lg" style={{ backgroundColor: 'var(--figma-neutral-100)' }}>
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'issues', label: 'Issues', icon: AlertTriangle },
                { id: 'suggestions', label: 'Suggestions', icon: Lightbulb }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-white shadow-sm'
                      : 'hover:bg-white/50'
                  }`}
                  style={{ 
                    color: activeTab === tab.id ? 'var(--figma-success)' : 'var(--figma-neutral-600)' 
                  }}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Overall Score */}
                <div className="text-center bg-white rounded-lg p-6 border">
                  <div className={`text-5xl font-bold mb-2 ${getScoreColor(analysis.score)}`}>
                    {analysis.score}%
                  </div>
                  <p className="text-lg font-medium mb-1" style={{ color: 'var(--figma-neutral-700)' }}>Overall Score</p>
                  <p className="text-sm" style={{ color: 'var(--figma-neutral-500)' }}>{getScoreLabel(analysis.score)}</p>
                  <Progress value={analysis.score} className="mt-4 h-3" />
                </div>

                {/* Score Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 border text-center">
                    <Shield className="h-6 w-6 icon-primary mx-auto mb-2" />
                    <div className={`text-2xl font-bold ${getScoreColor(analysis.atsCompatibility)}`}>
                      {analysis.atsCompatibility}%
                    </div>
                    <p className="text-sm" style={{ color: 'var(--figma-neutral-600)' }}>ATS Compatible</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border text-center">
                    <Eye className="h-6 w-6 icon-accent mx-auto mb-2" />
                    <div className={`text-2xl font-bold ${getScoreColor(analysis.readabilityScore)}`}>
                      {analysis.readabilityScore}%
                    </div>
                    <p className="text-sm" style={{ color: 'var(--figma-neutral-600)' }}>Readability</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border text-center">
                    <CheckCircle className="h-6 w-6 icon-success mx-auto mb-2" />
                    <div className={`text-2xl font-bold ${getScoreColor(analysis.completenessScore)}`}>
                      {analysis.completenessScore}%
                    </div>
                    <p className="text-sm" style={{ color: 'var(--figma-neutral-600)' }}>Completeness</p>
                  </div>
                </div>

                {/* Strengths */}
                {analysis.strengths.length > 0 && (
                  <div className="bg-white rounded-lg p-4 border">
                    <h3 className="font-semibold mb-3 flex items-center" style={{ color: 'var(--figma-neutral-900)' }}>
                      <CheckCircle className="h-5 w-5 icon-success mr-2" />
                      Strengths ({analysis.strengths.length})
                    </h3>
                    <div className="space-y-2">
                      {analysis.strengths.map((strength, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--figma-success)' }}></div>
                          <span className="text-sm" style={{ color: 'var(--figma-neutral-700)' }}>{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Issues Tab */}
            {activeTab === 'issues' && (
              <div className="space-y-4">
                {analysis.issues.length === 0 ? (
                  <div className="text-center py-8 bg-white rounded-lg border">
                    <CheckCircle className="h-12 w-12 icon-success mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--figma-neutral-800)' }}>No Issues Found!</h3>
                    <p style={{ color: 'var(--figma-neutral-600)' }}>Your resume looks great with no critical issues to address.</p>
                  </div>
                ) : (
                  analysis.issues.map((issue) => (
                    <div key={issue.id} className="bg-white rounded-lg border p-4">
                      <div className="flex items-start space-x-3">
                        {getIssueIcon(issue.type)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold" style={{ color: 'var(--figma-neutral-900)' }}>{issue.title}</h4>
                            <Badge variant="outline" className={getSeverityColor(issue.severity)}>
                              {issue.severity}
                            </Badge>
                          </div>
                          <p className="text-sm mb-3" style={{ color: 'var(--figma-neutral-600)' }}>{issue.description}</p>
                          {issue.fix && (
                            <Button
                              size="sm"
                              onClick={() => onApplyFix(issue.fix)}
                              className="btn-primary"
                            >
                              <Target className="h-3 w-3 mr-1" />
                              Quick Fix
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Suggestions Tab */}
            {activeTab === 'suggestions' && (
              <div className="space-y-4">
                {analysis.suggestions.map((suggestion) => (
                  <div key={suggestion.id} className="bg-white rounded-lg border p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold mb-1" style={{ color: 'var(--figma-neutral-900)' }}>{suggestion.title}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={getImpactColor(suggestion.impact)}>
                            {suggestion.impact} impact
                          </Badge>
                          <span className="text-xs" style={{ color: 'var(--figma-neutral-500)' }}>{suggestion.category}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm mb-3" style={{ color: 'var(--figma-neutral-600)' }}>{suggestion.description}</p>
                    <Button
                      size="sm"
                      onClick={() => onApplyFix(suggestion.action)}
                      className="btn-success"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Apply
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Re-analyze Button */}
            <div className="text-center pt-4" style={{ borderTop: '1px solid var(--figma-neutral-200)' }}>
              <Button
                variant="outline"
                onClick={analyzeResume}
                disabled={isAnalyzing}
                className="btn-outline"
              >
                <Clock className="h-4 w-4 mr-2" />
                Re-analyze Resume
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}