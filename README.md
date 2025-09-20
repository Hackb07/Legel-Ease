# LegalEase AI

LegalEase AI is a web application that transforms complex legal documents into clear, actionable insights using advanced AI. It provides instant risk assessment, plain English summaries, and expert recommendations for contracts, leases, employment agreements, and more.

## Features
- **AI-Powered Legal Analysis**: Analyze legal documents with Google's Gemini AI.
- **PDF Upload**: Upload and parse PDF documents for instant analysis.
- **Plain English Summaries**: Get easy-to-understand explanations of legal terms and obligations.
- **Risk Assessment**: Identify and prioritize legal and financial risks.
- **Actionable Recommendations**: Receive negotiation points and questions to ask before signing.
- **Sample Document**: Try the app with a built-in sample lease agreement.

## How to Use
1. Add your Gemini API key to a `.env` file:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
2. Start the app with `npm run dev`.
3. Upload a PDF or paste your document text.
4. Click "Analyze Document" to get instant results.

## Development
- Built with React, TypeScript, Tailwind CSS, and Lucide React icons.
- PDF parsing powered by [pdfjs-dist](https://github.com/mozilla/pdf.js).

## Disclaimer
This app provides educational analysis and does not constitute legal advice. For binding legal guidance, consult a qualified attorney.
