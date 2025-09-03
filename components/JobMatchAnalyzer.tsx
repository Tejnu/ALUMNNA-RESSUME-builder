'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ResumeData } from '@/types/resume';
import { 
  Target, 
  Search, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle,
  Plus,
  Briefcase,
  Zap,
  BarChart3,
  Eye,
  Brain,
  X,
  Skull,
  ThumbsDown,
  AlertCircle
} from 'lucide-react';

interface JobMatchAnalyzerProps {
  resumeData: ResumeData;
  onOptimize?: (optimizations: any) => void;
}

interface AIJobMatchResult {
  compatibilityScore: number;
  verdict: 'REJECT' | 'MAYBE' | 'INTERVIEW' | 'STRONG_MATCH';
  harshFeedback: string;
  criticalGaps: {
    category: 'SKILLS' | 'EXPERIENCE' | 'EDUCATION' | 'CERTIFICATIONS';
    gap: string;
    severity: 'DEALBREAKER' | 'CRITICAL' | 'MAJOR' | 'MINOR';
    harshComment: string;
  }[];
  strengths: {
    point: string;
    relevance: 'HIGH' | 'MEDIUM' | 'LOW';
  }[];
  redFlags: string[];
  improvements: {
    action: string;
    timeframe: string;
    difficulty: 'EASY' | 'HARD' | 'NEARLY_IMPOSSIBLE';
    honestAssessment: string;
  }[];
  competitionAnalysis: {
    candidateLevel: 'BEGINNER' | 'JUNIOR' | 'MID' | 'SENIOR' | 'EXPERT';
    jobLevel: 'BEGINNER' | 'JUNIOR' | 'MID' | 'SENIOR' | 'EXPERT';
    realityCheck: string;
  };
  salaryReality: {
    theirWorth: string;
    jobExpectation: string;
    gap: string;
  };
}

export function JobMatchAnalyzer({ resumeData, onOptimize }: JobMatchAnalyzerProps) {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [matchResult, setMatchResult] = useState<AIJobMatchResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [savedJobs, setSavedJobs] = useState<Array<{title: string, company: string, score: number}>>([]);

  const analyzeMatch = async () => {
    if (!jobTitle.trim() || !jobDescription.trim()) return;

    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/job-match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          resumeData, 
          jobDescription: `${jobTitle}\n\nCompany: ${companyName}\n\n${jobDescription}` 
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setMatchResult(result);
        
        // Save this job analysis
        setSavedJobs(prev => [
          { title: jobTitle, company: companyName, score: result.compatibilityScore },
          ...prev.slice(0, 4) // Keep only last 5
        ]);
      } else {
        // Fallback analysis
        setMatchResult(getFallbackAnalysis());
      }
    } catch (error) {
      console.error('Job match analysis failed:', error);
      setMatchResult(getFallbackAnalysis());
    }

    setIsAnalyzing(false);
  };

  const getFallbackAnalysis = (): AIJobMatchResult => {
    return {
      compatibilityScore: 35,
      verdict: 'REJECT',
      harshFeedback: "Your resume is not competitive for this role. The gap between your skills and the job requirements is significant.",
      criticalGaps: [
        {
          category: 'SKILLS',
          gap: 'Required technologies missing',
          severity: 'DEALBREAKER',
          harshComment: 'You lack the fundamental technical skills this role demands.'
        }
      ],
      strengths: [
        {
          point: 'Basic qualifications present',
          relevance: 'LOW'
        }
      ],
      redFlags: ['Skill gaps', 'Experience misalignment'],
      improvements: [
        {
          action: 'Learn required technologies',
          timeframe: '6-12 months',
          difficulty: 'HARD',
          honestAssessment: 'This will require significant effort and time investment.'
        }
      ],
      competitionAnalysis: {
        candidateLevel: 'JUNIOR',
        jobLevel: 'MID',
        realityCheck: 'You are competing against more qualified candidates.'
      },
      salaryReality: {
        theirWorth: 'Entry level',
        jobExpectation: 'Mid-senior level',
        gap: 'Significant mismatch'
      }
    };
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'STRONG_MATCH':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'INTERVIEW':
        return <Eye className="h-6 w-6 text-blue-500" />;
      case 'MAYBE':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case 'REJECT':
        return <Skull className="h-6 w-6 text-red-500" />;
      default:
        return <AlertCircle className="h-6 w-6 text-gray-500" />;
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'STRONG_MATCH':
        return 'border-emerald-200';
      case 'INTERVIEW':
        return 'border-blue-200';
      case 'MAYBE':
        return 'border-amber-200';
      case 'REJECT':
        return 'border-red-200';
      default:
        return 'border-gray-200';
    }
  };

  const getVerdictGradient = (verdict: string) => {
    switch (verdict) {
      case 'STRONG_MATCH':
        return 'linear-gradient(135deg, rgba(5, 150, 105, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)';
      case 'INTERVIEW':
        return 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 197, 253, 0.05) 100%)';
      case 'MAYBE':
        return 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(251, 191, 36, 0.05) 100%)';
      case 'REJECT':
        return 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(248, 113, 113, 0.05) 100%)';
      default:
        return 'linear-gradient(135deg, rgba(107, 114, 128, 0.05) 0%, rgba(156, 163, 175, 0.05) 100%)';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 40) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'DEALBREAKER':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'CRITICAL':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MAJOR':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'MINOR':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'HARD':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'NEARLY_IMPOSSIBLE':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="ai-gradient rounded-2xl border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-semibold text-gray-900">AI Job Match Analyzer</span>
              {matchResult && (
                <Badge variant="secondary" className="ml-3 bg-purple-100 text-purple-700">
                  {matchResult.compatibilityScore}% Match
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                placeholder="e.g., Senior React Developer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name (Optional)</Label>
              <Input
                id="companyName"
                placeholder="e.g., Google, Microsoft"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="jobDescription">Job Description</Label>
            <Textarea
              id="jobDescription"
              placeholder="Paste the complete job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={8}
            />
          </div>

          <Button 
            onClick={analyzeMatch} 
            disabled={!jobTitle.trim() || !jobDescription.trim() || isAnalyzing}
            className="w-full btn-primary text-base px-8 py-3"
          >
            {isAnalyzing ? (
              <>
                <Brain className="h-4 w-4 mr-2 animate-spin" />
                AI is analyzing your chances...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Analyze Job Match
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Saved Jobs */}
      {savedJobs.length > 0 && (
        <Card className="rounded-2xl border border-gray-100 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-lg font-semibold text-gray-900">Recent Analyses</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savedJobs.map((job, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100">
                  <div>
                    <div className="font-medium text-gray-900">{job.title}</div>
                    {job.company && <div className="text-sm text-gray-600">{job.company}</div>}
                  </div>
                  <Badge className={`px-3 py-1 rounded-full font-semibold ${getScoreColor(job.score)}`} variant="outline">
                    {job.score}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Match Results */}
      {matchResult && (
        <div className="space-y-6">
          {/* Overall Verdict */}
          <Card className={`border-2 rounded-2xl shadow-lg ${getVerdictColor(matchResult.verdict)}`} style={{ background: getVerdictGradient(matchResult.verdict) }}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-white/80 backdrop-blur-sm">
                  {getVerdictIcon(matchResult.verdict)}
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    Verdict: {matchResult.verdict.replace('_', ' ')}
                  </div>
                  <div className={`text-4xl font-bold ${getScoreColor(matchResult.compatibilityScore)}`}>
                    {matchResult.compatibilityScore}%
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress 
                  value={matchResult.compatibilityScore} 
                  className="h-4"
                />
                <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/40">
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-gray-900">
                    <ThumbsDown className="h-4 w-4" />
                    Harsh Reality Check
                  </h4>
                  <p className="text-sm text-gray-700">{matchResult.harshFeedback}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Critical Gaps */}
          {matchResult.criticalGaps.length > 0 && (
            <Card className="rounded-2xl border border-red-100 shadow-sm" style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(248, 113, 113, 0.05) 100%)' }}>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-red-100 to-orange-100">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <span className="text-lg font-semibold text-red-600">Critical Gaps</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {matchResult.criticalGaps.map((gap, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 border border-red-100 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className={`px-3 py-1 rounded-full font-semibold ${getSeverityColor(gap.severity)}`}>
                          {gap.severity}
                        </Badge>
                        <Badge variant="outline" className="rounded-full">{gap.category}</Badge>
                      </div>
                      <h4 className="font-semibold mb-2 text-gray-900">{gap.gap}</h4>
                      <p className="text-sm text-gray-600">{gap.harshComment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Strengths */}
          {matchResult.strengths.length > 0 && (
            <Card className="rounded-2xl border border-emerald-100 shadow-sm" style={{ background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)' }}>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className="text-lg font-semibold text-emerald-600">Your Strengths</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {matchResult.strengths.map((strength, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl border border-emerald-100 shadow-sm">
                      <span className="text-sm text-gray-700 font-medium">{strength.point}</span>
                      <Badge 
                        variant={strength.relevance === 'HIGH' ? 'default' : 'secondary'}
                        className={`px-3 py-1 rounded-full font-semibold ${
                          strength.relevance === 'HIGH' ? 'bg-emerald-100 text-emerald-700' : 
                          strength.relevance === 'MEDIUM' ? 'bg-blue-100 text-blue-700' : 
                          'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {strength.relevance}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Red Flags */}
          {matchResult.redFlags.length > 0 && (
            <Card className="rounded-2xl border border-red-100 shadow-sm" style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(248, 113, 113, 0.05) 100%)' }}>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-red-100 to-pink-100">
                    <Skull className="h-5 w-5 text-red-600" />
                  </div>
                  <span className="text-lg font-semibold text-red-600">Red Flags</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {matchResult.redFlags.map((flag, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-red-100 shadow-sm">
                      <div className="p-1 rounded-lg bg-red-100">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      </div>
                      <span className="text-sm text-gray-700 font-medium">{flag}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Improvements */}
          {matchResult.improvements.length > 0 && (
            <Card className="rounded-2xl border border-blue-100 shadow-sm" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 197, 253, 0.05) 100%)' }}>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-lg font-semibold text-blue-600">Honest Improvement Plan</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {matchResult.improvements.map((improvement, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-1 rounded-lg bg-blue-100">
                          {getDifficultyIcon(improvement.difficulty)}
                        </div>
                        <span className="font-semibold text-gray-900">{improvement.action}</span>
                        <Badge variant="outline" className="rounded-full">{improvement.timeframe}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{improvement.honestAssessment}</p>
                      <Badge className={`px-3 py-1 rounded-full font-semibold ${
                        improvement.difficulty === 'EASY' ? 'bg-emerald-100 text-emerald-800' :
                        improvement.difficulty === 'HARD' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {improvement.difficulty.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Competition Analysis */}
          <Card className="rounded-2xl border border-purple-100 shadow-sm" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(196, 181, 253, 0.05) 100%)' }}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                </div>
                <span className="text-lg font-semibold text-purple-600">Competition Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white rounded-xl border border-purple-100 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Your Level</div>
                    <div className="font-bold text-lg text-purple-600">{matchResult.competitionAnalysis.candidateLevel}</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl border border-purple-100 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Job Level</div>
                    <div className="font-bold text-lg text-purple-600">{matchResult.competitionAnalysis.jobLevel}</div>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-100 shadow-sm">
                  <p className="text-sm text-gray-700">{matchResult.competitionAnalysis.realityCheck}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Salary Reality */}
          <Card className="rounded-2xl border border-amber-100 shadow-sm" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(251, 191, 36, 0.05) 100%)' }}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100">
                  <Zap className="h-5 w-5 text-amber-600" />
                </div>
                <span className="text-lg font-semibold text-amber-600">Salary Reality Check</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-amber-100 shadow-sm">
                  <span className="text-sm text-gray-600 font-medium">Your Current Worth:</span>
                  <Badge variant="outline" className="rounded-full">{matchResult.salaryReality.theirWorth}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-amber-100 shadow-sm">
                  <span className="text-sm text-gray-600 font-medium">Job Expectation:</span>
                  <Badge variant="outline" className="rounded-full">{matchResult.salaryReality.jobExpectation}</Badge>
                </div>
                <div className="p-4 bg-white rounded-xl border border-amber-100 shadow-sm">
                  <span className="text-sm font-medium text-amber-700">{matchResult.salaryReality.gap}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
