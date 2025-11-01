'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export interface StyleCheckResult {
  alignmentScore: number;
  alignmentSummary: string;
  suggestions: {
    isPositive: boolean;
    text: string;
  }[];
}

interface StyleCheckResultCardProps {
  result: StyleCheckResult;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-400';
  if (score >= 50) return 'text-yellow-400';
  return 'text-red-400';
};

export default function StyleCheckResultCard({ result }: StyleCheckResultCardProps) {
  return (
    <Card className="mt-6 animate-fade-in-up">
      <CardHeader>
        <CardTitle>AI Style Check Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0 text-center">
            <p className="text-lg font-semibold text-white">Alignment Score</p>
            <p className={cn("text-6xl font-bold font-display", getScoreColor(result.alignmentScore))}>
              {result.alignmentScore}
              <span className="text-4xl">%</span>
            </p>
          </div>
          <div className="flex-grow border-t md:border-t-0 md:border-l border-slate-700 pt-4 md:pt-0 md:pl-6">
            <p className="font-semibold text-white">Summary:</p>
            <p className="text-slate-300">{result.alignmentSummary}</p>
          </div>
        </div>
        
        <div className="mt-6 border-t border-slate-700 pt-4">
          <h4 className="font-semibold text-white mb-3">Feedback & Suggestions:</h4>
          <ul className="space-y-2">
            {result.suggestions.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {item.isPositive ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 102 0V5zm-1 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                  )}
                </div>
                <p className="text-slate-300">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
