'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import placeholderImage from '@/assets/placeholder_blur.png'

interface ImageGalleryProps {
  images: string[]
  title: string
  className?: string
}

export function ImageGallery({ images, title, className }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())

  // Filter out empty strings and images with errors
  const validImages = images
    .filter((image, index) => image && image.trim() !== '' && !imageErrors.has(index))
  const hasMultipleImages = validImages.length > 1

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set([...prev, index]))
  }

  const nextImage = () => {
    if (hasMultipleImages) {
      setCurrentIndex((prev) => (prev + 1) % validImages.length)
    }
  }

  const prevImage = () => {
    if (hasMultipleImages) {
      setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length)
    }
  }

  // Use placeholder image when no valid images are available
  const displayImage = validImages.length > 0 ? validImages[currentIndex] : (typeof placeholderImage === 'string' ? placeholderImage : placeholderImage.src)
  const isPlaceholder = validImages.length === 0

  return (
    <div className={cn("relative w-full h-full group", className)}>
      <Image
        src={displayImage}
        alt={isPlaceholder ? 'Event placeholder image' : title}
        fill
        className={cn(
          "object-cover rounded-lg",
          isPlaceholder && "opacity-80"
        )}
        onError={() => {
          if (!isPlaceholder) {
            handleImageError(currentIndex)
          }
        }}
      />

      {/* Navigation arrows - only show if multiple valid images */}
      {hasMultipleImages && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            aria-label="Next image"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}

      {/* Image indicators - only show if multiple valid images */}
      {hasMultipleImages && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
          {validImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === currentIndex
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white/75"
              )}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
} 