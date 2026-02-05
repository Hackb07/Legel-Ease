import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.js?url';
import Tesseract from 'tesseract.js';
import { FileText, AlertTriangle, CheckCircle, Clock, DollarSign, Scale, Target, Phone, Eye, ChevronDown, ChevronUp, Sparkles, Shield, Zap, BookOpen } from 'lucide-react';
import { analyzeDocument, validateApiKey, DocumentAnalysis } from './services/geminiService';
import { ApiKeySetup } from './components/ApiKeySetup';

const sampleAnalysis: DocumentAnalysis = {
  documentType: "Residential Lease Agreement",
  riskLevel: "medium",
  riskReason: "Contains some tenant-unfavorable clauses that require attention",
  financialImpact: "$2,400/month rent + $2,400 security deposit + potential $150/month pet fee",
  keyDeadline: "30-day notice required for termination",
  plainSummary: "This is a standard one-year residential lease for a two-bedroom apartment. You'll pay $2,400 monthly rent plus utilities, with a security deposit equal to one month's rent. The landlord can increase rent with 60 days notice, and you're responsible for minor repairs under $100. Early termination requires 60 days notice plus a penalty fee.",
  financialBreakdown: [
    "Monthly rent: $2,400",
    "Security deposit: $2,400 (refundable)",
    "Pet fee: $150/month (if applicable)",
    "Late payment fee: $75 after 5-day grace period",
    "Early termination fee: 2 months' rent ($4,800)",
    "Key replacement: $150 per key",
    "Carpet cleaning fee: $200 (move-out)"
  ],
  risks: [
    { level: "high", text: "Landlord can increase rent with only 60 days notice - no cap specified" },
    { level: "medium", text: "You're responsible for all repairs under $100, which could add up" },
    { level: "medium", text: "Security deposit may not cover 'excessive wear and tear' (subjective)" },
    { level: "low", text: "Standard late fees and termination procedures" }
  ],
  recommendations: [
    "Negotiate a rent increase cap (e.g., maximum 5% annually)",
    "Request clarification on what constitutes 'excessive wear and tear'",
    "Ask for a pre-move-in inspection report to document existing damage",
    "Clarify maintenance responsibilities with specific examples",
    "Request 90-day notice for rent increases instead of 60 days"
  ],
  questionsToAsk: [
    "What's the maximum rent increase percentage you'll accept annually?",
    "Can you provide examples of repairs I'd be responsible for under $100?",
    "Will you conduct a move-in inspection with me present?",
    "Are utilities included or separate, and what's the average monthly cost?",
    "What's your typical timeline for returning security deposits?"
  ],
  detailedSections: [
    {
      title: "Rent and Payment Terms",
      content: "Rent is due on the 1st of each month with a 5-day grace period. After day 5, a $75 late fee applies. This is standard and reasonable for most markets.",
      risk: "low"
    },
    {
      title: "Rent Increase Clause",
      content: "The landlord can increase rent with 60 days written notice. There's no cap on increase amounts, which means they could potentially raise rent significantly.",
      risk: "high"
    },
    {
      title: "Maintenance Responsibilities",
      content: "Tenant is responsible for repairs under $100 including light bulbs, filters, and minor plumbing issues. While common, this could become expensive if multiple small repairs are needed.",
      risk: "medium"
    },
    {
      title: "Security Deposit Terms",
      content: "One month's rent ($2,400) is required as security deposit. Will be returned within 30 days minus deductions for damages beyond 'normal wear and tear' - a subjective term that could be interpreted broadly.",
      risk: "medium"
    }
  ]
};

const RiskBadge: React.FC<{ level: 'high' | 'medium' | 'low'; className?: string }> = ({ level, className = "" }) => {
  const configs = {
    high: {
      color: 'bg-red-50 text-red-900 border border-red-200',
      icon: '🚨',
      label: 'HIGH RISK',
    },
    medium: {
      color: 'bg-amber-50 text-amber-900 border border-amber-200',
      icon: '⚠️',
      label: 'MEDIUM RISK',
    },
    low: {
      color: 'bg-emerald-50 text-emerald-900 border border-emerald-200',
      icon: '✅',
      label: 'LOW RISK',
    }
  };

  const config = configs[level];
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-serif font-bold tracking-wider ${config.color} ${className}`}>
      <span className="mr-2 text-sm">{config.icon}</span>
      {config.label}
    </span>
  );
};

const AnalysisSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  gradient?: string; // Kept for prop compatibility but unused styling
}> = ({ title, icon, children, className = "" }) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden ${className}`}>
    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-serif font-bold text-primary-900 flex items-center">
        <span className="mr-3 text-primary-700">{icon}</span>
        {title}
      </h3>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const DetailedClause: React.FC<{ section: { title: string; content: string; risk?: 'high' | 'medium' | 'low' } }> = ({ section }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-4 hover:shadow-lg transition-all duration-300">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 bg-white hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between text-left group"
      >
        <div className="flex items-center space-x-4">
          <span className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{section.title}</span>
          {section.risk && <RiskBadge level={section.risk} className="scale-75" />}
        </div>
        <div className="flex items-center space-x-2">
          {isExpanded ?
            <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" /> :
            <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
          }
        </div>
      </button>
      {isExpanded && (
        <div className="p-6 bg-white border-t border-gray-100 animate-fade-in">
          <p className="text-gray-700 leading-relaxed">{section.content}</p>
        </div>
      )}
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; gradient: string }> = ({
  icon, title, description
}) => (
  <div className="group relative bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
    <div className="bg-primary-50 rounded-md p-3 w-12 h-12 flex items-center justify-center mb-4">
      <div className="text-primary-800 text-xl">{icon}</div>
    </div>
    <h3 className="font-serif font-bold text-lg text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState<'upload' | 'analysis'>('upload');
  const [documentText, setDocumentText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyValid, setApiKeyValid] = useState(validateApiKey());
  const [pdfLoading, setPdfLoading] = useState(false);

  // PDF parsing helper
  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setPdfLoading(true);
    setError(null);
    if (file.type === 'application/pdf') {
      // Use local worker for Vite compatibility
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const typedarray = new Uint8Array(e.target?.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
          let text = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map((item: any) => item.str).join(' ') + '\n';
          }
          setDocumentText(text);
        } catch (pdfErr) {
          setError('PDF extraction failed: ' + (pdfErr instanceof Error ? pdfErr.message : String(pdfErr)));
        } finally {
          setPdfLoading(false);
        }
      };
      reader.onerror = () => {
        setError('File reading failed.');
        setPdfLoading(false);
      };
      reader.readAsArrayBuffer(file);
    } else if (file.type.startsWith('image/')) {
      // OCR for images
      try {
        const { data } = await Tesseract.recognize(file, 'eng');
        setDocumentText(data.text);
      } catch (ocrErr) {
        setError('OCR failed: ' + (ocrErr instanceof Error ? ocrErr.message : String(ocrErr)));
      } finally {
        setPdfLoading(false);
      }
    } else {
      setError('Unsupported file type. Please upload a PDF or image.');
      setPdfLoading(false);
    }
  }
  // Check API key validity on component mount
  React.useEffect(() => {
    setApiKeyValid(validateApiKey());
  }, []);

  const handleApiKeySet = () => {
    window.location.reload();
  };

  if (!apiKeyValid) {
    return <ApiKeySetup onApiKeySet={handleApiKeySet} />;
  }

  const handleAnalyze = async () => {
    if (!documentText.trim()) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeDocument(documentText);
      setAnalysis(result);
      setActiveTab('analysis');
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
      // Fallback to sample analysis for demo purposes
      setAnalysis(sampleAnalysis);
      setActiveTab('analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSampleDocument = () => {
    setDocumentText(`RESIDENTIAL LEASE AGREEMENT

This Lease Agreement is entered into on [Date] between [Landlord Name] ("Landlord") and [Tenant Name] ("Tenant") for the rental of the property located at [Property Address].

RENT: Tenant agrees to pay rent in the amount of $2,400.00 per month, due on the 1st day of each month. A late fee of $75.00 will be charged for payments received after the 5th day of the month.

SECURITY DEPOSIT: Tenant shall deposit with Landlord the sum of $2,400.00 as security for the faithful performance of the terms of this lease. This deposit may be used by Landlord to repair damages caused by Tenant beyond normal wear and tear.

RENT INCREASES: Landlord may increase the rent amount with sixty (60) days written notice to Tenant.

MAINTENANCE: Tenant shall be responsible for all repairs and maintenance under $100.00, including but not limited to light bulbs, air filters, and minor plumbing issues...`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900">
      {/* Background Elements Removed for Clean Look */}

      {/* Header */}
      <div className="relative bg-white/80 backdrop-blur-xl shadow-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-3 shadow-lg">
                <Scale className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  LegalEase AI
                </h1>
                <p className="text-sm text-gray-600 font-medium">Legal Document Analysis & Simplification</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${activeTab === 'upload'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 transform scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50 backdrop-blur-sm'
                  }`}
              >
                Document Input
              </button>
              <button
                onClick={() => setActiveTab('analysis')}
                disabled={!analysis}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${activeTab === 'analysis' && analysis
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 transform scale-105'
                  : 'text-gray-400 cursor-not-allowed'
                  }`}
              >
                Analysis Results
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'upload' ? (
          <div className="max-w-5xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16 mt-8">
              <div className="inline-flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-1.5 mb-6">
                <Sparkles className="w-4 h-4 text-primary-700" />
                <span className="text-primary-900 font-medium text-xs tracking-wide uppercase">AI Legal Assistant</span>
              </div>
              <h2 className="text-5xl font-serif font-bold text-primary-900 mb-6 leading-tight">
                Transform Legal Complexity
                <br />
                <span className="text-primary-600">Into Clear Understanding.</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
                Instant analysis of contracts and agreements. We translate complex legal language into plain English actionable insights.
              </p>
            </div>

            {/* Document Input Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-16">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-serif font-bold text-gray-900 flex items-center">
                    <FileText className="w-5 h-5 mr-3 text-primary-700" />
                    Upload Document
                  </h3>
                  <button
                    onClick={handleSampleDocument}
                    className="text-blue-600 hover:text-blue-700 font-semibold bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Try Sample Document</span>
                  </button>
                </div>
                <div className="flex items-center space-x-4 mb-4">
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {pdfLoading && <span className="text-blue-600">Parsing PDF...</span>}
                </div>
                <div className="relative">
                  <textarea
                    value={documentText}
                    onChange={(e) => setDocumentText(e.target.value)}
                    placeholder="Paste your legal document text here, upload a PDF, or click 'Try Sample Document' to see how it works..."
                    className="w-full h-80 p-6 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 resize-none text-sm leading-relaxed bg-gradient-to-br from-white to-gray-50"
                  />
                  {documentText && (
                    <div className="absolute top-4 right-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                      {documentText.length} characters
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span>Secure & Private</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-blue-600" />
                      <span>Instant Analysis</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-purple-600" />
                      <span>Plain English Results</span>
                    </div>
                  </div>
                  <button
                    onClick={handleAnalyze}
                    disabled={!documentText.trim() || isAnalyzing}
                    className="px-8 py-3 bg-primary-900 text-white font-bold rounded-md hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-3 shadow-md hover:shadow-lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Target className="w-5 h-5" />
                        <span>Analyze Document</span>
                      </>
                    )}
                  </button>
                </div>
                {error && (
                  <div className="mt-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-red-800 mb-1">Analysis Error</h4>
                        <p className="text-red-700 text-sm">{error}</p>
                        <p className="text-red-600 text-xs mt-2">Showing sample analysis for demonstration.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <FeatureCard
                icon={<AlertTriangle />}
                title="Smart Risk Assessment"
                description="Identify potential legal and financial risks with AI-powered analysis and color-coded priority levels."
                gradient="from-red-500 to-pink-600"
              />

              <FeatureCard
                icon={<CheckCircle />}
                title="Plain English Translation"
                description="Complex legal jargon automatically translated into clear, understandable language you can act on."
                gradient="from-emerald-500 to-green-600"
              />

              <FeatureCard
                icon={<Target />}
                title="Actionable Insights"
                description="Get specific recommendations, negotiation points, and questions to ask before signing any document."
                gradient="from-blue-500 to-indigo-600"
              />
            </div>

            {/* Trust Indicators */}
            <div className="bg-primary-900 rounded-lg p-8 text-white shadow-sm">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-serif font-bold mb-2">Trusted by Legal Professionals</h3>
                <p className="text-gray-300">Powered by Google's Gemini AI for accurate analysis</p>
              </div>
              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-secondary-500 mb-1">AI</div>
                  <div className="text-sm text-gray-400">Powered Analysis</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary-500 mb-1">Real-time</div>
                  <div className="text-sm text-gray-400">Processing</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary-500 mb-1">15+</div>
                  <div className="text-sm text-gray-400">Document Types</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary-500 mb-1">Secure</div>
                  <div className="text-sm text-gray-400">& Private</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          analysis && (
            <div className="space-y-8">
              {/* Executive Summary */}
              <AnalysisSection
                title="📋 Executive Summary"
                icon={<FileText className="w-6 h-6" />}
                className="border-l-4 border-blue-500"
                gradient="from-blue-50 to-indigo-50"
              >
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-gray-50 to-slate-100 rounded-xl p-6 border border-gray-200">
                    <div className="text-sm font-semibold text-gray-600 mb-2 flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Document Type
                    </div>
                    <div className="font-bold text-gray-900 text-lg">{analysis.documentType}</div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-slate-100 rounded-xl p-6 border border-gray-200">
                    <div className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Risk Level
                    </div>
                    <RiskBadge level={analysis.riskLevel} />
                  </div>
                  <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <div className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-2 flex items-center">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Financial Impact
                    </div>
                    <div className="font-serif font-bold text-primary-900 text-lg leading-tight">{analysis.financialImpact}</div>
                  </div>
                  <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <div className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-2 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Key Deadline
                    </div>
                    <div className="font-serif font-bold text-primary-900 text-lg leading-tight">{analysis.keyDeadline}</div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
                    What This Document Means
                  </h4>
                  <p className="text-gray-700 leading-relaxed text-lg">{analysis.plainSummary}</p>
                </div>
              </AnalysisSection>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Financial Breakdown */}
                <AnalysisSection
                  title="💰 Financial Breakdown"
                  icon={<DollarSign className="w-6 h-6" />}
                  gradient="from-emerald-50 to-green-50"
                >
                  <div className="space-y-4">
                    {analysis.financialBreakdown.map((item, index) => (
                      <div key={index} className="flex items-center p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                        <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full mr-4 flex-shrink-0"></div>
                        <span className="text-gray-700 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </AnalysisSection>

                {/* Risk Assessment */}
                <AnalysisSection
                  title="⚠️ Risk Assessment"
                  icon={<AlertTriangle className="w-6 h-6" />}
                  gradient="from-amber-50 to-orange-50"
                >
                  <div className="space-y-4">
                    {analysis.risks.map((risk, index) => (
                      <div key={index} className="p-4 bg-white rounded-xl border-l-4 border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-start space-x-4">
                          <RiskBadge level={risk.level} className="scale-75 mt-1" />
                          <p className="text-gray-700 leading-relaxed flex-1">{risk.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </AnalysisSection>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Recommendations */}
                <AnalysisSection
                  title="✅ Key Recommendations"
                  icon={<CheckCircle className="w-6 h-6" />}
                  gradient="from-blue-50 to-cyan-50"
                >
                  <div className="space-y-4">
                    {analysis.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mt-1 flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 leading-relaxed font-medium">{rec}</p>
                      </div>
                    ))}
                  </div>
                </AnalysisSection>

                {/* Questions to Ask */}
                <AnalysisSection
                  title="❓ Questions to Ask"
                  icon={<Phone className="w-6 h-6" />}
                  gradient="from-purple-50 to-pink-50"
                >
                  <div className="space-y-4">
                    {analysis.questionsToAsk.map((question, index) => (
                      <div key={index} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                        <div className="flex items-start space-x-3">
                          <div className="text-purple-600 mt-1 text-xl">❓</div>
                          <p className="text-gray-700 leading-relaxed font-medium">{question}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </AnalysisSection>
              </div>

              {/* Detailed Analysis */}
              <AnalysisSection
                title="🔍 Clause-by-Clause Analysis"
                icon={<Eye className="w-6 h-6" />}
                gradient="from-indigo-50 to-purple-50"
              >
                <div>
                  {analysis.detailedSections.map((section, index) => (
                    <DetailedClause key={index} section={section} />
                  ))}
                </div>
              </AnalysisSection>

              {/* Disclaimer */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 rounded-r-2xl p-6 shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-800 mb-2">Important Legal Notice</h4>
                    <p className="text-amber-700 leading-relaxed">
                      This analysis is for educational purposes and doesn't constitute legal advice.
                      For binding legal guidance, consult with a qualified attorney familiar with your jurisdiction's laws.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default App;