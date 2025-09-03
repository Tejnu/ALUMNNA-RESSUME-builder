import { NextRequest, NextResponse } from 'next/server';
import { ResumeData } from '@/types/resume';

export async function POST(request: NextRequest) {
  try {
    const { resumeData, jobDescription } = await request.json();
    
    if (!resumeData || !jobDescription) {
      return NextResponse.json({ error: 'Resume data and job description are required' }, { status: 400 });
    }

    const analysis = await analyzeJobMatchWithAI(resumeData, jobDescription);
    
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Job match analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze job match' },
      { status: 500 }
    );
  }
}

async function analyzeJobMatchWithAI(resumeData: ResumeData, jobDescription: string) {
  const apiKey = process.env.GEMINI_API_KEY || "AIzaSyCz2zg2PZ_QkmN8F18ov_RnhVP0T0PKM4A";
  
  // Prepare resume content for analysis
  const resumeText = prepareResumeForJobMatch(resumeData);
  
  const prompt = `
You are a BRUTAL, no-nonsense hiring manager and technical recruiter with 20+ years of experience. Your job is to give harsh, honest feedback about job compatibility. Don't sugarcoat anything.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Analyze this resume against the job description and provide HARSH, HONEST feedback. Be brutally honest about their chances. If they're not qualified, say it directly. If they're missing critical skills, call it out harshly.

Return a JSON response with this EXACT structure:
{
  "compatibilityScore": number (0-100, be harsh - average should be 30-50),
  "verdict": "REJECT" | "MAYBE" | "INTERVIEW" | "STRONG_MATCH",
  "harshFeedback": "Brutal, honest assessment in 2-3 sentences",
  "criticalGaps": [
    {
      "category": "SKILLS" | "EXPERIENCE" | "EDUCATION" | "CERTIFICATIONS",
      "gap": "Specific missing requirement",
      "severity": "DEALBREAKER" | "CRITICAL" | "MAJOR" | "MINOR",
      "harshComment": "Brutal comment about this gap"
    }
  ],
  "strengths": [
    {
      "point": "What they actually have going for them",
      "relevance": "HIGH" | "MEDIUM" | "LOW"
    }
  ],
  "redFlags": [
    "List of concerning things about this candidate"
  ],
  "improvements": [
    {
      "action": "What they need to do",
      "timeframe": "How long it would take",
      "difficulty": "EASY" | "HARD" | "NEARLY_IMPOSSIBLE",
      "honestAssessment": "Brutal truth about whether they can actually do this"
    }
  ],
  "competitionAnalysis": {
    "candidateLevel": "BEGINNER" | "JUNIOR" | "MID" | "SENIOR" | "EXPERT",
    "jobLevel": "BEGINNER" | "JUNIOR" | "MID" | "SENIOR" | "EXPERT", 
    "realityCheck": "Honest assessment of how they stack up against typical applicants"
  },
  "salaryReality": {
    "theirWorth": "What they're actually worth based on their resume",
    "jobExpectation": "What the job probably pays",
    "gap": "The brutal truth about salary expectations"
  }
}

BE BRUTALLY HONEST. Examples of harsh but accurate feedback:
- "Your 6 months of JavaScript doesn't qualify you for a Senior Full Stack role requiring 5+ years"
- "You claim to know React but have zero projects demonstrating it"
- "Your education from 2010 is completely irrelevant to this AI/ML position"
- "This resume screams junior developer but you're applying for an architect role"

SCORING GUIDELINES (be harsh):
- 0-20: Completely unqualified, wasting everyone's time
- 21-40: Major gaps, unlikely to succeed even with training
- 41-60: Some potential but significant concerns
- 61-80: Decent candidate with some reservations
- 81-100: Strong match (rare, only for truly excellent fits)

Don't be nice. Be honest. This person needs to know the truth about their chances.
`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      console.log('Gemini API request failed:', response.status);
      return getFallbackJobAnalysis(resumeData, jobDescription);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      return getFallbackJobAnalysis(resumeData, jobDescription);
    }

    // Extract JSON from AI response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const analysisResult = JSON.parse(jsonMatch[0]);
        return analysisResult;
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        return getFallbackJobAnalysis(resumeData, jobDescription);
      }
    }

    return getFallbackJobAnalysis(resumeData, jobDescription);
  } catch (error) {
    console.error('AI job analysis failed:', error);
    return getFallbackJobAnalysis(resumeData, jobDescription);
  }
}

function prepareResumeForJobMatch(resumeData: ResumeData): string {
  let content = `
CANDIDATE PROFILE:
Name: ${resumeData.personalInfo.fullName || 'Unknown'}
Email: ${resumeData.personalInfo.email || 'Not provided'}
Location: ${resumeData.personalInfo.location || 'Unknown'}

PROFESSIONAL SUMMARY:
${resumeData.personalInfo.summary || 'No professional summary - RED FLAG'}

WORK EXPERIENCE (${resumeData.workExperience.length} positions):
`;

  resumeData.workExperience.forEach((exp, index) => {
    const duration = calculateDuration(exp.startDate, exp.endDate, exp.isCurrentJob);
    content += `
${index + 1}. ${exp.position || 'Unknown Position'} at ${exp.company || 'Unknown Company'}
   Duration: ${duration}
   Description: ${exp.description || 'No description provided - RED FLAG'}
`;
  });

  content += `
EDUCATION (${resumeData.education.length} entries):
`;

  resumeData.education.forEach((edu, index) => {
    content += `
${index + 1}. ${edu.degree || 'Unknown'} in ${edu.field || 'Unknown'} 
   Institution: ${edu.institution || edu.school || 'Unknown'}
   Graduated: ${edu.graduationDate || edu.endDate || 'Unknown'}
`;
  });

  content += `
TECHNICAL SKILLS (${resumeData.skills.length} listed):
`;

  resumeData.skills.forEach((skill, index) => {
    content += `${index + 1}. ${skill.name} (${skill.level}) - ${skill.category || 'Uncategorized'}\n`;
  });

  if (resumeData.projects && resumeData.projects.length > 0) {
    content += `
PROJECTS (${resumeData.projects.length} listed):
`;
    resumeData.projects.forEach((project, index) => {
      content += `
${index + 1}. ${project.title || project.name || 'Unnamed Project'}
   Description: ${project.description || 'No description'}
   Technologies: ${Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies || 'None listed'}
`;
    });
  } else {
    content += `\nPROJECTS: None listed - MAJOR RED FLAG for technical roles`;
  }

  if (resumeData.certifications && resumeData.certifications.length > 0) {
    content += `
CERTIFICATIONS (${resumeData.certifications.length} listed):
`;
    resumeData.certifications.forEach((cert, index) => {
      content += `${index + 1}. ${cert.name} from ${cert.issuer} (${cert.date})\n`;
    });
  } else {
    content += `\nCERTIFICATIONS: None listed`;
  }

  // Calculate total experience
  const totalYears = calculateTotalExperience(resumeData.workExperience);
  content += `\nTOTAL PROFESSIONAL EXPERIENCE: ~${totalYears} years`;

  return content;
}

function calculateDuration(startDate?: string, endDate?: string, isCurrentJob?: boolean): string {
  if (!startDate) return 'Unknown duration';
  
  const start = new Date(startDate + '-01');
  const end = isCurrentJob ? new Date() : (endDate ? new Date(endDate + '-01') : new Date());
  
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (years === 0) {
    return `${months} month${months !== 1 ? 's' : ''}`;
  } else if (remainingMonths === 0) {
    return `${years} year${years !== 1 ? 's' : ''}`;
  } else {
    return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
  }
}

function calculateTotalExperience(workExperience: any[]): number {
  const totalMonths = workExperience.reduce((total, exp) => {
    if (!exp.startDate) return total;
    
    const start = new Date(exp.startDate + '-01');
    const end = exp.isCurrentJob ? new Date() : (exp.endDate ? new Date(exp.endDate + '-01') : new Date());
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    
    return total + Math.max(0, months);
  }, 0);
  
  return Math.round(totalMonths / 12 * 10) / 10; // Round to 1 decimal place
}

function getFallbackJobAnalysis(resumeData: ResumeData, jobDescription: string) {
  // Harsh fallback analysis when AI fails
  const totalExperience = calculateTotalExperience(resumeData.workExperience);
  const hasProjects = resumeData.projects && resumeData.projects.length > 0;
  const hasCertifications = resumeData.certifications && resumeData.certifications.length > 0;
  const hasStrongSummary = resumeData.personalInfo.summary && resumeData.personalInfo.summary.length > 100;
  
  let score = 30; // Start harsh
  let verdict = "REJECT";
  
  if (totalExperience >= 3) score += 20;
  if (hasProjects) score += 15;
  if (hasCertifications) score += 10;
  if (hasStrongSummary) score += 10;
  if (resumeData.skills.length >= 10) score += 15;
  
  if (score >= 70) verdict = "STRONG_MATCH";
  else if (score >= 55) verdict = "INTERVIEW";
  else if (score >= 40) verdict = "MAYBE";
  
  return {
    compatibilityScore: Math.min(score, 85), // Cap at 85 for fallback
    verdict,
    harshFeedback: totalExperience < 2 ? 
      "Insufficient experience for most professional roles. This looks like an entry-level candidate trying to punch above their weight." :
      "Average candidate with standard qualifications. Nothing exceptional that would make them stand out from the competition.",
    criticalGaps: [
      {
        category: "EXPERIENCE",
        gap: "Limited demonstrable experience",
        severity: totalExperience < 1 ? "DEALBREAKER" : "MAJOR",
        harshComment: "Experience claims don't match the complexity of work typically expected"
      }
    ],
    strengths: resumeData.skills.length > 5 ? 
      [{ point: "Has listed multiple technical skills", relevance: "MEDIUM" }] : 
      [{ point: "At least submitted a resume", relevance: "LOW" }],
    redFlags: [
      !hasStrongSummary ? "Weak or missing professional summary" : null,
      !hasProjects ? "No projects to demonstrate practical skills" : null,
      totalExperience < 1 ? "Extremely limited professional experience" : null
    ].filter(Boolean),
    improvements: [
      {
        action: "Gain more hands-on experience through real projects",
        timeframe: "6-12 months minimum",
        difficulty: "HARD",
        honestAssessment: "Will require significant time investment and likely starting at a lower level than desired"
      }
    ],
    competitionAnalysis: {
      candidateLevel: totalExperience < 1 ? "BEGINNER" : totalExperience < 3 ? "JUNIOR" : "MID",
      jobLevel: "UNKNOWN",
      realityCheck: "Competing against candidates with more substantial experience and proven track records"
    },
    salaryReality: {
      theirWorth: totalExperience < 2 ? "Entry-level compensation" : "Junior to mid-level compensation",
      jobExpectation: "Depends on job requirements",
      gap: "Likely expecting more than current market value justifies"
    }
  };
}
