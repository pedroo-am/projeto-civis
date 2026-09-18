import type { InputHTMLAttributes } from 'react'
import { cn } from '../utils/cn'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <label className="flex w-full flex-col gap-2 text-sm font-medium text-slate-700">
      {label && <span>{label}</span>}
      <input
        {...props}
        className={cn(
          'w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0a2335] focus:ring-2 focus:ring-[#0a2335]/10',
          error ? 'border-red-300' : '',
          className,
        )}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  )
}
