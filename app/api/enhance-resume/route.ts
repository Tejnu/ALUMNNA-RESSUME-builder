import { NextRequest, NextResponse } from 'next/server';

interface EnhancementRequest {
  resumeData: any;
  enhancementType: 'comprehensive' | 'skills' | 'summary' | 'experience' | 'keywords';
}

interface EnhancementSuggestion {
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

function prepareResumeForAnalysis(resumeData: any): string {
  return `
PERSONAL INFO:
Name: ${resumeData.personalInfo?.fullName || 'Not provided'}
Title: ${resumeData.personalInfo?.title || 'Not provided'}
Email: ${resumeData.personalInfo?.email || 'Not provided'}
Phone: ${resumeData.personalInfo?.phone || 'Not provided'}
Location: ${resumeData.personalInfo?.location || 'Not provided'}
Summary: ${resumeData.personalInfo?.summary || 'Not provided'}

WORK EXPERIENCE:
${resumeData.workExperience?.map((exp: any, index: number) => `
${index + 1}. ${exp.position || 'Not provided'} at ${exp.company || 'Not provided'}
   Duration: ${exp.startDate || 'Not provided'} - ${exp.isCurrentJob ? 'Present' : exp.endDate || 'Not provided'}
   Description: ${exp.description || 'Not provided'}
`).join('') || 'No work experience provided'}

EDUCATION:
${resumeData.education?.map((edu: any, index: number) => `
${index + 1}. ${edu.degree || 'Not provided'} in ${edu.field || 'Not provided'}
   School: ${edu.school || 'Not provided'}
   Graduation: ${edu.graduationDate || 'Not provided'}
   GPA: ${edu.gpa || 'Not provided'}
`).join('') || 'No education provided'}

SKILLS:
${resumeData.skills?.map((skill: any) => `- ${skill.name} (${skill.level || 'Not specified'})`).join('\n') || 'No skills provided'}

PROJECTS:
${resumeData.projects?.map((project: any, index: number) => `
${index + 1}. ${project.name || 'Not provided'}
   Description: ${project.description || 'Not provided'}
   Technologies: ${Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies || 'Not provided'}
   URL: ${project.url || 'Not provided'}
`).join('') || 'No projects provided'}

CERTIFICATIONS:
${resumeData.certifications?.map((cert: any) => `- ${cert.name} from ${cert.issuer} (${cert.date})`).join('\n') || 'No certifications provided'}

LANGUAGES:
${resumeData.languages?.map((lang: any) => `- ${lang.language}: ${lang.proficiency}`).join('\n') || 'No languages provided'}
  `.trim();
}

async function generateEnhancementsWithAI(resumeData: any, enhancementType: string): Promise<EnhancementSuggestion[]> {
  try {
    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyCz2zg2PZ_QkmN8F18ov_RnhVP0T0PKM4A";
    
    const resumeText = prepareResumeForAnalysis(resumeData);
    
    const prompt = `You are an elite resume optimization expert with 15+ years of experience helping professionals land top-tier positions. Analyze this resume and provide SPECIFIC, ACTIONABLE improvements.

CURRENT RESUME:
${resumeText}

ANALYSIS REQUIREMENTS:
1. Provide specific, professional improvements that can be directly applied
2. Focus on current job market trends and ATS optimization
3. Suggest quantifiable achievements where possible
4. Enhance action words and impact statements
5. Ensure all suggestions are relevant to the candidate's actual experience

Return a JSON response with this exact structure:
{
  "suggestions": [
    {
      "id": "unique_id",
      "type": "skill|summary|experience|keyword|section",
      "title": "Clear improvement title",
      "description": "Detailed explanation of why this improvement matters",
      "priority": "critical|high|medium|low",
      "confidence": 85,
      "impact": "Specific impact statement",
      "category": "Skills|Content|Experience|Keywords|Formatting",
      "before": "Current text (if applicable)",
      "after": "Improved version",
      "applicableData": {
        "section": "which section to modify",
        "index": "index if array item",
        "field": "specific field to update",
        "value": "new value to apply"
      }
    }
  ]
}

FOCUS AREAS:
- Professional summary enhancement with stronger action words
- Experience descriptions with quantified achievements
- Skills optimization for current market demands
- ATS-friendly keyword integration
- Professional formatting improvements
- Missing critical sections

Provide 6-10 high-impact suggestions that are immediately actionable.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      console.log('Gemini API request failed:', response.status);
      return getFallbackSuggestions(resumeData);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    // Clean the response to extract JSON
    let jsonText = text;
    if (jsonText.includes('```json')) {
      jsonText = jsonText.split('```json')[1].split('```')[0];
    } else if (jsonText.includes('```')) {
      jsonText = jsonText.split('```')[1].split('```')[0];
    }
    
    const parsed = JSON.parse(jsonText.trim());
    return parsed.suggestions || [];
    
  } catch (error) {
    console.error('AI enhancement generation failed:', error);
    return getFallbackSuggestions(resumeData);
  }
}

function getFallbackSuggestions(resumeData: any): EnhancementSuggestion[] {
  const suggestions: EnhancementSuggestion[] = [];
  
  // Professional summary enhancement
  if (!resumeData.personalInfo?.summary || resumeData.personalInfo.summary.length < 100) {
    suggestions.push({
      id: 'summary_enhancement',
      type: 'summary',
      title: 'Enhance Professional Summary',
      description: 'Create a compelling professional summary that highlights your key achievements and value proposition',
      priority: 'high',
      confidence: 90,
      impact: 'Increases recruiter engagement by 65%',
      category: 'Content',
      after: 'Results-driven professional with expertise in modern technologies and proven track record of delivering high-impact solutions. Experienced in leading cross-functional teams and driving organizational growth through innovative approaches.',
      applicableData: {
        section: 'personalInfo',
        field: 'summary',
        value: 'Results-driven professional with expertise in modern technologies and proven track record of delivering high-impact solutions. Experienced in leading cross-functional teams and driving organizational growth through innovative approaches.'
      }
    });
  }
  
  // Skills enhancement
  const currentSkills = resumeData.skills?.map((s: any) => s.name.toLowerCase()) || [];
  const marketSkills = ['Problem Solving', 'Team Leadership', 'Project Management', 'Communication', 'Critical Thinking'];
  const missingSkills = marketSkills.filter(skill => 
    !currentSkills.includes(skill.toLowerCase())
  );
  
  if (missingSkills.length > 0) {
    suggestions.push({
      id: 'skills_enhancement',
      type: 'skill',
      title: 'Add In-Demand Skills',
      description: 'Include highly sought-after skills that are trending in the current job market',
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
}

export async function POST(request: NextRequest) {
  try {
    const body: EnhancementRequest = await request.json();
    const { resumeData, enhancementType } = body;

    if (!resumeData) {
      return NextResponse.json(
        { error: 'Resume data is required' },
        { status: 400 }
      );
    }

    const suggestions = await generateEnhancementsWithAI(resumeData, enhancementType);

    return NextResponse.json({
      success: true,
      suggestions,
      enhancementType,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Resume enhancement API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate resume enhancements',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
