// components/BrutalInputs.tsx
import { PredictInput } from "@/types/predict";

interface InputProps {
  label: string;
  name: keyof PredictInput;
  value: number | string;
  onChange: (name: keyof PredictInput, val: string) => void;
  type?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  hint?: string;
}

export function InputField({
  label,
  name,
  value,
  onChange,
  unit,
  hint,
  ...props
}: InputProps) {
  return (
    <div>
      <label className='block text-sm font-black text-black uppercase tracking-wide mb-2'>
        {label}{" "}
        {unit && (
          <span className='ml-2 text-xs font-bold text-black bg-white px-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'>
            {unit}
          </span>
        )}
      </label>
      <input
        {...props}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className='w-full px-4 py-3 border-4 border-black bg-white text-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:bg-[#FEF08A] text-sm transition-all'
      />
      {hint && (
        <p className='text-xs font-bold text-black mt-2 bg-white inline-block px-1 border-2 border-black'>
          * {hint}
        </p>
      )}
    </div>
  );
}

export function SelectField({
  label,
  name,
  value,
  options,
  onChange,
  hint,
}: any) {
  return (
    <div>
      <label className='block text-sm font-black text-black uppercase tracking-wide mb-2'>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className='w-full px-4 py-3 border-4 border-black bg-white text-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-[#FEF08A] text-sm transition-all appearance-none cursor-pointer'
      >
        {options.map((o: any) => (
          <option key={o.value} value={o.value} className='font-bold'>
            {o.label}
          </option>
        ))}
      </select>
      {hint && (
        <p className='text-xs font-bold text-black mt-2 bg-white inline-block px-1 border-2 border-black'>
          * {hint}
        </p>
      )}
    </div>
  );
}
