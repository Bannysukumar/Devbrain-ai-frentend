import { forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
type Size = 'sm' | 'md' | 'lg'

const base = 'inline-flex items-center justify-center font-medium rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] disabled:opacity-50 disabled:pointer-events-none'
const variants: Record<Variant, string> = {
  primary: 'bg-[var(--accent-primary)] text-white hover:opacity-90 focus:ring-[var(--accent-primary)] shadow-lg hover:shadow-xl',
  secondary: 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)] focus:ring-[var(--border)]',
  ghost: 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] focus:ring-[var(--border)]',
  danger: 'bg-[var(--error)] text-white hover:opacity-90 focus:ring-[var(--error)]',
  outline: 'border-2 border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] focus:ring-[var(--border)]',
}
const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-3',
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  asChild?: false
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, leftIcon, rightIcon, className = '', children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  )
)
Button.displayName = 'Button'
