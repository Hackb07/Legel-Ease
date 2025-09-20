import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env file');
}

const genAI = new GoogleGenerativeAI(API_KEY || '');

export interface DocumentAnalysis {
  documentType: string;
  riskLevel: 'high' | 'medium' | 'low';
  riskReason: string;
  financialImpact: string;
  keyDeadline: string;
  plainSummary: string;
  financialBreakdown: string[];
  risks: { level: 'high' | 'medium' | 'low'; text: string }[];
  recommendations: string[];
  questionsToAsk: string[];
  detailedSections: { title: string; content: string; risk?: 'high' | 'medium' | 'low' }[];
}

const LEGAL_ANALYSIS_PROMPT = `
You are LegalEase AI, an advanced legal document analysis assistant. Your mission is to democratize legal understanding by transforming complex legal documents into clear, accessible guidance.

Analyze the provided legal document and return a comprehensive analysis in the following JSON format:

{
  "documentType": "Brief identification of document type",
  "riskLevel": "high|medium|low",
  "riskReason": "Brief explanation of why this risk level was assigned",
  "financialImpact": "Summary of key costs and financial obligations",
  "keyDeadline": "Most important deadline or timeframe",
  "plainSummary": "2-3 paragraph explanation in plain English of what this document does, main obligations, and key benefits/risks",
  "financialBreakdown": [
    "List of all costs, fees, penalties, and financial obligations"
  ],
  "risks": [
    {
      "level": "high|medium|low",
      "text": "Description of specific risk or concern"
    }
  ],
  "recommendations": [
    "Actionable recommendations for what to do before signing"
  ],
  "questionsToAsk": [
    "Specific questions to ask the other party"
  ],
  "detailedSections": [
    {
      "title": "Section name (e.g., 'Rent and Payment Terms')",
      "content": "Detailed explanation of this section in plain English",
      "risk": "high|medium|low (optional)"
    }
  ]
}

Guidelines:
- Use plain English, avoid legal jargon
- Focus on practical implications for the user
- Identify unusual or concerning terms
- Provide specific, actionable advice
- Highlight financial obligations clearly
- Assess risks realistically (not overly cautious)
- Make recommendations specific to this document
- Ensure all JSON is properly formatted

Document to analyze:
`;

export async function analyzeDocument(documentText: string): Promise<DocumentAnalysis> {
  if (!API_KEY) {
    throw new Error('Gemini API key not configured. Please add your API key to the .env file.');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = LEGAL_ANALYSIS_PROMPT + documentText;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from AI');
    }
    
    const analysisData = JSON.parse(jsonMatch[0]);
    
    // Validate the response structure
    if (!analysisData.documentType || !analysisData.riskLevel || !analysisData.plainSummary) {
      throw new Error('Incomplete analysis received from AI');
    }
    
    return analysisData as DocumentAnalysis;
    
  } catch (error) {
    console.error('Error analyzing document:', error);
    
    if (error instanceof Error) {
      throw new Error(`Analysis failed: ${error.message}`);
    } else {
      throw new Error('Analysis failed: Unknown error occurred');
    }
  }
}

export function validateApiKey(): boolean {
  return !!API_KEY && API_KEY !== 'your_gemini_api_key_here';
}