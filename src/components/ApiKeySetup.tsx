import React, { useState } from 'react';
import { Key, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';

interface ApiKeySetupProps {
  onApiKeySet: () => void;
}

export const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onApiKeySet }) => {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-xl p-3">
                <Key className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">API Key Required</h1>
                <p className="text-blue-100">Configure your Gemini API key to start analyzing documents</p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-amber-800 mb-2">Gemini API Key Not Found</h3>
                  <p className="text-amber-700 leading-relaxed">
                    To use LegalEase AI's document analysis features, you need to configure your Google Gemini API key. 
                    This enables real-time AI-powered legal document analysis.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl"
              >
                <span>How to Get Your API Key</span>
                <ExternalLink className="w-5 h-5" />
              </button>

              {showInstructions && (
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200 animate-fade-in">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    Step-by-Step Instructions
                  </h4>
                  <ol className="space-y-3 text-gray-700">
                    <li className="flex items-start space-x-3">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</span>
                      <div>
                        <span className="font-medium">Visit Google AI Studio:</span>
                        <a 
                          href="https://aistudio.google.com/app/apikey" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 underline ml-2"
                        >
                          https://aistudio.google.com/app/apikey
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</span>
                      <span>Sign in with your Google account</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</span>
                      <span>Click "Create API Key" and copy the generated key</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">4</span>
                      <div>
                        <span className="font-medium">Add the key to your .env file:</span>
                        <div className="bg-gray-800 text-green-400 p-3 rounded-lg mt-2 font-mono text-sm">
                          VITE_GEMINI_API_KEY=your_api_key_here
                        </div>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">5</span>
                      <span>Restart the development server and refresh this page</span>
                    </li>
                  </ol>
                </div>
              )}

              <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-emerald-800 mb-2">Free Tier Available</h4>
                    <p className="text-emerald-700 leading-relaxed">
                      Google's Gemini API offers a generous free tier with 15 requests per minute, 
                      perfect for testing and light usage of LegalEase AI.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={onApiKeySet}
                className="w-full bg-gradient-to-r from-gray-600 to-slate-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-gray-700 hover:to-slate-700 transition-all duration-300"
              >
                I've Added My API Key - Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};