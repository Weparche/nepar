export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-[background-color,border-color,box-shadow,transform,opacity] duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] motion-reduce:active:scale-100'
  const variants = {
    primary:
      'bg-lime-600 text-white hover:bg-lime-700 shadow-[0_1px_2px_rgb(61_141_94/0.2),0_4px_12px_rgb(61_141_94/0.25)] hover:shadow-[0_4px_16px_rgb(61_141_94/0.3)]',
    secondary:
      'bg-white text-ink border border-border hover:border-lime-300 hover:bg-lime-50 shadow-sm',
    ghost: 'text-ink-muted hover:text-lime-700 hover:bg-lime-50',
    dark: 'bg-ink text-white hover:bg-slate-800 shadow-md',
    outline: 'border-2 border-white/30 text-white hover:bg-white/10',
  }
  const sizes = {
    sm: 'px-3.5 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-[0.9375rem]',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <svg className="w-4 h-4 animate-spin motion-reduce:animate-none" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0l4 4-4 4V4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
