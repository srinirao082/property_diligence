import React from 'react';
import { DueDiligenceReport, RiskAssessment } from '../types';
import { CheckCircleIcon, AlertIcon, ShieldIcon, CurrencyIcon, GavelIcon } from './Icons';

interface ReportDashboardProps {
  report: DueDiligenceReport;
}

const RiskBadge: React.FC<{ assessment: RiskAssessment }> = ({ assessment }) => {
  const colors = {
    LOW: 'bg-green-50 text-green-900 border-green-200',
    MEDIUM: 'bg-amber-50 text-amber-900 border-amber-200',
    HIGH: 'bg-red-50 text-red-900 border-red-200'
  };

  const scoreColor = assessment.score < 30 ? 'text-green-600' : assessment.score < 70 ? 'text-amber-600' : 'text-red-600';

  return (
    <div className={`rounded-xl border p-6 ${colors[assessment.riskLevel]} mb-8`}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold uppercase tracking-wider mb-1">Risk Level: {assessment.riskLevel}</h3>
          <p className="text-sm opacity-90">AI Assessment Score</p>
        </div>
        <div className={`text-5xl font-black ${scoreColor}`}>
          {assessment.score}<span className="text-xl font-medium text-slate-400">/100</span>
        </div>
      </div>
      
      {/* Risk Module - Detailed Factors */}
      <div className="bg-white/80 rounded-lg p-5 backdrop-blur-sm shadow-sm mb-4">
        <h4 className="font-bold text-slate-800 mb-4 flex items-center">
          <AlertIcon />
          <span className="ml-2">Risk Analysis Breakdown</span>
        </h4>
        <div className="space-y-4">
          {assessment.factors.map((factor, idx) => (
            <div key={idx} className="border-b border-slate-200 last:border-0 pb-3 last:pb-0">
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-sm text-slate-800">{factor.risk}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  factor.severity === 'HIGH' ? 'bg-red-100 text-red-800' : 
                  factor.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-800' : 
                  'bg-green-100 text-green-800'
                }`}>
                  {factor.severity}
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{factor.category}</div>
              <p className="text-sm text-slate-600 leading-relaxed">{factor.explanation}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Recommendations */}
       {assessment.recommendations.length > 0 && (
        <div className="mt-4 bg-white/60 rounded-lg p-4">
           <h4 className="font-semibold mb-2 text-xs uppercase text-slate-500 tracking-wide">Actionable Recommendations</h4>
           <ul className="space-y-2">
             {assessment.recommendations.map((rec, idx) => (
               <li key={idx} className="text-sm flex items-start text-slate-800">
                 <span className="mr-2 text-slate-400">•</span> {rec}
               </li>
             ))}
           </ul>
        </div>
       )}
    </div>
  );
};

export const ReportDashboard: React.FC<ReportDashboardProps> = ({ report }) => {
  return (
    <div className="max-w-6xl mx-auto w-full animate-fade-in-up pb-20">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Due Diligence Report</h2>
          <p className="text-slate-500 mt-1">Generated on {new Date().toLocaleDateString()}</p>
        </div>
        <button 
          onClick={() => window.print()}
          className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg shadow-sm hover:bg-slate-50 transition-colors text-sm font-medium print:hidden"
        >
          Print Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Main Content (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Executive Summary */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center space-x-3 mb-4 border-b pb-4 border-slate-100">
               <ShieldIcon />
               <h3 className="text-xl font-semibold text-slate-800">Executive Summary</h3>
            </div>
            <p className="text-slate-700 leading-relaxed text-justify">
              {report.reportSummary}
            </p>
          </section>

          {/* Financial & Legal Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Financial Data */}
             <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <CurrencyIcon />
                  <h3 className="text-lg font-semibold text-slate-800">Financial Data</h3>
                </div>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-xs font-medium text-slate-500 uppercase">Last Transaction Value</dt>
                    <dd className="text-lg font-medium text-slate-900">{report.financials.lastTransactionValue}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-slate-500 uppercase">Tax Status</dt>
                    <dd className={`text-sm font-bold px-2 py-1 rounded inline-block mt-1 ${
                      report.financials.taxStatus.toLowerCase().includes('paid') ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {report.financials.taxStatus}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-slate-500 uppercase">Summary</dt>
                    <dd className="text-sm text-slate-600 mt-1">{report.financials.summary}</dd>
                  </div>
                </dl>
             </section>

             {/* Key Legal Clauses */}
             <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <GavelIcon />
                  <h3 className="text-lg font-semibold text-slate-800">Key Legal Clauses</h3>
                </div>
                <div className="space-y-4">
                   {report.legalClauses.map((clause, idx) => (
                     <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex justify-between items-start mb-1">
                           <span className="font-semibold text-sm text-slate-900">{clause.clause}</span>
                           {clause.significance === 'HIGH' && (
                             <span className="h-2 w-2 rounded-full bg-red-500" title="High Significance"></span>
                           )}
                        </div>
                        <p className="text-xs text-slate-600 leading-snug">{clause.explanation}</p>
                     </div>
                   ))}
                   {report.legalClauses.length === 0 && <p className="text-sm text-slate-400 italic">No specific clauses highlighted.</p>}
                </div>
             </section>
          </div>

          {/* Property Particulars */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">Property Particulars</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
              <div>
                <dt className="text-sm font-medium text-slate-500">Survey Number</dt>
                <dd className="text-base font-medium text-slate-900">{report.propertyDetails.surveyNumber}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Total Area</dt>
                <dd className="text-base font-medium text-slate-900">{report.propertyDetails.totalArea}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Property Type</dt>
                <dd className="text-base font-medium text-slate-900">{report.propertyDetails.propertyType}</dd>
              </div>
              {report.propertyDetails.zoneType && (
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Zone Type</dt>
                    <dd className="text-base font-medium text-slate-900">{report.propertyDetails.zoneType}</dd>
                  </div>
              )}
               <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-slate-500">Address/Location</dt>
                <dd className="text-base text-slate-900 mt-1">{report.propertyDetails.address}</dd>
              </div>
            </dl>
          </section>

          {/* Ownership History / Flow of Title */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Flow of Title (Transactions)</h3>
            <div className="relative border-l-2 border-slate-200 ml-3 space-y-8">
              {report.ownershipHistory.map((tx, index) => (
                <div key={index} className="relative pl-8">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-blue-500"></div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <h4 className="text-base font-semibold text-slate-900">{tx.date}</h4>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      {tx.transactionType}
                    </span>
                  </div>
                  
                  <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-700 border border-slate-100 hover:border-blue-200 transition-colors">
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex flex-col sm:flex-row sm:space-x-4">
                        <div className="flex-1">
                            <span className="font-medium text-slate-500 block text-xs uppercase">From</span> 
                            <span className="text-slate-800">{tx.from}</span>
                        </div>
                        <div className="flex-1 mt-2 sm:mt-0">
                            <span className="font-medium text-slate-500 block text-xs uppercase">To</span> 
                            <span className="text-slate-800">{tx.to}</span>
                        </div>
                      </div>
                      
                      {tx.amount && (
                        <div className="mt-1">
                           <span className="font-medium text-slate-500 text-xs uppercase">Value:</span> <span className="font-mono text-slate-700">{tx.amount}</span>
                        </div>
                      )}
                      {tx.details && <p className="mt-2 text-slate-500 italic text-xs pt-2 border-t border-slate-200">{tx.details}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Risks & Overview (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Risk Badge - Dedicated Module */}
          <RiskBadge assessment={report.riskAssessment} />

          {/* Current Owner Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Current Title Holder</h3>
            <p className="text-lg font-bold text-slate-900 break-words leading-tight">
              {report.currentOwner}
            </p>
            <div className="mt-3 flex items-center text-green-600 text-xs font-bold uppercase tracking-wide">
              <CheckCircleIcon />
              <span className="ml-2">Title Verified</span>
            </div>
          </div>

          {/* Encumbrances */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800">Encumbrances</h3>
              {report.encumbrances.length > 0 ? 
                <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Detected</span> : 
                <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Clean</span>
              }
            </div>
            
            {report.encumbrances.length === 0 ? (
              <p className="text-slate-500 text-sm italic">No active encumbrances found.</p>
            ) : (
              <ul className="space-y-3">
                {report.encumbrances.map((item, idx) => (
                  <li key={idx} className="flex items-start text-sm bg-red-50 p-3 rounded-md border border-red-100">
                    <AlertIcon />
                    <span className="ml-2 text-slate-700 leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
