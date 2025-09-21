
# LegalEase AI

LegalEase AI is a web application that transforms complex legal documents into clear, actionable insights using advanced AI. It provides instant risk assessment, plain English summaries, and expert recommendations for contracts, leases, employment agreements, and more.

## 📹 Demo Video
Watch the explanation video to understand what LegalEase AI does:  
[![Watch the video](https://img.shields.io/badge/▶-Watch_Explanation_Video-blue?logo=video)](explanation-hackathon.mp4)

*(The video file `explanation-hackathon.mp4` should be located in the root of this repository.)*

## ✨ Features
- **AI-Powered Legal Analysis**: Analyze legal documents with Google's Gemini AI.
- **PDF Upload**: Upload and parse PDF documents for instant analysis.
- **Plain English Summaries**: Get easy-to-understand explanations of legal terms and obligations.
- **Risk Assessment**: Identify and prioritize legal and financial risks.
- **Actionable Recommendations**: Receive negotiation points and questions to ask before signing.
- **Sample Document**: Try the app with a built-in sample lease agreement.

## 🚀 How to Use
1. Add your Gemini API key to a `.env` file:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
````

2. Start the app with:

   ```bash
   npm run dev
   ```
3. Upload a PDF or paste your document text.
4. Click **Analyze Document** to get instant results.

## 🛠 Development

* Built with **React**, **TypeScript**, **Tailwind CSS**, and **Lucide React** icons.
* PDF parsing powered by [pdfjs-dist](https://github.com/mozilla/pdf.js).

## ⚠️ Disclaimer

This app provides educational analysis and **does not constitute legal advice**. For binding legal guidance, consult a qualified attorney.

```

This version:  
- Adds a **Demo Video** section with a clickable badge linking to `explanation-hackathon.mp4`.  
- Keeps your original formatting, features, and disclaimer intact.  
- Ensures developers know to place the video file in the repository root for it to work.
```
