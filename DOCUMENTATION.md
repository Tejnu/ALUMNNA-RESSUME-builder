# Alumna AI Resume Builder - Project Documentation

## Overview

Alumna is an AI-powered resume builder application that helps users create professional resumes, analyze their match with job descriptions, and optimize their applications for Applicant Tracking Systems (ATS).

## Technologies Used

### Frontend
- **Next.js 13+**: React framework for server-side rendering and static site generation
- **TypeScript**: For type-safe code
- **Tailwind CSS**: For styling and responsive design
- **Shadcn UI**: Component library built on Tailwind CSS
- **Lucide Icons**: SVG icon library

### AI Integration
- **Google Gemini API**: Used for job matching analysis and resume optimization
- **PDF Parsing**: For extracting content from uploaded resumes

## Current Features

1. **Resume Builder**:
   - Form-based resume creation with multiple sections
   - Real-time preview
   - Multiple template options

2. **Resume Analyzer**:
   - PDF upload and parsing
   - Content extraction and organization

3. **Job Match Analyzer**:
   - Job description analysis
   - Resume-to-job matching
   - ATS score calculation
   - Optimization suggestions

4. **Smart Suggestions**:
   - AI-powered content improvement
   - Keyword optimization

## API Requirements

### Current API Keys Required

1. **Google Gemini API Key**:
   - Required for the Job Match Analyzer
   - Must be added as an environment variable: `NEXT_PUBLIC_GEMINI_API_KEY`
   - Can be obtained from [Google AI Studio](https://ai.google.dev/)

### How to Configure API Keys

1. Create a `.env.local` file in the project root
2. Add the following line:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```
3. Restart the development server

## Future Development Roadmap

### Short-term Improvements

1. **Enhanced Job Match Analysis**:
   - More detailed skill gap analysis
   - Industry-specific keyword recommendations
   - Competitor analysis

2. **Resume Export Options**:
   - Additional export formats (DOCX, plain text)
   - Custom styling options

3. **User Accounts**:
   - Save multiple resumes
   - Track job applications
   - Save job match history

### Long-term Vision

1. **Interview Preparation**:
   - AI-generated interview questions based on resume and job description
   - Practice interview simulations

2. **Career Path Planning**:
   - Skill gap analysis for career progression
   - Learning resource recommendations

3. **Integration with Job Boards**:
   - Direct application submission
   - Job recommendation engine

## Additional API Keys for Future Features

1. **OpenAI API Key**:
   - For more advanced content generation and interview preparation
   - Would be configured as `NEXT_PUBLIC_OPENAI_API_KEY`

2. **LinkedIn API**:
   - For importing profile data and job searching
   - Would require OAuth integration

3. **Job Board APIs** (Indeed, LinkedIn, etc.):
   - For job search and application tracking
   - Would require individual API keys and OAuth setup

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables (see API Requirements)
4. Run the development server:
   ```
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Build and Deployment

1. Build the application:
   ```
   npm run build
   ```
2. Start the production server:
   ```
   npm start
   ```

The application is configured for deployment on Vercel or Netlify with minimal setup.

## Contribution Guidelines

1. Follow the existing code style and component structure
2. Add comprehensive tests for new features
3. Document API changes and new environment variables
4. Keep dependencies updated and secure

---

*This documentation is a living document and will be updated as the project evolves.*