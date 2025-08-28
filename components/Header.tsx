'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Sparkles, Wand2, FileText, Zap, Brain, Target, Menu, X, ChevronDown } from 'lucide-react';

interface HeaderProps {
  onFileUpload: (file: File) => void;
  onAIEnhance: () => void;
  isAIProcessing?: boolean;
}

export function Header({ onFileUpload, onAIEnhance, isAIProcessing }: HeaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUploadHovered, setIsUploadHovered] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50' 
            : 'bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm border-b border-transparent'
        } ${isDragOver ? 'border-purple-300 bg-purple-50/95 shadow-2xl' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4 group">
              <div className="relative transform transition-all duration-300 group-hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <Image 
                  src="/main-logo.png" 
                  alt="Resume Builder Logo" 
                  width={50} 
                  height={50} 
                  className="relative rounded-xl shadow-lg transition-all duration-300 group-hover:shadow-xl"
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent transition-all duration-300 hover:from-purple-700 hover:to-pink-700">
                  Resume Builder Pro
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary" className="text-xs bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 border-purple-200 hover:shadow-md transition-all duration-200">
                    <Sparkles className="h-3 w-3 mr-1 animate-pulse" />
                    AI-Powered
                  </Badge>
                  <Badge variant="secondary" className="text-xs bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 border-emerald-200 hover:shadow-md transition-all duration-200">
                    <Target className="h-3 w-3 mr-1" />
                    ATS-Optimized
                  </Badge>
                </div>
              </div>
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Upload Button */}
              <div 
                className="relative group"
                onMouseEnter={() => setIsUploadHovered(true)}
                onMouseLeave={() => setIsUploadHovered(false)}
              >
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  id="file-upload"
                />
                <Button
                  variant="outline"
                  className={`relative overflow-hidden border-2 transition-all duration-300 group ${
                    isUploadHovered 
                      ? 'border-purple-400 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg scale-105' 
                      : 'border-gray-300 hover:border-purple-400'
                  }`}
                >
                  <Upload className={`h-4 w-4 mr-2 transition-all duration-300 ${
                    isUploadHovered ? 'scale-110 text-purple-600' : 'group-hover:scale-110'
                  }`} />
                  Upload Resume
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>

                {/* Tooltip */}
                <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 pointer-events-none transition-all duration-300 ${
                  isUploadHovered ? 'opacity-100 translate-y-0' : 'translate-y-2'
                }`}>
                  PDF, DOC, DOCX, TXT
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                </div>
              </div>

              {/* AI Enhancement Button */}
              <Button
                onClick={onAIEnhance}
                disabled={isAIProcessing}
                className="relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 transition-all duration-300 group shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAIProcessing ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span className="animate-pulse">Processing...</span>
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                    AI Enhance
                    <Zap className="h-3 w-3 ml-1 group-hover:animate-pulse" />
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}>
            <div className="py-4 space-y-3 border-t border-gray-200">
              <div className="sm:hidden mb-4">
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Resume Builder Pro
                </h1>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI-Powered
                  </Badge>
                  <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700">
                    <Target className="h-3 w-3 mr-1" />
                    ATS-Optimized
                  </Badge>
                </div>
              </div>

              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-300 hover:border-purple-400 hover:bg-purple-50"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Resume
                </Button>
              </div>

              <Button
                onClick={onAIEnhance}
                disabled={isAIProcessing}
                className="w-full justify-start bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                {isAIProcessing ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    AI Enhance
                    <Zap className="h-3 w-3 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Drag and Drop Overlay */}
        {isDragOver && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-dashed border-purple-400 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <div className="text-center transform animate-bounce">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Upload className="h-8 w-8 text-white animate-pulse" />
              </div>
              <p className="text-purple-700 font-semibold text-lg">Drop your resume here</p>
              <p className="text-purple-600 text-sm mt-1">We support PDF, DOC, DOCX, and TXT files</p>
            </div>
          </div>
        )}
      </header>

      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className="h-20"></div>
    </>
  );
}