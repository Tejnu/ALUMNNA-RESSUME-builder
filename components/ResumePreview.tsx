'use client';

import { ResumeData } from '@/types/resume';
import { ModernTemplate } from './templates/ModernTemplate';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { ExecutiveTemplate } from './templates/ExecutiveTemplate'; // Added
import { TechnicalTemplate } from './templates/TechnicalTemplate'; // Added
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react'; // Added useEffect

interface ResumePreviewProps {
  resumeData: ResumeData;
}

export function ResumePreview({ resumeData }: ResumePreviewProps) {
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false); // Added state for download status
  const resumeRef = useRef<HTMLDivElement>(null); // Added ref for the resume content

  // Safety check for resumeData
  if (!resumeData || !resumeData.personalInfo) {
    return (
      <Card className="bg-white border border-gray-200 shadow-sm sticky top-24 h-fit">
        <div className="p-6">
          <div className="text-center text-gray-500">
            <div className="mb-2">📄</div>
            <p>Upload a resume to see the live preview</p>
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

  // Load html2pdf only on client side
  useEffect(() => {
    // This ensures the script only loads in the browser, not during SSR
    const loadHtml2PdfScript = () => {
      if (document.querySelector('script[src*="html2pdf"]')) return;
      
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.async = true;
      script.onload = () => {
        console.log('html2pdf loaded successfully');
      };
      script.onerror = (e) => {
        console.error('Failed to load html2pdf:', e);
      };
      document.body.appendChild(script);
    };
    
    if (typeof window !== 'undefined') {
      loadHtml2PdfScript();
    }
  }, []);

  const handleDownloadPDF = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    
    try {
      // Check if html2pdf is loaded
      if (typeof window === 'undefined') {
        console.error('Window is undefined');
        setIsDownloading(false);
        return;
      }
      
      // Dynamically load jspdf and html2canvas if not already loaded
      if (!(window as any).html2pdf) {
        console.log('Loading PDF libraries...');
        
        // Load jsPDF and html2canvas
        const jsPDFScript = document.createElement('script');
        jsPDFScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        jsPDFScript.async = true;
        
        const html2canvasScript = document.createElement('script');
        html2canvasScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        html2canvasScript.async = true;
        
        const loadPromise = Promise.all([
          new Promise<void>((resolve, reject) => {
            jsPDFScript.onload = () => resolve();
            jsPDFScript.onerror = (e) => reject(e);
          }),
          new Promise<void>((resolve, reject) => {
            html2canvasScript.onload = () => resolve();
            html2canvasScript.onerror = (e) => reject(e);
          })
        ]);
        
        document.body.appendChild(jsPDFScript);
        document.body.appendChild(html2canvasScript);
        
        try {
          await loadPromise;
          console.log('PDF libraries loaded successfully');
        } catch (e) {
          console.error('Failed to load PDF libraries:', e);
          alert('Failed to load PDF generation libraries. Please try again later.');
          setIsDownloading(false);
          return;
        }
      }
      
      const element = document.getElementById('resume-preview-content');
      if (!element) {
        console.error('Resume preview element not found');
        setIsDownloading(false);
        return;
      }

      // Get the template name for filename
      const templateName = resumeData.selectedTemplate || 'resume';
      const fileName = `${resumeData.personalInfo?.fullName?.replace(/\s+/g, '_') || 'Resume'}_${templateName}.pdf`;
      
      try {
        console.log('Starting PDF generation process');
        
        // Create a clone of the element to avoid modifying the original
        const clone = element.cloneNode(true) as HTMLElement;
        
        // Create a container with proper dimensions
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '-9999px';
        container.style.left = '-9999px';
        container.style.width = '210mm'; // A4 width
        container.style.height = 'auto';
        container.style.backgroundColor = 'white';
        
        // Apply necessary styles to the clone
        clone.style.width = '210mm';
        clone.style.margin = '0';
        clone.style.padding = '20px';
        clone.style.boxShadow = 'none';
        clone.style.transform = 'none';
        clone.style.backgroundColor = 'white';
        
        // Add the clone to the container
        container.appendChild(clone);
        
        // Add the container to the document
        document.body.appendChild(container);
        
        // Use html2canvas to capture the element
        const html2pdf = (window as any).html2pdf;
        
        if (!html2pdf) {
          throw new Error('PDF libraries not properly loaded');
        }
        
        // Add critical inline styles to force display of all elements
        const inlineStyles = `
          /* Force display of all resume elements */
          .resume-section, .resume-header, .resume-content, .template-container, 
          .resume-section *, .resume-header *, .resume-content *, .template-container * {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            height: auto !important;
            min-height: auto !important;
            overflow: visible !important;
            position: relative !important;
            color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Preserve inline elements */
          span, a, em, strong, i, b {
            display: inline !important;
          }
          
          /* Ensure images and SVGs display properly */
          img, svg {
            display: inline-block !important;
            max-width: 100% !important;
            visibility: visible !important;
            opacity: 1 !important;
          }
          
          /* Ensure consistent font rendering */
          * {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
            -webkit-font-smoothing: antialiased !important;
          }
          
          /* Force background colors to print */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        `;
        const styleElement = document.createElement('style');
        styleElement.textContent = inlineStyles;
        container.appendChild(styleElement);
        
        const options = {
          margin: [0, 0, 0, 0],
          filename: fileName,
          image: { type: 'jpeg', quality: 1 },
          html2canvas: { 
            scale: 3, // Higher scale for better quality
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: true,
            letterRendering: true,
            foreignObjectRendering: true, // Try with true for better rendering
            imageTimeout: 30000, // Longer timeout
            removeContainer: true,
            width: 794, // A4 width in pixels at 96 DPI
            height: 1123, // A4 height in pixels at 96 DPI
            scrollX: 0,
            scrollY: 0,
            onclone: (clonedDoc) => {
              // Additional processing on the cloned document
              const clonedElement = clonedDoc.querySelector('#resume-preview-content');
              if (clonedElement) {
                console.log('Processing cloned document for PDF');
                // Force display of all elements in the cloned document
                const allElements = clonedElement.querySelectorAll('*');
                allElements.forEach(el => {
                  (el as HTMLElement).style.display = 'block';
                  (el as HTMLElement).style.visibility = 'visible';
                  (el as HTMLElement).style.opacity = '1';
                });
              }
            }
          },
          jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true,
            hotfixes: ["px_scaling"],
            precision: 16 // Higher precision
          }
        };

        console.log('Starting PDF generation');
        await html2pdf.from(container).set(options).save();
        console.log('PDF generation completed');

        // Clean up
        document.body.removeChild(container);
      } catch (pdfError) {
        console.error('Error in PDF generation process:', pdfError);
        
        // Try alternative method with direct html2pdf if available
        try {
          console.log('Trying alternative PDF generation method');
          const html2pdf = (window as any).html2pdf;
          
          const options = {
            margin: [0, 0, 0, 0],
            filename: fileName,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
          };
          
          await html2pdf().from(element).set(options).save();
          console.log('Alternative PDF generation successful');
        } catch (altError) {
          console.error('Alternative PDF method also failed:', altError);
          throw altError; // Re-throw to be caught by the outer try-catch
        }
      }

    } catch (error) {
      console.error('Error downloading PDF:', error);

      // Fallback to print method
      try {
        const element = document.getElementById('resume-preview-content');
        if (element) {
          console.log('Using print fallback method');
          const printWindow = window.open('', '_blank');
          if (printWindow) {
            printWindow.document.write(`
              <!DOCTYPE html>
              <html>
                <head>
                  <title>${resumeData.personalInfo?.fullName || 'Resume'} - Resume</title>
                  <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.5; color: #333; background: white; }
                    @page { size: A4; margin: 0.75in; }
                    @media print { body { margin: 0; } }
                    .resume-container { width: 210mm; margin: 0 auto; padding: 20px; background: white; }
                  </style>
                </head>
                <body>
                  <div class="resume-container">
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
          } else {
            alert('Could not open print window. Please check your browser settings and try again.');
          }
        } else {
          alert('Could not find resume content for printing. Please try again.');
        }
      } catch (printError) {
        console.error('Error in print fallback:', printError);
        alert('Could not generate PDF. Please try again later.');
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-sm sticky top-24 h-fit">
      <div className="p-6">
        {/* Header with Controls */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
              className="text-xs px-2 py-1 border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-600 min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.min(2, zoom + 0.1))}
              className="text-xs px-2 py-1 border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="rounded-lg border-gray-300"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 text-sm px-4 py-2 disabled:opacity-50 transition-all duration-200"
            >
              {isDownloading ? (
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              {isDownloading ? 'Preparing...' : 'Download PDF'}
            </Button>
          </div>
        </div>

        {/* Preview Container */}
        <div className={`bg-gray-50 border-2 border-gray-200 rounded-2xl overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 p-6 pt-20 overflow-y-auto' : ''}`}>
          {isFullscreen && (
            <div className="fixed bottom-4 right-4 z-[60]">
              <Button
                variant="outline"
                onClick={() => setIsFullscreen(false)}
                className="rounded-lg border-gray-300 bg-white shadow-md"
              >
                Exit Fullscreen
              </Button>
            </div>
          )}

          <div
            className="bg-white shadow-2xl mx-auto overflow-auto"
            ref={resumeRef}
            style={{
              width: isFullscreen ? '210mm' : '100%',
              maxWidth: isFullscreen ? '210mm' : '820px',
              height: isFullscreen ? 'auto' : '840px',
              minHeight: isFullscreen ? '297mm' : 'auto',
              transform: isFullscreen ? 'none' : `scale(${zoom})`,
              transformOrigin: 'top center',
              transition: 'all 0.3s ease',
              marginBottom: isFullscreen ? '20px' : '0'
            }}
          >
            <div
              id="resume-preview-content"
              className="h-full overflow-auto"
              style={{
                fontSize: isFullscreen ? '12px' : '12px',
                lineHeight: '1.4'
              }}
            >
              {renderTemplate()}
            </div>
          </div>
        </div>

        {/* Template Info */}
        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 capitalize">
                {resumeData.selectedTemplate} Template
              </p>
              <p className="text-xs text-gray-600">
                Optimized for ATS systems
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <span className="text-xs text-black font-medium">Live</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
