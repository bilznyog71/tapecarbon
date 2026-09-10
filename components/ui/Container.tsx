import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ContainerProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'section' | 'main' | 'header' | 'footer'
  id?: string
}

export default function Container({
  children,
  className,
  as: Component = 'div',
  id,
}: ContainerProps) {
  return (
    <Component
      id={id}
      className={cn('site-container', className)}
    >
      {children}
    </Component>
  )
}
