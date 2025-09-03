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
import { useState, useRef, useEffect, useCallback } from 'react';

interface ResumePreviewProps {
  resumeData: ResumeData;
  onDownloadPDFReady?: (downloadFn: () => Promise<void>) => void;
}

export function ResumePreview({ resumeData, onDownloadPDFReady }: ResumePreviewProps) {
  const [zoom, setZoom] = useState(0.8);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadStatus, setDownloadStatus] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);
  
  // Global download lock to prevent multiple simultaneous downloads
  const downloadLockRef = useRef(false);

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
      document.body.appendChild(script);
    };
    
    if (typeof window !== 'undefined') {
      loadHtml2PdfScript();
    }
  }, []);

  // Expose downloadPDF function to parent component with debouncing
  useEffect(() => {
    if (onDownloadPDFReady) {
      // Create a debounced version to prevent multiple rapid calls
      const debouncedDownload = async () => {
        if (!downloadLockRef.current) {
          await downloadPDF();
        }
      };
      onDownloadPDFReady(debouncedDownload);
    }
  }, [onDownloadPDFReady]); // Keep dependency but ensure downloadPDF is stable

  const downloadPDF = useCallback(async () => {
    // Prevent multiple simultaneous downloads
    if (isDownloading || downloadLockRef.current) {
      console.log('Download already in progress, skipping...');
      return;
    }
    
    downloadLockRef.current = true;
    setIsDownloading(true);
    setDownloadProgress(0);
    setDownloadStatus('Preparing resume for download...');
    
    try {
      // Get ONLY the resume content element
      const element = document.getElementById('resume-preview-content');
      if (!element) {
        throw new Error('Resume preview element not found');
      }

      const fileName = `${resumeData.personalInfo?.fullName?.replace(/\s+/g, '_') || 'Resume'}_Resume.pdf`;
      
      setDownloadProgress(30);
      setDownloadStatus('Isolating resume content...');
      
      // Create a completely isolated container with ONLY resume content
      const isolatedContainer = document.createElement('div');
      isolatedContainer.style.width = '8.5in';
      isolatedContainer.style.minHeight = '11in';
      isolatedContainer.style.background = 'white';
      isolatedContainer.style.fontFamily = 'Inter, Arial, sans-serif';
      isolatedContainer.style.fontSize = '10pt';
      isolatedContainer.style.lineHeight = '1.3';
      isolatedContainer.style.color = '#1f2937';
      isolatedContainer.style.padding = '0.5in';
      isolatedContainer.style.margin = '0';
      isolatedContainer.style.boxSizing = 'border-box';
      
      // Clone ONLY the resume content
      const resumeContent = element.cloneNode(true) as HTMLElement;
      isolatedContainer.appendChild(resumeContent);
      
      setDownloadProgress(50);
      setDownloadStatus('Optimizing for PDF...');
      
      // Optimize the isolated content
      optimizeElementForPDF(isolatedContainer);
      
      setDownloadProgress(70);
      setDownloadStatus('Generating PDF...');

      // Try html2pdf first (best quality) - ONLY on isolated content
      if ((window as any).html2pdf) {
        try {
          await generateWithHtml2PDF(isolatedContainer, fileName);
          setDownloadProgress(100);
          setDownloadStatus('Download complete! ✓');
          return;
        } catch (error) {
          console.log('html2pdf failed, trying browser method...');
        }
      }

      // Fallback to browser print with ONLY resume content
      setDownloadProgress(90);
      setDownloadStatus('Using browser print...');
      await generateWithBrowserPrint(isolatedContainer, fileName);
      
      setDownloadProgress(100);
      setDownloadStatus('Print dialog opened');
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      setDownloadStatus('Using direct print...');
      
      // Ultimate fallback - direct print of current page with styles
      const printStyles = document.createElement('style');
      printStyles.id = 'temp-print-styles';
      printStyles.textContent = `
        @media print {
          body * { visibility: hidden; }
          #resume-preview-content, #resume-preview-content * { 
            visibility: visible; 
          }
          #resume-preview-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            height: auto !important;
          }
          @page { margin: 0.5in; size: letter portrait; }
        }
      `;
      document.head.appendChild(printStyles);
      
      alert('Opening print dialog. Choose "Save as PDF" as your printer to save the resume.');
      window.print();
      
      setTimeout(() => {
        const styleEl = document.getElementById('temp-print-styles');
        if (styleEl) styleEl.remove();
      }, 1000);
    } finally {
      setTimeout(() => {
        setIsDownloading(false);
        downloadLockRef.current = false;
        setDownloadProgress(0);
        setDownloadStatus('');
      }, 2000);
    }
  }, [isDownloading, resumeData.personalInfo?.fullName]); // Add dependencies for useCallback

  // Optimize element for PDF generation
  const optimizeElementForPDF = (element: HTMLElement) => {
    // Make all content visible and properly formatted
    const allElements = element.querySelectorAll('*');
    allElements.forEach(el => {
      const htmlEl = el as HTMLElement;
      
      // Fix visibility and display
      if (htmlEl.style.display === 'none' || htmlEl.style.visibility === 'hidden') {
        htmlEl.style.display = 'block';
        htmlEl.style.visibility = 'visible';
      }
      
      if (htmlEl.style.opacity === '0') {
        htmlEl.style.opacity = '1';
      }
      
      // Convert flex/grid to block for PDF
      const computedStyle = window.getComputedStyle(htmlEl);
      if (computedStyle.display === 'flex' || computedStyle.display === 'grid') {
        htmlEl.style.display = 'block';
      }
      
      // Remove transforms and animations
      htmlEl.style.transform = 'none';
      htmlEl.style.animation = 'none';
      htmlEl.style.transition = 'none';
      
      // Fix positioning
      if (computedStyle.position === 'fixed' || computedStyle.position === 'sticky') {
        htmlEl.style.position = 'static';
      }
    });

    // Fix gradient backgrounds - make them solid colors
    const gradientElements = element.querySelectorAll('[class*="gradient"], .bg-gradient-to-r, .bg-gradient-to-br, .bg-gradient-to-l, .bg-gradient-to-t, .bg-gradient-to-b');
    gradientElements.forEach(el => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.background = '#3b82f6';
      htmlEl.style.backgroundImage = 'none';
      htmlEl.style.color = 'white';
    });

    // Fix transparent text
    const transparentElements = element.querySelectorAll('.text-transparent');
    transparentElements.forEach(el => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.color = '#3b82f6';
      htmlEl.style.background = 'none';
      htmlEl.style.webkitBackgroundClip = 'unset';
      htmlEl.style.backgroundClip = 'unset';
    });

    // Ensure consistent fonts
    const textElements = element.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, li, a');
    textElements.forEach(el => {
      const htmlEl = el as HTMLElement;
      if (!htmlEl.style.fontFamily) {
        htmlEl.style.fontFamily = 'Inter, Arial, sans-serif';
      }
    });

    // Remove shadows and rounded corners for cleaner PDF
    const shadowElements = element.querySelectorAll('[class*="shadow"]');
    shadowElements.forEach(el => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.boxShadow = 'none';
    });

    const roundedElements = element.querySelectorAll('[class*="rounded"]');
    roundedElements.forEach(el => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.borderRadius = '0';
    });
  };

  // Generate PDF with html2pdf (highest quality) - SINGLE DOWNLOAD ONLY
  const generateWithHtml2PDF = async (element: HTMLElement, fileName: string) => {
    const html2pdf = (window as any).html2pdf;
    
    // Ensure only one download per call
    const options = {
      margin: 0.5,
      filename: fileName,
      image: { 
        type: 'jpeg', 
        quality: 1.0 
      },
      html2canvas: { 
        scale: 2, // Reduced scale to prevent memory issues
        letterRendering: true,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: 816,  // 8.5 inches at 96 DPI
        height: 1056, // 11 inches at 96 DPI
        logging: false, // Disable logging to prevent console spam
        onclone: (clonedDoc: Document) => {
          // Add fonts and styles to cloned document
          const fontLink = clonedDoc.createElement('link');
          fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
          fontLink.rel = 'stylesheet';
          clonedDoc.head.appendChild(fontLink);

          const style = clonedDoc.createElement('style');
          style.textContent = `
            * { 
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              font-family: 'Inter', Arial, sans-serif !important;
              font-size: 10pt !important;
              line-height: 1.3 !important;
              color: #1f2937 !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            h1 { font-size: 20pt !important; margin: 0 0 8pt 0 !important; font-weight: 700 !important; }
            h2 { font-size: 14pt !important; margin: 12pt 0 6pt 0 !important; font-weight: 600 !important; }
            h3 { font-size: 12pt !important; margin: 8pt 0 4pt 0 !important; font-weight: 600 !important; }
            p { font-size: 10pt !important; margin: 0 0 4pt 0 !important; }
            section { page-break-inside: avoid !important; margin-bottom: 12pt !important; }
            .bg-gradient-to-r, .bg-gradient-to-br, [class*="gradient"] {
              background: #3b82f6 !important;
              background-image: none !important;
              color: white !important;
            }
            .text-transparent { 
              color: #3b82f6 !important; 
              background: none !important;
              -webkit-background-clip: unset !important;
            }
          `;
          clonedDoc.head.appendChild(style);
        }
      },
      jsPDF: { 
        unit: 'in', 
        format: 'letter',
        orientation: 'portrait',
        compress: true // Enable compression to reduce file size
      },
      pagebreak: { 
        mode: ['avoid-all', 'css'],
        avoid: ['section', '.section', '.experience-item', '.education-item', 'h1', 'h2', 'h3']
      }
    };

    // Single download call
    return html2pdf().set(options).from(element).save();
  };

  // Generate with browser print (fallback) - NO POPUP REQUIRED
  const generateWithBrowserPrint = async (element: HTMLElement, fileName: string) => {
    // Create a hidden iframe for PDF generation instead of popup
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.top = '-9999px';
    iframe.style.width = '8.5in';
    iframe.style.height = '11in';
    document.body.appendChild(iframe);

    if (!iframe.contentWindow) {
      // Fallback to current window print if iframe fails
      document.body.removeChild(iframe);
      const printStyles = document.createElement('style');
      printStyles.id = 'temp-print-styles';
      printStyles.textContent = `
        @media print {
          body * { visibility: hidden; }
          #resume-preview-content, #resume-preview-content * { visibility: visible; }
          #resume-preview-content { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100% !important; 
          }
        }
      `;
      document.head.appendChild(printStyles);
      
      alert('PDF will open in print dialog. Choose "Save as PDF" as your printer destination.');
      window.print();
      
      setTimeout(() => {
        const styleEl = document.getElementById('temp-print-styles');
        if (styleEl) styleEl.remove();
      }, 1000);
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${fileName}</title>
          <meta charset="UTF-8">
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
          <style>
            @page { 
              margin: 0.5in; 
              size: letter portrait; 
            }
            body { 
              font-family: 'Inter', Arial, sans-serif; 
              font-size: 10pt; 
              line-height: 1.3; 
              color: #1f2937; 
              background: white; 
              margin: 0; 
              padding: 0;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .resume-content { 
              width: 8.5in;
              min-height: 11in; 
              margin: 0 auto; 
              background: white; 
              padding: 0.5in;
              box-sizing: border-box;
            }
            h1 { font-size: 20pt; font-weight: 700; margin: 0 0 8pt 0; page-break-after: avoid; }
            h2 { font-size: 14pt; font-weight: 600; margin: 12pt 0 6pt 0; page-break-after: avoid; }
            h3 { font-size: 12pt; font-weight: 600; margin: 8pt 0 4pt 0; page-break-after: avoid; }
            p { font-size: 10pt; margin: 0 0 4pt 0; }
            section { page-break-inside: avoid; margin-bottom: 12pt; }
            .bg-gradient-to-r, .bg-gradient-to-br, [class*="gradient"] {
              background: #3b82f6 !important;
              background-image: none !important;
              color: white !important;
            }
            .text-transparent { 
              color: #3b82f6 !important; 
              background: none !important;
            }
          </style>
        </head>
        <body>
          <div class="resume-content">${element.innerHTML}</div>
          <script>
            window.onload = function() {
              document.fonts.ready.then(() => {
                setTimeout(() => {
                  window.print();
                }, 500);
              });
            };
          </script>
        </body>
      </html>
    `;

    iframe.contentWindow.document.write(printContent);
    iframe.contentWindow.document.close();
    
    // Auto-trigger print after content loads
    iframe.onload = () => {
      setTimeout(() => {
        if (iframe.contentWindow) {
          iframe.contentWindow.print();
        }
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 2000);
      }, 1000);
    };
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.3));
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-gray-100 z-[60] flex flex-col">
        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-4">
          <div 
            className="max-w-[8.5in] mx-auto bg-white shadow-lg"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          >
            <div id="resume-preview-content" ref={resumeRef}>
              {renderTemplate()}
            </div>
          </div>
        </div>

        {/* Bottom Controls Bar */}
        <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
          {/* Download Progress */}
          {isDownloading && (
            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-between text-sm text-blue-800 mb-2">
                <span>{downloadStatus}</span>
                <span>{downloadProgress}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleFullscreen}
                className="flex items-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>Exit Fullscreen</span>
              </Button>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600 min-w-[60px] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <Button variant="outline" size="sm" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Button
              onClick={downloadPDF}
              disabled={isDownloading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>{isDownloading ? 'Generating...' : 'Download PDF'}</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card 
      className="card-modern sticky top-24 h-fit overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">Live Preview</h3>
              <p className="text-sm text-purple-100">Real-time updates</p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleFullscreen}
            className="bg-white/20 hover:bg-white/30 text-white border-white/20"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-600 min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            onClick={downloadPDF}
            disabled={isDownloading}
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
          >
            <Download className="h-4 w-4 mr-2" />
            {isDownloading ? 'Generating...' : 'Download'}
          </Button>
        </div>
        
        {/* Download Progress */}
        {isDownloading && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>{downloadStatus}</span>
              <span>{downloadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${downloadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Preview Content */}
      <div className="p-4 bg-gray-100">
        <div 
          className="bg-white shadow-xl mx-auto border border-gray-200"
          style={{ 
            width: '8.5in',
            minHeight: '11in',
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            maxWidth: '100%'
          }}
        >
          <div id="resume-preview-content" ref={resumeRef} className="w-full h-full">
            {renderTemplate()}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transform scale(1.25)"></div>
              <div>
                <p className="text-sm font-semibold text-gray-900 capitalize">
                  {resumeData.selectedTemplate} Template
                </p>
                <p className="text-xs text-gray-600">
                  ATS-optimized • Professional formatting • High-quality PDF
                </p>
              </div>
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
        
        {/* PDF Quality Features */}
        <div className="mt-3 pt-3 border-t border-purple-100">
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span>Vector Graphics</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Selectable Text</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Print Ready</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
              <span>Letter Size</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
