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
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
          async
          onLoad={() => {
            if (typeof window !== 'undefined') {
              console.log('html2pdf loaded successfully');
            }
          }}
        />
      </body>
    </html>
  );
}