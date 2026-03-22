import React from 'react';

const toneClasses = {
  ink: 'bg-slate-950 text-white border-slate-950',
  gold: 'bg-[#f2e3b2] text-slate-900 border-[#f2e3b2]',
  slate: 'bg-[#dde2ea] text-slate-900 border-[#dde2ea]',
  blue: 'bg-primary text-white border-primary'
};

const StatsCard = ({ title, value, icon, tone = 'ink' }) => {
  return (
    <div className="rounded-[1.6rem] border border-white/60 bg-white/55 p-4 shadow-[0_18px_60px_rgba(117,126,145,0.12)] backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="mb-2 text-[11px] uppercase tracking-[0.22em] text-slate-500">{title}</p>
          <p className="kb-stat-number mb-0 text-slate-950">{value}</p>
        </div>
        <div className={`flex h-14 w-14 items-center justify-center rounded-full border ${toneClasses[tone]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
