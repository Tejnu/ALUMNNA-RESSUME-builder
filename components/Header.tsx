'use client';

import { FileText, Download, Share, Upload, Sparkles, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRef, useState } from 'react';

interface HeaderProps {
  onFileUpload?: (file: File) => void;
  onDownloadPDF?: () => void;
}

export function Header({ onFileUpload, onDownloadPDF }: HeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
      event.target.value = '';
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Resume - Built with Alumna',
          text: 'Check out my professional resume built with Alumna AI Resume Builder',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  return (
    <header className="header-gradient border-b shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="relative w-50 h-15 rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm">
              <img 
                src="/custom-logo.jpg"
                alt="Alumna AI Resume Builder"
                className="w-full h-full object-contain p-1"
                style={{ 
                  maxWidth: "100%", 
                  maxHeight: "100%",
                  filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))",
                  transform: "scale(1.25)"
                }}
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  console.log('Custom logo failed to load:', target.src);
                  // Fallback to text logo if image fails
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="flex items-center justify-center w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg rounded-xl px-2">ALUMNA.AI</div>';
                  }
                }}
                onLoad={() => {
                  console.log('Custom logo loaded successfully');
                }}
              />
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <Input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />

            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Upload className="h-4 w-4" />
              <span>Import Resume</span>
            </Button>

            <Button
              variant="outline"
              onClick={handleShare}
              className="flex items-center space-x-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl"
            >
              <Share className="h-4 w-4" />
              <span>Share</span>
            </Button>

            {onDownloadPDF && (
              <Button
                variant="outline"
                onClick={onDownloadPDF}
                className="flex items-center space-x-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl"
              >
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-xl"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-200 animate-fade-in">
            <div className="flex flex-col space-y-3">
              <Input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />

              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import Resume
              </Button>

              <Button
                variant="outline"
                onClick={handleShare}
                className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl"
              >
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>

              {onDownloadPDF && (
                <Button
                  variant="outline"
                  onClick={onDownloadPDF}
                  className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
