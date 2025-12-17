export function Para({ level = 'p', children, className = '' }) {
  const baseStyles = 'text-foreground'
  const styles = {
    default: 'text-base md:text-lg',
  }
  const Tag = level
  return (
    <Tag className={`${baseStyles} ${styles['default']} ${className}`}>
      {children}
    </Tag>
  )
}
