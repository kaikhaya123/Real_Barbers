interface SectionProps {
  children: React.ReactNode
  className?: string
  background?: 'white' | 'gray' | 'primary'
  padding?: 'sm' | 'md' | 'lg'
}

export default function Section({ 
  children, 
  className = '', 
  background = 'white',
  padding = 'lg'
}: SectionProps) {
  const backgrounds = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    primary: 'bg-primary-50',
  }
  
  const paddings = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16 md:py-20',
  }

  return (
    <section className={`${backgrounds[background]} ${paddings[padding]} ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  )
}
