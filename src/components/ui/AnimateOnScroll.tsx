import type { ReactNode } from 'react'
import { useInView } from '../../hooks/useInView'

interface AnimateOnScrollProps {
  children: ReactNode
  className?: string
  delay?: number
  animation?: 'fade-up' | 'fade-in' | 'scale-in' | 'slide-left' | 'slide-right'
}

const animationClasses = {
  'fade-up': 'animate-fade-up',
  'fade-in': 'animate-fade-in',
  'scale-in': 'animate-scale-in',
  'slide-left': 'animate-slide-left',
  'slide-right': 'animate-slide-right',
}

export function AnimateOnScroll({
  children,
  className = '',
  delay = 0,
  animation = 'fade-up',
}: AnimateOnScrollProps) {
  const { ref, isInView } = useInView()

  return (
    <div
      ref={ref}
      className={`${isInView ? animationClasses[animation] : 'opacity-0'} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
