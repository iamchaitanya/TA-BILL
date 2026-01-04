import React from 'react';
import { TourData, InspectionEntry } from './types';
import { formatCurrency, isHolidayStr } from './utils';

interface ReportPageProps {
  selectedMonthLabel: string;
  navigateMonth: (direction: number) => void;
  reportEntries: InspectionEntry[];
  deleteFromReport: (id: string) => void;
  reportTotals: { halting: number; lodging: number; travel: number; total: number };
  currency: string;
}

export const ReportPage: React.FC<ReportPageProps> = ({
  selectedMonthLabel,
  navigateMonth,
  reportEntries,
  deleteFromReport,
  reportTotals,
  currency,
}) => {
  const formatDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white rounded-2xl border border-teal-100 p-3 shadow-sm flex flex-col items-center">
        <div className="flex items-center justify-between w-full max-w-md bg-teal-50/50 p-1.5 rounded-xl border border-teal-100">
          <button onClick={() => navigateMonth(-1)} className="p-2 text-teal-600 hover:bg-teal-100 rounded-lg transition-all active:scale-90"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg></button>
          <div className="text-center"><h2 className="text-xs font-black text-teal-900 uppercase tracking-widest">{selectedMonthLabel}</h2></div>
          <button onClick={() => navigateMonth(1)} className="p-2 text-teal-600 hover:bg-teal-100 rounded-lg transition-all active:scale-90"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-teal-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-teal-100">
                <th className="px-4 py-2 text-xs font-black text-teal-900 uppercase tracking-wider">Date</th>
                <th className="px-4 py-2 text-xs font-black text-teal-900 uppercase tracking-wider">Branch</th>
                <th className="px-4 py-2 text-xs font-black text-teal-900 uppercase tracking-wider">Category</th>
                <th className="px-4 py-2 text-xs font-black text-teal-900 uppercase tracking-wider text-center">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reportEntries.map(entry => {
                const isAutoHoliday = isHolidayStr(entry.date);
                const branchToDisplay = isAutoHoliday ? 'Holiday' : (entry.dayStatus === 'Inspection' ? entry.branch : entry.dayStatus);
                const categoryToDisplay = isAutoHoliday ? 'Holiday' : (entry.dayStatus === 'Inspection' ? entry.inspectionType : entry.dayStatus);

                return (
                  <tr key={entry.id} className={`hover:bg-teal-50/30 transition-colors ${isAutoHoliday ? 'bg-red-50/20' : ''}`}>
                    <td className="px-4 py-1">
                      <p className={`text-xs font-medium ${isAutoHoliday ? 'text-red-600' : 'text-slate-800'}`}>
                        {formatDate(entry.date)}
                      </p>
                    </td>
                    <td className="px-4 py-1">
                      <p className={`text-xs font-bold uppercase tracking-tight leading-tight ${isAutoHoliday ? 'text-red-600' : 'text-slate-700'}`}>
                        {branchToDisplay}
                      </p>
                    </td>
                    <td className="px-4 py-1">
                      <span className={`text-xs font-bold uppercase tracking-tight leading-none ${
                        isAutoHoliday 
                          ? 'text-red-600' 
                          : 'text-slate-500'
                      }`}>
                        {categoryToDisplay}
                      </span>
                    </td>
                    <td className="px-4 py-1 text-center">
                      <button onClick={() => deleteFromReport(entry.id)} className="p-1 text-slate-300 hover:text-red-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
              {reportEntries.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">No saved entries for {selectedMonthLabel}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-teal-100 p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-black text-teal-900 uppercase tracking-widest border-b border-teal-50 pb-2">Monthly Summary</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Halting</p>
            <p className="text-sm font-black text-slate-800">{formatCurrency(reportTotals.halting, currency)}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Lodging</p>
            <p className="text-sm font-black text-slate-800">{formatCurrency(reportTotals.lodging, currency)}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Travel</p>
            <p className="text-sm font-black text-slate-800">{formatCurrency(reportTotals.travel, currency)}</p>
          </div>
        </div>
        <div className="pt-4 border-t-2 border-teal-900 flex justify-between items-center">
          <p className="text-xs font-black text-teal-900 uppercase tracking-widest">Total Claim</p>
          <p className="text-xl font-black text-teal-600">{formatCurrency(reportTotals.total, currency)}</p>
        </div>
        <div className="flex justify-end gap-3 pt-2 no-print">
           <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-2.5 bg-teal-900 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-md active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            Export
          </button>
        </div>
      </div>
    </div>
  );
};