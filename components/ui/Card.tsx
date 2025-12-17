import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  title?: string
  header?: ReactNode
  footer?: ReactNode
}

export default function Card({
  children,
  className = '',
  title,
  header,
  footer,
}: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {(title || header) && (
        <div className="p-6 border-b border-gray-200">
          {header || (title && <h3 className="text-xl font-semibold text-gray-900">{title}</h3>)}
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && <div className="p-6 border-t border-gray-200">{footer}</div>}
    </div>
  )
}




