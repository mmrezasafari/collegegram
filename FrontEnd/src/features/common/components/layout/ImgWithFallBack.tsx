import { useState } from 'react'
import { Skeleton } from '@/features/common/components/ui/skeleton'

interface ImageWithFallbackProps {
  src: string
  alt?: string
  className?: string
  fallbackSrc?: string
}

export const ImageWithFallback = ({
  src,
  alt = 'image',
  className = '',
  fallbackSrc = '/fallback.jpg', // optional default fallback
}: ImageWithFallbackProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  return (
    <div className={`relative w-full h-full  ${className}`}>
      {!isLoaded && !hasError && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-md" />
      )}
      <img
        src={hasError ? fallbackSrc : src}
        alt={alt}
        loading="lazy"
        className={`w-full h-full object-cover cursor-pointer transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
    </div>
  )
}
