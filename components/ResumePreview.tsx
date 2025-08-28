
'use client';

import { ResumeData } from '@/types/resume';
import { ModernTemplate } from './templates/ModernTemplate';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { ExecutiveTemplate } from './templates/ExecutiveTemplate';
import { TechnicalTemplate } from './templates/TechnicalTemplate';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Maximize2, ZoomIn, ZoomOut, Eye, FileText, Sparkles } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ResumePreviewProps {
  resumeData: ResumeData;
}

export function ResumePreview({ resumeData }: ResumePreviewProps) {
  const [zoom, setZoom] = useState(0.8);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  // Safety check for resumeData
  if (!resumeData || !resumeData.personalInfo) {
    return (
      <Card className="card-modern sticky top-24 h-fit overflow-hidden">
        <div className="p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Preview</h3>
              <p className="text-gray-500">Upload a resume or start building to see your live preview</p>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-purple-600">
              <Sparkles className="h-4 w-4" />
              <span>Real-time updates</span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  const renderTemplate = () => {
    const { selectedTemplate } = resumeData;

    switch (selectedTemplate) {
      case 'modern':
        return <ModernTemplate resumeData={resumeData} />;
      case 'classic':
        return <ClassicTemplate resumeData={resumeData} />;
      case 'minimal':
        return <MinimalTemplate resumeData={resumeData} />;
      case 'creative':
        return <CreativeTemplate resumeData={resumeData} />;
      case 'executive':
        return <ExecutiveTemplate resumeData={resumeData} />;
      case 'technical':
        return <TechnicalTemplate resumeData={resumeData} />;
      default:
        return <ModernTemplate resumeData={resumeData} />;
    }
  };

  // Load html2pdf library
  useEffect(() => {
    const loadHtml2PdfScript = () => {
      if (document.querySelector('script[src*="html2pdf"]')) return;
      
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.async = true;
      script.onload = () => {
        console.log('html2pdf loaded successfully');
      };
      document.body.appendChild(script);
    };
    
    if (typeof window !== 'undefined') {
      loadHtml2PdfScript();
    }
  }, []);

  const downloadPDF = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    
    try {
      const element = document.getElementById('resume-preview-content');
      if (!element) {
        throw new Error('Resume preview element not found');
      }

      const fileName = `${resumeData.personalInfo?.fullName?.replace(/\s+/g, '_') || 'Resume'}_${resumeData.selectedTemplate}.pdf`;
      
      // Check if html2pdf is available
      if (!(window as any).html2pdf) {
        throw new Error('PDF library not loaded');
      }

      const options = {
        margin: 0.5,
        filename: fileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false
        },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      const html2pdf = (window as any).html2pdf;
      await html2pdf().set(options).from(element).save();
      
    } catch (error) {
      console.error('Error downloading PDF:', error);
      
      // Fallback to print method
      const element = document.getElementById('resume-preview-content');
      if (element) {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${resumeData.personalInfo?.fullName || 'Resume'} - Resume</title>
                <style>
                  * { margin: 0; padding: 0; box-sizing: border-box; }
                  body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    line-height: 1.5;
                    color: #1f2937;
                    background: white;
                  }
                  @page { margin: 0.5in; size: letter; }
                  @media print { body { -webkit-print-color-adjust: exact; } }
                  .resume-content { width: 100%; background: white; }
                </style>
              </head>
              <body>
                <div class="resume-content">
                  ${element.innerHTML}
                </div>
                <script>
                  window.onload = function() {
                    setTimeout(() => { 
                      window.print(); 
                      setTimeout(() => window.close(), 500); 
                    }, 1000);
                  };
                </script>
              </body>
            </html>
          `);
          printWindow.document.close();
        }
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="card-modern sticky top-24 h-fit overflow-hidden border-0 shadow-xl">
      <div className="p-6">
        {/* Enhanced Header with Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Eye className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span>Real-time updates</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.max(0.4, zoom - 0.1))}
              className="text-xs px-3 py-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <div className="bg-gray-100 px-3 py-1 rounded-lg">
              <span className="text-sm font-medium text-gray-700">
                {Math.round(zoom * 100)}%
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
              className="text-xs px-3 py-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="px-3 py-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Enhanced Preview Container */}
        <div 
          className={`relative bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl overflow-hidden transition-all duration-500 ${
            isFullscreen ? 'fixed inset-0 z-50 p-6 pt-20 overflow-y-auto bg-gray-900/95 backdrop-blur-sm' : ''
          } ${isHovering ? 'shadow-2xl scale-[1.02]' : 'shadow-lg'}`}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Floating action buttons for fullscreen */}
          {isFullscreen && (
            <div className="fixed top-6 right-6 z-[60] flex space-x-3">
              <Button
                onClick={downloadPDF}
                disabled={isDownloading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg"
              >
                {isDownloading ? (
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                {isDownloading ? 'Generating...' : 'Download PDF'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsFullscreen(false)}
                className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg"
              >
                Exit Fullscreen
              </Button>
            </div>
          )}

          {/* Resume Content */}
          <div
            className="bg-white shadow-2xl mx-auto transition-all duration-500 ease-out"
            ref={resumeRef}
            style={{
              width: isFullscreen ? '210mm' : '100%',
              maxWidth: isFullscreen ? '210mm' : '100%',
              minHeight: isFullscreen ? '297mm' : '600px',
              height: isFullscreen ? 'auto' : '700px',
              transform: isFullscreen ? 'none' : `scale(${zoom})`,
              transformOrigin: 'top center',
              marginBottom: isFullscreen ? '20px' : '0',
              borderRadius: isFullscreen ? '8px' : '12px',
            }}
          >
            <div
              id="resume-preview-content"
              className="h-full overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
              style={{
                fontSize: isFullscreen ? '14px' : '12px',
                lineHeight: '1.5'
              }}
            >
              {renderTemplate()}
            </div>
          </div>

          {/* Interactive overlay for non-fullscreen */}
          {!isFullscreen && isHovering && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none">
              <div className="absolute bottom-4 left-4 right-4 flex justify-center">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
                  <span className="text-sm font-medium text-gray-700">Click fullscreen for better view</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Download Button */}
        {!isFullscreen && (
          <div className="mt-6">
            <Button
              onClick={downloadPDF}
              disabled={isDownloading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 text-base py-3 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {isDownloading ? (
                <>
                  <div className="h-5 w-5 mr-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-3" />
                  Download Professional PDF
                </>
              )}
            </Button>
          </div>
        )}

        {/* Enhanced Template Info */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 capitalize">
                  {resumeData.selectedTemplate} Template
                </p>
                <p className="text-xs text-gray-600">
                  ATS-optimized • Professional formatting
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-150"></div>
              </div>
              <span className="text-xs text-purple-600 font-medium">Live</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
