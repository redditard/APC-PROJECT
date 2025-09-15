import * as React from 'react'

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
}

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className = '', orientation = 'horizontal', ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      aria-orientation={orientation}
      className={
        `${orientation === 'vertical' ? 'w-px h-full' : 'h-px w-full'} bg-gray-200 ${className}`
      }
      {...props}
    />
  )
)

Separator.displayName = 'Separator'
