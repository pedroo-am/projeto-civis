import type { PropsWithChildren, ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '../utils/cn'

type BottomSheetProps = PropsWithChildren & {
  open: boolean
  title?: string
  onClose: () => void
  footer?: ReactNode
}

export function BottomSheet({ open, title, onClose, footer, children }: BottomSheetProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-slate-950/35 p-3 md:p-8">
      <div className="relative z-10 w-full max-w-md rounded-t-[28px] bg-white p-4 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-1.5 w-12 rounded-full bg-slate-200" />
          <button type="button" aria-label="Fechar menu" onClick={onClose} className="rounded-full p-2 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>
        {title && <h2 className={cn('mb-4 text-xl font-semibold text-slate-900')}>{title}</h2>}
        <div className="space-y-3">{children}</div>
        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </div>
  )
}
