import Link from 'next/link'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  children: React.ReactNode
  asLink?: boolean
  href?: string
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  asLink = false,
  href,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-dark-900 text-cream-50 hover:bg-dark-800 focus:ring-dark-700',
    secondary: 'bg-cream-200 text-dark-900 hover:bg-cream-300 focus:ring-cream-400',
    outline: 'border-2 border-dark-900 text-dark-900 hover:bg-dark-50 focus:ring-dark-700',
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }
  
  const widthClass = fullWidth ? 'w-full' : ''
  
  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`

  if (asLink && href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
