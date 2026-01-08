import React from 'react';
import { formatCurrency, isHolidayStr } from './utils';
import { InspectionEntry, UserProfile } from './types';

interface SummaryPageProps {
  selectedMonthLabel: string;
  navigateMonth: (direction: number) => void;
  reportTotals: { halting: number; lodging: number; travel: number; total: number };
  currency: string;
  reportEntries: InspectionEntry[];
  profile: UserProfile;
  tourName: string;
}

export const SummaryPage: React.FC<SummaryPageProps> = ({
  selectedMonthLabel,
  navigateMonth,
  reportTotals,
  currency,
  reportEntries,
  profile,
  tourName,
}) => {
  const downloadCSV = () => {
    // 1. Prepare Headers
    let csv = `TOUR EXPENSE REPORT - ${selectedMonthLabel}\n`;
    csv += `Tour Name:,"${tourName}"\n`;
    csv += `Inspector Name:,"${profile.name}"\n`;
    csv += `Employee ID:,"${profile.employeeId}"\n\n`;

    // 2. Prepare Detailed Table
    csv += `Date,Day Status,Branch,Category,Travel Cost,Halting,Lodging,Day Total\n`;
    
    reportEntries.forEach(entry => {
      const isAutoHoliday = isHolidayStr(entry.date);
      const isHoliday = isAutoHoliday || entry.dayStatus === 'Holiday';
      const isLeave = entry.dayStatus === 'Leave';
      
      const status = isAutoHoliday ? 'Holiday' : entry.dayStatus;
      const branch = isAutoHoliday ? 'Holiday' : (entry.dayStatus === 'Inspection' ? entry.branch : entry.dayStatus);
      const category = isAutoHoliday ? 'Holiday' : (entry.dayStatus === 'Inspection' ? entry.inspectionType : entry.dayStatus);
      
      let travelVal = 0;
      entry.onwardJourney.forEach(j => travelVal += j.amount || 0);
      entry.returnJourney.forEach(j => travelVal += j.amount || 0);
      
      let haltVal = 0, lodgeVal = 0;
      entry.otherExpenses.forEach(o => {
        haltVal += o.halting || 0;
        lodgeVal += o.lodging || 0;
      });

      const dayTotal = travelVal + haltVal + lodgeVal;
      
      csv += `${entry.date},${status},"${branch}","${category}",${travelVal},${haltVal},${lodgeVal},${dayTotal}\n`;
    });

    // 3. Prepare Final Totals
    csv += `\nSUMMARY TOTALS\n`;
    csv += `Total Halting Allowance:,,,,,${reportTotals.halting}\n`;
    csv += `Total Lodging Allowance:,,,,,${reportTotals.lodging}\n`;
    csv += `Total Travel Expenses:,,,,,${reportTotals.travel}\n`;
    csv += `TOTAL REIMBURSEMENT CLAIM:,,,,,,,"${reportTotals.total} ${currency}"\n`;

    // 4. Trigger Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Tour_Report_${selectedMonthLabel.replace(' ', '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white rounded-2xl border border-teal-100 p-3 shadow-sm flex flex-col items-center no-print">
        <div className="flex items-center justify-between w-full max-w-md bg-teal-50/50 p-1.5 rounded-xl border border-teal-100">
          <button onClick={() => navigateMonth(-1)} className="p-2 text-teal-600 hover:bg-teal-100 rounded-lg transition-all active:scale-90">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="text-center">
            <h2 className="text-xs font-black text-teal-900 uppercase tracking-widest">{selectedMonthLabel}</h2>
          </div>
          <button onClick={() => navigateMonth(1)} className="p-2 text-teal-600 hover:bg-teal-100 rounded-lg transition-all active:scale-90">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-teal-100 p-8 shadow-sm space-y-8 invoice-shadow">
        <div className="flex items-center justify-between border-b border-teal-50 pb-4">
          <h3 className="text-sm font-black text-teal-900 uppercase tracking-widest">Monthly Summary</h3>
          <div className="bg-teal-50 px-3 py-1 rounded-full">
             <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest">{selectedMonthLabel}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 bg-slate-50 rounded-[24px] border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Halting Allowance</p>
            <p className="text-xl font-black text-slate-800">{formatCurrency(reportTotals.halting, currency)}</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-[24px] border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Lodging Allowance</p>
            <p className="text-xl font-black text-slate-800">{formatCurrency(reportTotals.lodging, currency)}</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-[24px] border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Travel Expenses</p>
            <p className="text-xl font-black text-slate-800">{formatCurrency(reportTotals.travel, currency)}</p>
          </div>
        </div>

        <div className="pt-8 border-t-4 border-teal-900 flex flex-col items-center gap-6">
          <div className="text-center">
            <p className="text-[10px] font-black text-teal-900 uppercase tracking-widest mb-1">Total Reimbursement Claim</p>
            <p className="text-4xl font-black text-teal-600 tracking-tight">{formatCurrency(reportTotals.total, currency)}</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3 w-full justify-center no-print">
            <button onClick={() => window.print()} className="flex-1 max-w-[280px] flex items-center justify-center gap-3 px-8 py-4 bg-teal-900 text-white rounded-[20px] text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Report
            </button>
            <button onClick={downloadCSV} className="flex-1 max-w-[280px] flex items-center justify-center gap-3 px-8 py-4 border-2 border-teal-900 text-teal-900 rounded-[20px] text-[11px] font-black uppercase tracking-widest hover:bg-teal-50 transition-all active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Excel Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};