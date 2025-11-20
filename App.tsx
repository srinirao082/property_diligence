import React, { useState, useRef } from 'react';
import { analyzePropertyDocument } from './services/geminiService';
import { DueDiligenceReport, AppState } from './types';
import { LoadingState } from './components/LoadingState';
import { ReportDashboard } from './components/ReportDashboard';
import { UploadIcon, FileIcon } from './components/Icons';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [report, setReport] = useState<DueDiligenceReport | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.type.startsWith('image/')) {
      setError("Please upload a valid PDF or Image file.");
      return;
    }

    setFileName(file.name);
    setAppState(AppState.ANALYZING);
    setError(null);

    try {
      const base64Data = await fileToBase64(file);
      const result = await analyzePropertyDocument(base64Data, file.type);
      setReport(result);
      setAppState(AppState.SUCCESS);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze the document. Please ensure the file is clear and try again.");
      setAppState(AppState.ERROR);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data:application/pdf;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setReport(null);
    setFileName("");
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={handleReset}>
              <div className="bg-blue-600 rounded-lg p-2 mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
                PropCheck AI
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Upload View */}
        {appState === AppState.IDLE && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-4">
                Instant Property Due Diligence
              </h1>
              <p className="text-lg text-slate-600">
                Upload your <span className="font-semibold text-slate-800">Encumbrance Certificate (EC)</span>, Sale Deed, or Property Tax Receipt. 
                Our AI will verify ownership, check for legal risks, and generate a comprehensive report in seconds.
              </p>
            </div>

            <div className="w-full max-w-xl">
              <label 
                htmlFor="file-upload" 
                className="relative flex flex-col items-center justify-center w-full h-64 rounded-2xl border-2 border-dashed border-slate-300 bg-white cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-all group shadow-sm"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="group-hover:scale-110 transition-transform duration-300 mb-4">
                    <UploadIcon />
                  </div>
                  <p className="mb-2 text-lg font-medium text-slate-700">
                    <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-sm text-slate-500">PDF, PNG, JPG (Max 20MB)</p>
                </div>
                <input 
                  id="file-upload" 
                  ref={fileInputRef}
                  type="file" 
                  className="hidden" 
                  accept="application/pdf,image/png,image/jpeg,image/jpg"
                  onChange={handleFileChange}
                />
              </label>
              
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                 <div className="p-4 bg-white rounded-lg border border-slate-100 shadow-sm">
                    <div className="text-blue-600 font-bold text-lg mb-1">Title Flow</div>
                    <div className="text-xs text-slate-500">Full ownership history tracking</div>
                 </div>
                 <div className="p-4 bg-white rounded-lg border border-slate-100 shadow-sm">
                    <div className="text-blue-600 font-bold text-lg mb-1">Risk Check</div>
                    <div className="text-xs text-slate-500">Automated legal risk assessment</div>
                 </div>
                 <div className="p-4 bg-white rounded-lg border border-slate-100 shadow-sm">
                    <div className="text-blue-600 font-bold text-lg mb-1">Summary</div>
                    <div className="text-xs text-slate-500">Instant executive summaries</div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* Analysis State */}
        {appState === AppState.ANALYZING && (
          <div className="min-h-[60vh] flex items-center justify-center">
             <LoadingState />
          </div>
        )}

        {/* Error State */}
        {appState === AppState.ERROR && (
          <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
             <div className="bg-red-100 p-4 rounded-full mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">Analysis Failed</h3>
             <p className="text-slate-600 mb-6 max-w-md">{error}</p>
             <button 
                onClick={handleReset}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
             >
                Try Again
             </button>
          </div>
        )}

        {/* Success Report State */}
        {appState === AppState.SUCCESS && report && (
          <div>
             <div className="mb-6 flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center">
                  <FileIcon />
                  <span className="ml-3 font-medium text-blue-900">Analyzed: {fileName}</span>
                </div>
                <button onClick={handleReset} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Upload New Document
                </button>
             </div>
             <ReportDashboard report={report} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;