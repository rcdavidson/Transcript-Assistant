import React, { useState, useCallback } from 'react';
import { generateContentFromTranscript } from './services/geminiService';
import type { GeneratedContent, GeneratedEmail } from './types';
import LoadingSpinner from './components/LoadingSpinner';
import OutputCard from './components/OutputCard';

const App: React.FC = () => {
  const [transcript, setTranscript] = useState<string>('');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCrmCopied, setIsCrmCopied] = useState<boolean>(false);

  const handleGenerate = useCallback(async () => {
    if (!transcript.trim()) {
      setError('Please enter a transcript.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);
    setIsCrmCopied(false);

    try {
      const result = await generateContentFromTranscript(transcript);
      setGeneratedContent(result);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [transcript]);

  const handleCopyCrmNotes = useCallback(() => {
    if (generatedContent?.crmNotes) {
      navigator.clipboard.writeText(generatedContent.crmNotes).then(() => {
        setIsCrmCopied(true);
        setTimeout(() => setIsCrmCopied(false), 2000);
      });
    }
  }, [generatedContent]);

  const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
  );

  const CrmIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
  );
  
  const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
    </svg>
  );

  const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-gray-900 selection:bg-blue-500/20">
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 pb-2">
            Transcript Assistant
          </h1>
          <p className="mt-3 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Instantly generate professional client emails and concise CRM notes from your meeting transcripts.
          </p>
        </header>

        <div className="space-y-10">
          <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <label htmlFor="transcript" className="block text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">
              Paste Transcript Here
            </label>
            <textarea
              id="transcript"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Start by pasting the full meeting transcript..."
              className="w-full h-64 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition duration-200"
              disabled={isLoading}
              aria-label="Transcript Input"
            />
            <button
              onClick={handleGenerate}
              disabled={isLoading || !transcript.trim()}
              className="mt-5 w-full flex justify-center items-center px-6 py-3.5 border border-transparent text-base font-bold rounded-lg shadow-md text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:from-slate-400 disabled:cursor-not-allowed dark:focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100"
            >
              {isLoading ? <LoadingSpinner /> : 'Generate Content'}
            </button>
          </div>
          
          {error && (
            <div className="bg-red-100/50 border border-red-400/50 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg backdrop-blur-sm" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {generatedContent && (
            <div className="space-y-8 animate-fade-in">
              <OutputCard title="Client Email" icon={<MailIcon />}>
                <div className="whitespace-pre-wrap font-sans text-sm md:text-base leading-relaxed p-4 bg-slate-100 dark:bg-slate-900/70 rounded-lg border border-slate-200 dark:border-slate-700">
                  {generatedContent.clientEmail.body}
                </div>
                 <a
                  href={generatedContent.clientEmail.mailtoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-green-500 rounded-lg hover:from-green-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-slate-800 transition-all transform hover:scale-105"
                >
                  Open in Email Client
                </a>
              </OutputCard>
              
              <OutputCard 
                title="CRM Notes" 
                icon={<CrmIcon />}
                action={
                  <button 
                    onClick={handleCopyCrmNotes}
                    className={`p-2 rounded-full transition-colors duration-200 ${isCrmCopied ? 'bg-green-100 dark:bg-green-800/50 text-green-600' : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-400'}`}
                    aria-label="Copy CRM notes"
                  >
                    {isCrmCopied ? <CheckIcon /> : <CopyIcon />}
                  </button>
                }
              >
                <div className="whitespace-pre-wrap font-sans text-sm md:text-base leading-relaxed p-4 bg-slate-100 dark:bg-slate-900/70 rounded-lg border border-slate-200 dark:border-slate-700">
                  {generatedContent.crmNotes}
                </div>
              </OutputCard>
            </div>
          )}
        </div>
        <footer className="text-center mt-16 text-sm text-slate-500 dark:text-slate-400">
          <p>Powered by Gemini</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
