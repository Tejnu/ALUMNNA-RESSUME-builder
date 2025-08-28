
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30; // Reduced to 30 seconds for Vercel compatibility

export async function POST(req: Request) {
  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  };

  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    
    if (!file) {
      return new NextResponse(
        JSON.stringify({ error: 'No file provided' }), 
        { status: 400, headers }
      );
    }

    // Validate file type
    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid file type. Please upload a PDF file.' }), 
        { status: 400, headers }
      );
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return new NextResponse(
        JSON.stringify({ error: 'File too large. Please upload a file smaller than 10MB.' }), 
        { status: 400, headers }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    let extractedText = '';

    try {
      // Enhanced PDF text extraction using multiple methods
      extractedText = await extractTextFromPDF(buffer);
      
      if (!extractedText || extractedText.length < 10) {
        throw new Error('No readable text found');
      }
      
      console.log('PDF parse successful, text length:', extractedText.length);
      
    } catch (parseError) {
      console.error('PDF parsing failed:', parseError);
      return new NextResponse(
        JSON.stringify({ 
          error: 'Unable to parse PDF. The file may be image-based or password-protected. Please try uploading a DOCX or TXT file instead.',
          details: parseError instanceof Error ? parseError.message : 'PDF parsing failed'
        }), 
        { status: 400, headers }
      );
    }

    // Clean up the extracted text
    const cleanText = cleanExtractedText(extractedText);

    // Use Gemini AI to structure the resume data
    const structuredData = await structureResumeWithAI(cleanText);

    const response = {
      text: cleanText,
      structuredData: structuredData,
      pages: 1,
      info: {
        title: file.name || 'Resume',
        author: '',
        subject: ''
      }
    };

    return new NextResponse(
      JSON.stringify(response), 
      { status: 200, headers }
    );
    
  } catch (error) {
    console.error('PDF parsing API error:', error);
    
    return new NextResponse(
      JSON.stringify({ 
        error: 'PDF parsing service encountered an error. Please try uploading a DOCX or TXT file instead.',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { status: 500, headers }
    );
  }
}

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Try pdf-parse with optimized settings for serverless environment
    const pdfParse = (await import('pdf-parse')).default;
    const result = await pdfParse(buffer, {
      max: 50, // Limit pages for faster processing
      version: 'default',
      normalizeWhitespace: true,
      disableCombineTextItems: false
    });
    
    if (result.text && result.text.length > 10) {
      return result.text;
    }
  } catch (error) {
    console.log('pdf-parse failed, using fallback methods');
  }

  // Simplified fallback extraction for serverless environment
  let extractedText = '';

  // Method 1: Basic UTF-8 extraction
  try {
    let utf8Text = buffer.toString('utf8');
    extractedText = utf8Text
      .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
      
    if (extractedText && extractedText.length > 50) {
      return extractedText;
    }
  } catch (error) {
    console.log('UTF-8 extraction failed');
  }
  
  // Method 2: Extract text from PDF streams (simplified)
  const bufferString = buffer.toString('binary');
  const textChunks: string[] = [];

  // Look for text between parentheses (common PDF text format)
  const parenthesesRegex = /\(([^)]+)\)/g;
  let match;
  while ((match = parenthesesRegex.exec(bufferString)) !== null) {
    if (match[1] && match[1].length > 1) {
      textChunks.push(match[1]);
    }
  }

  if (textChunks.length > 0) {
    extractedText = textChunks.join(' ');
  }

  if (!extractedText || extractedText.length < 10) {
    throw new Error('No readable text could be extracted from PDF');
  }

  return extractedText;
}

function cleanExtractedText(text: string): string {
  return text
    .replace(/\x00/g, '') // Remove null bytes
    .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ') // Remove control characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/(.)\1{5,}/g, '$1') // Remove excessive repeated characters
    .trim();
}

async function structureResumeWithAI(text: string): Promise<any> {
  try {
    // Use environment variable for API key in production
    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyCz2zg2PZ_QkmN8F18ov_RnhVP0T0PKM4A";
    if (!apiKey || text.length < 20) return null;

    // Limit text length for faster processing
    const truncatedText = text.slice(0, 8000);

    const prompt = {
      contents: [{
        role: 'user',
        parts: [{
          text: `Extract resume information from this text and return ONLY valid JSON:

${truncatedText}

Return this exact structure:
{
  "personalInfo": {
    "fullName": "name_here",
    "email": "email_here", 
    "phone": "phone_here",
    "location": "location_here",
    "summary": "summary_here"
  },
  "workExperience": [
    {
      "company": "company_name",
      "position": "job_title", 
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "description": "job_description"
    }
  ],
  "skills": ["skill1", "skill2"],
  "education": [
    {
      "school": "school_name",
      "degree": "degree_type",
      "field": "field_of_study",
      "graduationDate": "YYYY-MM"
    }
  ]
}`
        }]
      }]
    };

    // Set shorter timeout for Vercel
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prompt),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.log('Gemini API request failed:', response.status);
        return null;
      }

      const data = await response.json();
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      if (!aiText) return null;

      // Extract JSON from response
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return null;

      try {
        const structuredData = JSON.parse(jsonMatch[0]);
        console.log('AI structured data successfully');
        return structuredData;
      } catch (jsonError) {
        console.log('JSON parsing failed:', jsonError);
        return null;
      }
    } catch (fetchError) {
      console.log('Fetch error:', fetchError);
      return null;
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.log('AI structuring failed:', error);
    return null;
  }
}
