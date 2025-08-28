import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alumna - AI-Powered Resume Builder',
  description: 'Create professional resumes with AI assistance. Build, optimize, and download your perfect resume in minutes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}