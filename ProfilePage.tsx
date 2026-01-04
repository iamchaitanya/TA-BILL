import React from 'react';
import { UserProfile, TourData } from './types';

interface ProfilePageProps {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  data: TourData;
  setData: (d: TourData) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  profile,
  setProfile,
  data,
  setData,
  fileInputRef,
  handleAvatarUpload,
}) => {
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white p-10 rounded-[40px] shadow-sm border border-teal-100 flex flex-col items-center">
        <div className="w-32 h-32 rounded-[40px] border-4 border-white bg-slate-100 shadow-xl overflow-hidden relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          {profile.avatar ? <img src={profile.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl font-black text-teal-200">{profile.name.charAt(0)}</div>}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><span className="text-white text-[10px] font-black uppercase tracking-widest">Change Photo</span></div>
        </div>
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
        <div className="w-full mt-10 space-y-8">
          <div className="space-y-6">
            <h3 className="text-xs font-black text-teal-900 uppercase tracking-widest border-b border-teal-50 pb-2">Details</h3>
            <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Full Name</label><input className="w-full bg-slate-50 border-slate-200 rounded-2xl text-lg font-black p-4 focus:ring-2 focus:ring-teal-500 outline-none" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Employee ID</label><input className="w-full bg-slate-50 border-slate-200 rounded-2xl text-sm font-bold p-4 focus:ring-2 focus:ring-teal-500 outline-none" value={profile.employeeId} onChange={e => setProfile({...profile, employeeId: e.target.value})} /></div>
              <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Currency</label><select className="w-full bg-slate-50 border-slate-200 rounded-2xl text-sm font-bold p-4 focus:ring-2 focus:ring-teal-500 outline-none" value={profile.homeCurrency} onChange={e => setProfile({...profile, homeCurrency: e.target.value})}><option value="INR">INR (₹)</option><option value="USD">USD ($)</option><option value="EUR">EUR (€)</option><option value="GBP">GBP (£)</option></select></div>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Tour Name</label>
              <input type="text" className="w-full bg-slate-50 border-slate-200 rounded-xl text-sm p-4 focus:ring-2 focus:ring-teal-500 outline-none" value={data.tourName} onChange={e => setData({...data, tourName: e.target.value})} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
