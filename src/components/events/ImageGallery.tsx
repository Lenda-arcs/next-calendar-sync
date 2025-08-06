'use client'

import React, { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import placeholderImage from '@/assets/placeholder_blur.png'

interface ImageGalleryProps {
  images: string[]
  title: string
  className?: string
  cardId?: string
}

interface TouchState {
  startX: number
  startY: number
  currentX: number
  currentY: number
  isSwiping: boolean
}

export function ImageGallery({ images, title, className, cardId }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())
  const [touchState, setTouchState] = useState<TouchState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isSwiping: false
  })
  const [isTransitioning, setIsTransitioning] = useState(false)

  const touchRef = useRef<HTMLDivElement>(null)

  // Filter out empty strings and images with errors
  const validImages = images
    .filter((image, index) => image && image.trim() !== '' && !imageErrors.has(index))
  const hasMultipleImages = validImages.length > 1

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set([...prev, index]))
  }

  const nextImage = useCallback(() => {
    if (hasMultipleImages && !isTransitioning) {
      setIsTransitioning(true)
      setCurrentIndex((prev) => (prev + 1) % validImages.length)
      setTimeout(() => setIsTransitioning(false), 300) // Match transition duration
    }
  }, [hasMultipleImages, isTransitioning, validImages.length])

  const prevImage = useCallback(() => {
    if (hasMultipleImages && !isTransitioning) {
      setIsTransitioning(true)
      setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length)
      setTimeout(() => setIsTransitioning(false), 300) // Match transition duration
    }
  }, [hasMultipleImages, isTransitioning, validImages.length])

  // Touch event handlers for swipe functionality
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!hasMultipleImages) return

    const touch = e.touches[0]
    setTouchState({
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      isSwiping: false
    })
  }, [hasMultipleImages])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!hasMultipleImages || !touchState.startX) return

    const touch = e.touches[0]
    const deltaX = touch.clientX - touchState.startX
    const deltaY = touch.clientY - touchState.startY

    // Determine if this is a horizontal swipe (not vertical scroll)
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10

    setTouchState(prev => ({
      ...prev,
      currentX: touch.clientX,
      currentY: touch.clientY,
      isSwiping: isHorizontalSwipe
    }))

    // Prevent page scroll during horizontal swipe
    if (isHorizontalSwipe) {
      e.preventDefault()
    }
  }, [hasMultipleImages, touchState.startX, touchState.startY])

  const handleTouchEnd = useCallback(() => {
    if (!hasMultipleImages || !touchState.isSwiping) {
      setTouchState(prev => ({ ...prev, isSwiping: false }))
      return
    }

    const deltaX = touchState.currentX - touchState.startX
    const minSwipeDistance = 50 // Minimum distance for swipe to trigger

    if (Math.abs(deltaX) >= minSwipeDistance) {
      if (deltaX > 0) {
        // Swipe right - go to previous image
        prevImage()
      } else {
        // Swipe left - go to next image
        nextImage()
      }
    }

    // Reset touch state
    setTouchState({
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      isSwiping: false
    })
  }, [hasMultipleImages, touchState, prevImage, nextImage])

  // Enhanced keyboard navigation for image gallery
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!hasMultipleImages) return

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault()
        prevImage()
        break
      case 'ArrowRight':
        event.preventDefault()
        nextImage()
        break
      case 'Home':
        event.preventDefault()
        setCurrentIndex(0)
        break
      case 'End':
        event.preventDefault()
        setCurrentIndex(validImages.length - 1)
        break
    }
  }, [hasMultipleImages, prevImage, nextImage, validImages.length])

  // Use placeholder image when no valid images are available
  const displayImage = validImages.length > 0 ? validImages[currentIndex] : (typeof placeholderImage === 'string' ? placeholderImage : placeholderImage.src)
  const isPlaceholder = validImages.length === 0

  // Generate accessible labels
  const galleryId = cardId ? `image-gallery-${cardId}` : 'image-gallery'
  const currentImageLabel = hasMultipleImages 
    ? `Image ${currentIndex + 1} of ${validImages.length} for ${title}`
    : `Image for ${title}`
  const navigationLabel = hasMultipleImages 
    ? `Image gallery for ${title}. ${validImages.length} images available. Use arrow keys to navigate or swipe on mobile.`
    : `Image for ${title}`

  // Calculate swipe transform for visual feedback
  const swipeTransform = touchState.isSwiping 
    ? `translateX(${touchState.currentX - touchState.startX}px)` 
    : ''

  return (
    <div 
      ref={touchRef}
      className={cn("relative w-full h-full group", className)}
      role="region"
      aria-label={navigationLabel}
      aria-live="polite"
      aria-atomic="false"
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      tabIndex={hasMultipleImages ? 0 : undefined}
    >
      <Image
        src={displayImage}
        alt={isPlaceholder ? 'Event placeholder image' : currentImageLabel}
        fill
        className={cn(
          "object-cover rounded-lg transition-transform duration-300 ease-out",
          isPlaceholder && "opacity-80"
        )}
        style={{
          transform: swipeTransform,
          transition: touchState.isSwiping ? 'none' : 'transform 300ms ease-out'
        }}
        onError={() => {
          if (!isPlaceholder) {
            handleImageError(currentIndex)
          }
        }}
      />

      {/* Swipe indicator overlay - only show during swipe */}
      {touchState.isSwiping && hasMultipleImages && (
        <div className="absolute inset-0 bg-black/10 rounded-lg pointer-events-none" />
      )}

      {/* Navigation arrows - only show if multiple valid images */}
      {hasMultipleImages && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity hover:bg-black/70 focus:opacity-100"
            aria-label={`Previous image for ${title}`}
            aria-controls={galleryId}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity hover:bg-black/70 focus:opacity-100"
            aria-label={`Next image for ${title}`}
            aria-controls={galleryId}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}

      {/* Image indicators - only show if multiple valid images */}
      {hasMultipleImages && (
        <div 
          className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1"
          role="tablist"
          aria-label={`Image navigation for ${title}`}
        >
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
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Go to image ${index + 1} of ${validImages.length} for ${title}`}
              aria-controls={galleryId}
            />
          ))}
        </div>
      )}

      {/* Hidden status for screen readers */}
      {hasMultipleImages && (
        <div className="sr-only" aria-live="polite">
          {currentImageLabel}
        </div>
      )}
    </div>
  )
} 