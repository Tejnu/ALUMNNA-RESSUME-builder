'use client';

import { ResumeData } from '@/types/resume';

interface DataDebugProps {
  data: ResumeData;
  title?: string;
}

export function DataDebug({ data, title = "Resume Data" }: DataDebugProps) {
  const logData = () => {
    console.log(`${title}:`, data);
    console.log('Personal Info:', data.personalInfo);
    console.log('Work Experience:', data.workExperience);
    console.log('Education:', data.education);
    console.log('Skills:', data.skills);
    console.log('Projects:', data.projects);
  };

  return (
    <div className="bg-yellow-100 border border-yellow-400 p-4 rounded-lg mb-4">
      <h3 className="font-bold text-yellow-800 mb-2">{title} Debug</h3>
      <button 
        onClick={logData}
        className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
      >
        Log Data to Console
      </button>
      <div className="mt-2 text-xs text-yellow-700">
        <p>Personal Info Fields: {Object.keys(data.personalInfo || {}).length}</p>
        <p>Work Experience: {data.workExperience?.length || 0} entries</p>
        <p>Education: {data.education?.length || 0} entries</p>
        <p>Skills: {data.skills?.length || 0} entries</p>
        <p>Projects: {data.projects?.length || 0} entries</p>
      </div>
    </div>
  );
}
