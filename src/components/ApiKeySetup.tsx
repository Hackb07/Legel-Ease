import React, { useState } from 'react';
import { Key, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';

interface ApiKeySetupProps {
  onApiKeySet: () => void;
}

export const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onApiKeySet }) => {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-primary-900 px-8 py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 rounded-md p-2">
                <Key className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-serif font-bold text-white">API Key Required</h1>
                <p className="text-blue-100 text-sm">Configure your Gemini API key to start analyzing documents</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-700 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-amber-900 mb-1">Gemini API Key Not Found</h3>
                  <p className="text-amber-800 text-sm leading-relaxed">
                    To use LegalEase AI's document analysis features, you need to configure your Google Gemini API key.
                    This enables real-time AI-powered legal document analysis.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="w-full bg-primary-900 text-white font-bold py-3 px-6 rounded-md hover:bg-primary-800 transition-colors flex items-center justify-center space-x-3 shadow-sm"
              >
                <span>How to Get Your API Key</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              {showInstructions && (
                <div className="bg-gray-50 rounded-md p-6 border border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    Step-by-Step Instructions
                  </h4>
                  <ol className="space-y-3 text-gray-700 text-sm">
                    <li className="flex items-start space-x-3">
                      <span className="bg-primary-100 text-primary-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                      <div>
                        <span className="font-medium">Visit Google AI Studio:</span>
                        <a
                          href="https://aistudio.google.com/app/apikey"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-700 hover:text-primary-900 underline ml-2"
                        >
                          https://aistudio.google.com/app/apikey
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="bg-primary-100 text-primary-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                      <span>Sign in with your Google account</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="bg-primary-100 text-primary-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                      <span>Click "Create API Key" and copy the generated key</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="bg-primary-100 text-primary-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                      <div>
                        <span className="font-medium">Add the key to your .env file:</span>
                        <div className="bg-gray-800 text-green-400 p-3 rounded-md mt-2 font-mono text-xs">
                          VITE_GEMINI_API_KEY=your_api_key_here
                        </div>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="bg-primary-100 text-primary-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">5</span>
                      <span>Restart the development server and refresh this page</span>
                    </li>
                  </ol>
                </div>
              )}

              <div className="bg-emerald-50 border border-emerald-200 rounded-md p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-700 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-emerald-900 mb-1">Free Tier Available</h4>
                    <p className="text-emerald-800 text-sm leading-relaxed">
                      Google's Gemini API offers a generous free tier with 15 requests per minute,
                      perfect for testing and light usage of LegalEase AI.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={onApiKeySet}
                className="w-full bg-gray-800 text-white font-semibold py-3 px-6 rounded-md hover:bg-gray-900 transition-colors"
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