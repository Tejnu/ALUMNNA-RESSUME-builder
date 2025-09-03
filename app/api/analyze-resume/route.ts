import { NextRequest, NextResponse } from 'next/server';
import { ResumeData } from '@/types/resume';

export async function POST(request: NextRequest) {
  try {
    const { resumeData } = await request.json();
    
    if (!resumeData) {
      return NextResponse.json({ error: 'Resume data is required' }, { status: 400 });
    }

    const analysis = await analyzeResumeWithAI(resumeData);
    
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Resume analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze resume' },
      { status: 500 }
    );
  }
}

async function analyzeResumeWithAI(resumeData: ResumeData) {
  const apiKey = process.env.GEMINI_API_KEY || "AIzaSyCz2zg2PZ_QkmN8F18ov_RnhVP0T0PKM4A";
  
  // Prepare resume content for analysis
  const resumeText = prepareResumeForAnalysis(resumeData);
  
  const prompt = `
Analyze this resume and provide personalized feedback. Be specific and actionable based on the actual content provided.

Resume Content:
${resumeText}

Please analyze and return a JSON response with the following structure:
{
  "score": number (0-100),
  "issues": [
    {
      "id": "unique-id",
      "type": "error" | "warning" | "info",
      "title": "Issue Title",
      "description": "Specific description based on the resume content",
      "severity": "critical" | "high" | "medium" | "low",
      "suggestion": "Specific actionable suggestion"
    }
  ],
  "strengths": [
    "List of specific strengths found in this resume"
  ],
  "suggestions": [
    {
      "id": "unique-id",
      "title": "Suggestion Title",
      "description": "Specific suggestion based on resume analysis",
      "impact": "high" | "medium" | "low",
      "category": "Content" | "Structure" | "Keywords" | "Experience" | "Skills"
    }
  ],
  "atsCompatibility": number (0-100),
  "readabilityScore": number (0-100),
  "completenessScore": number (0-100)
}

Analysis Guidelines:
1. Check if professional summary exists and is compelling (2-3 sentences that highlight key value proposition)
2. Look for quantified achievements (numbers, percentages, metrics) in work experience
3. Assess if skills are relevant and properly categorized
4. Check for appropriate work experience descriptions
5. Evaluate education section completeness
6. Look for gaps or missing sections
7. Assess overall structure and formatting
8. Check for industry-specific keywords
9. Evaluate length and conciseness
10. Look for consistency in formatting and dates

Be specific about what's actually missing or weak in THIS resume, not generic advice. If the resume already has good quantified achievements, don't suggest adding them. If it has a good summary, praise it instead of suggesting to add one.
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
      return getFallbackAnalysis(resumeData);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      return getFallbackAnalysis(resumeData);
    }

    // Extract JSON from AI response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const analysisResult = JSON.parse(jsonMatch[0]);
        return analysisResult;
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        return getFallbackAnalysis(resumeData);
      }
    }

    return getFallbackAnalysis(resumeData);
  } catch (error) {
    console.error('AI analysis failed:', error);
    return getFallbackAnalysis(resumeData);
  }
}

function prepareResumeForAnalysis(resumeData: ResumeData): string {
  let content = `
PERSONAL INFORMATION:
Name: ${resumeData.personalInfo.fullName || 'Not provided'}
Email: ${resumeData.personalInfo.email || 'Not provided'}
Phone: ${resumeData.personalInfo.phone || 'Not provided'}
Location: ${resumeData.personalInfo.location || 'Not provided'}
LinkedIn: ${resumeData.personalInfo.linkedin || 'Not provided'}
Website: ${resumeData.personalInfo.website || 'Not provided'}

PROFESSIONAL SUMMARY:
${resumeData.personalInfo.summary || 'No professional summary provided'}

WORK EXPERIENCE:
`;

  resumeData.workExperience.forEach((exp, index) => {
    content += `
${index + 1}. ${exp.position || 'No position'} at ${exp.company || 'No company'}
   Duration: ${exp.startDate || 'No start date'} - ${exp.endDate || (exp.isCurrentJob ? 'Present' : 'No end date')}
   Description: ${exp.description || 'No description provided'}
`;
  });

  content += `
EDUCATION:
`;

  resumeData.education.forEach((edu, index) => {
    content += `
${index + 1}. ${edu.degree || 'No degree'} in ${edu.field || 'No field'} 
   Institution: ${edu.institution || edu.school || 'No institution'}
   Graduation: ${edu.graduationDate || edu.endDate || 'No graduation date'}
`;
  });

  content += `
SKILLS:
`;

  resumeData.skills.forEach((skill, index) => {
    content += `${index + 1}. ${skill.name} (${skill.level}) - ${skill.category || 'No category'}\n`;
  });

  if (resumeData.projects && resumeData.projects.length > 0) {
    content += `
PROJECTS:
`;
    resumeData.projects.forEach((project, index) => {
      content += `
${index + 1}. ${project.title || project.name || 'No title'}
   Description: ${project.description || 'No description'}
   Technologies: ${Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies || 'None listed'}
`;
    });
  }

  if (resumeData.certifications && resumeData.certifications.length > 0) {
    content += `
CERTIFICATIONS:
`;
    resumeData.certifications.forEach((cert, index) => {
      content += `${index + 1}. ${cert.name} from ${cert.issuer} (${cert.date})\n`;
    });
  }

  return content;
}

function getFallbackAnalysis(resumeData: ResumeData) {
  // Basic analysis when AI fails
  const issues: any[] = [];
  const strengths: string[] = [];
  const suggestions: any[] = [];
  let score = 80;

  // Check for professional summary
  if (!resumeData.personalInfo.summary || resumeData.personalInfo.summary.length < 50) {
    issues.push({
      id: 'weak-summary',
      type: 'warning',
      title: 'Missing or Weak Professional Summary',
      description: 'Your resume lacks a compelling professional summary. Add a 2-3 sentence summary that highlights your key value proposition.',
      severity: 'critical',
      suggestion: 'Write a professional summary that includes your years of experience, key skills, and what value you bring to employers.'
    });
    score -= 20;
  } else {
    strengths.push('Strong professional summary provided');
  }

  // Check for quantified achievements
  const hasMetrics = resumeData.workExperience.some(exp => 
    /\d+%|\d+\+|\$\d+|increased|decreased|improved|reduced|\d+x|saved|generated|managed \$|budget of|\d+ years|\d+ people|\d+ team/i.test(exp.description)
  );

  if (!hasMetrics && resumeData.workExperience.length > 0) {
    issues.push({
      id: 'no-metrics',
      type: 'warning',
      title: 'Missing Quantified Achievements',
      description: 'Your work experience descriptions lack specific numbers and metrics that demonstrate your impact.',
      severity: 'high',
      suggestion: 'Add specific numbers, percentages, dollar amounts, or other metrics to show the results of your work.'
    });
    score -= 15;
  } else if (hasMetrics) {
    strengths.push('Includes quantified achievements');
  }

  return {
    score: Math.max(score, 0),
    issues,
    strengths,
    suggestions,
    atsCompatibility: 75,
    readabilityScore: 80,
    completenessScore: resumeData.workExperience.length > 0 ? 85 : 60
  };
}
