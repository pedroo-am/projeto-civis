import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../utils/cn'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  icon?: ReactNode
}

export function Button({
  variant = 'primary',
  icon,
  children,
  className,
  ...props
}: ButtonProps) {
  const styles = {
    primary: 'bg-[#d92d2d] text-white hover:bg-[#bf2222]',
    secondary: 'bg-[#f3f4f6] text-[#0f172a] hover:bg-[#e5e7eb]',
    ghost: 'bg-transparent text-[#0f172a] hover:bg-[#f3f4f6]',
    danger: 'bg-[#d92d2d] text-white hover:bg-[#bf2222]',
  }

  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60',
        styles[variant],
        className,
      )}
    >
      {icon}
      {children}
    </button>
  )
}
