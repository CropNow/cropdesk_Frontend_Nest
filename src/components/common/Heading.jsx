export function CenterHeading({ level = 'h1', children, className = '' }) {
  const baseStyles = 'tracking-tight text-foreground text-center'

  const styles = {
    h1: 'text-2xl md:text-3xl lg:text-4xl leading-none font-semibold',
    h2: 'text-xl md:text-2xl lg:text-3xl leading-tight font-medium',
    h3: 'text-lg md:text-xl lg:text-3xl font-medium',
    h4: 'text-base md:text-lg font-medium',
  }

  const Tag = level

  return (
    <Tag className={`${baseStyles} ${styles[level]} ${className}`}>
      {children}
    </Tag>
  )
}
export function MainHeading({ level = 'h1', children, className = '' }) {
  const baseStyles = 'tracking-tight text-foreground'

  const styles = {
    h1: 'text-2xl md:text-3xl lg:text-4xl  font-semibold',
    h2: 'text-xl md:text-2xl lg:text-3xl  font-medium',
    h3: 'text-lg md:text-xl lg:text-3xl font-medium',
    h4: 'text-base md:text-lg leading-normal font-medium',
  }

  const Tag = level

  return (
    <Tag className={`${baseStyles} ${styles[level]} ${className}`}>
      {children}
    </Tag>
  )
}

export function MainHeadings({
  level = 'h1',
  spacing = 'none',
  tracking = 'tight',
  children,
  className = '',
}) {
  const baseStyles = 'tracking-tight text-foreground'

  const sizeStyles = {
    h1: 'text-2xl md:text-3xl lg:text-4xl font-semibold',
    h2: 'text-xl md:text-2xl lg:text-3xl font-medium',
    h3: 'text-lg md:text-xl lg:text-3xl font-medium',
    h4: 'text-base md:text-lg font-medium',
  }

  const spacingStyles = {
    none: 'leading-none',
    tight: 'leading-tight',
    snug: 'leading-snug',
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
  }
  const trackingStyles = {
    tight: 'tracking-tight',
    normal: 'tracking-normal',
    wide: 'tracking-wide',
  }

  const Tag = level

  return (
    <Tag
      className={`${baseStyles} ${sizeStyles[level]} ${
        spacingStyles[spacing]
      } ${trackingStyles[tracking]} ${className}`}
    >
      {children}
    </Tag>
  )
}

export function Subheading({ level = 'h2', children, className = '' }) {
  const baseStyles = 'tracking-tight text-foreground'

  const styles = {
    h2: 'text-lg md:text-xl  font-semibold',
    h3: 'text-base md:text-lg font-medium',
  }

  const Tag = level

  return (
    <Tag className={`${baseStyles} ${styles[level]} ${className}`}>
      {children}
    </Tag>
  )
}

export function Boxheading({ level = 'h2', children, className = '' }) {
  const baseStyles = 'tracking-tight text-foreground'

  const styles = {
    h3: 'text-lg md:text-xl  font-medium',
    h4: 'text-base md:text-lg font-medium',
  }

  const Tag = level

  return (
    <Tag className={`${baseStyles} ${styles[level]} ${className}`}>
      {children}
    </Tag>
  )
}

export function Sideheading({ level = 'h6', children, className = '' }) {
  const baseStyles = 'tracking-tight text-foreground'
  const styles = {
    h6: 'text-base md:text-lg font-',
  }
  const Tag = level
  return (
    <Tag className={`${baseStyles} ${styles[level]} ${className}`}>
      {children}
    </Tag>
  )
}
