// components/BrutalDisplay.tsx
export function ProbabilityBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const pct = Math.round(value * 100);
  return (
    <div className='mb-4'>
      <div className='flex justify-between mb-2 items-center'>
        <span className='text-sm font-black text-black uppercase tracking-wide bg-white px-2 py-0.5 border-2 border-black'>
          {label}
        </span>
        <span className='text-base font-black text-black'>{pct}%</span>
      </div>
      <div className='w-full bg-white border-4 border-black h-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden'>
        <div
          className='h-full border-r-4 border-black transition-all duration-700 ease-out'
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export function WhoFlagBadge({
  label,
  value,
  isRisk,
}: {
  label: string;
  value: number;
  isRisk: boolean;
}) {
  const active = value === 1;
  const brutalColors =
    active && isRisk
      ? "bg-[#FCA5A5] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]"
      : active
        ? "bg-[#FDE047] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]"
        : "bg-white opacity-80 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]";

  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 border-2 border-black font-bold text-sm transition-all ${brutalColors}`}
    >
      <span
        className={`w-4 h-4 border-2 border-black flex-shrink-0 ${active && isRisk ? "bg-red-500" : active ? "bg-yellow-400" : "bg-slate-200"}`}
      />
      {label}
    </div>
  );
}

export function ZScoreBadge({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const color =
    value < -3 ? "bg-[#FCA5A5]" : value < -2 ? "bg-[#FDE047]" : "bg-[#86EFAC]";
  return (
    <div
      className={`flex justify-between items-center px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm text-black ${color}`}
    >
      <span className='font-black uppercase tracking-wide'>{label}</span>
      <span className='font-black tabular-nums bg-white px-2 py-0.5 border-2 border-black'>
        {value.toFixed(2)}
      </span>
    </div>
  );
}
