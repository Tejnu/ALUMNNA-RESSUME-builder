'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, Sparkles, Zap } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [showLogo, setShowLogo] = useState(false);
  const [showText, setShowText] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [showContent, setShowContent] = useState(false);

  const fullText = 'Alumna.ai';

  useEffect(() => {
    // Show logo first
    const logoTimer = setTimeout(() => setShowLogo(true), 500);

    // Start typing animation after logo appears
    const textTimer = setTimeout(() => setShowText(true), 1500);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(textTimer);
    };
  }, []);

  useEffect(() => {
    if (!showText) return;

    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        // Show main content after typing is complete
        setTimeout(() => setShowContent(true), 800);
      }
    }, 150);

    return () => clearInterval(typingInterval);
  }, [showText, fullText]);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{background: 'linear-gradient(90deg, #a07df1, #f69dba)'}}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white bg-opacity-10 rounded-full mix-blend-overlay filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white bg-opacity-10 rounded-full mix-blend-overlay filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-white bg-opacity-10 rounded-full mix-blend-overlay filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo and Brand Animation */}
        <div className="text-center mb-12">
          <div
            className={`transition-all duration-1000 transform ${
              showLogo ? 'scale-100 opacity-100 translate-y-0' : 'scale-150 opacity-0 translate-y-10'
            }`}
          >
            <div className="flex items-center justify-center mb-6">
              <img
                src="/landing-logo.jpg"
                alt="Alumna logo"
                className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover shadow-2xl"
                onError={(e) => {
                  console.log('Landing logo failed, trying backup...');
                  const target = e.currentTarget as HTMLImageElement;
                  target.src = '/alumna-logo.png';
                  target.onerror = () => {
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl"><span class="text-white font-bold text-2xl">A</span></div>';
                    }
                  };
                }}
              />
            </div>
          </div>

          <div
            className={`transition-all duration-500 ${
              showText ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4">
              {typedText}
              <span className="animate-pulse text-blue-600">|</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 font-light">
              AI-Powered Resume Builder
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div
          className={`transition-all duration-1000 transform ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="text-center mb-12 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Build Your Perfect Resume in Minutes
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Transform your career story with our AI-powered resume builder. Upload your existing resume
              or start fresh with intelligent suggestions, professional templates, and real-time optimization.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Smart Import</h3>
                <p className="text-sm text-gray-600">Upload your resume and let AI extract and enhance your content</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">AI Enhancement</h3>
                <p className="text-sm text-gray-600">Get intelligent suggestions to improve your resume content</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Instant Results</h3>
                <p className="text-sm text-gray-600">Professional templates with real-time preview and download</p>
              </div>
            </div>

            <Button
              onClick={onGetStarted}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}