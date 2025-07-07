'use client'

import React, { useState, useEffect } from 'react'
import { Copy, Share2, Facebook, Twitter, Instagram, Linkedin, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'

interface ShareDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  url: string
  title?: string
  description?: string
}

export function ShareDialog({
  isOpen,
  onOpenChange,
  url,
  title = 'Check out my yoga schedule!',
  description = 'See my upcoming yoga classes and join me for a session.'
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [hasNativeShare, setHasNativeShare] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      setHasNativeShare(!!navigator.share)
    }
  }, [])

  const copyToClipboard = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        toast.success('URL copied to clipboard!')
        setTimeout(() => setCopied(false), 2000)
      } else {
        toast.error('Clipboard not supported')
      }
    } catch {
      toast.error('Failed to copy URL')
    }
  }

  const shareToSocial = (platform: string) => {
    const encodedUrl = encodeURIComponent(url)
    const encodedTitle = encodeURIComponent(title)
    const encodedDescription = encodeURIComponent(description)
    
    let shareUrl = ''
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle} - ${encodedDescription}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        break
      case 'instagram':
        // Instagram doesn't support direct URL sharing, so we'll copy to clipboard
        copyToClipboard()
        toast.info('URL copied! You can paste it in your Instagram story or bio.')
        return
      default:
        break
    }
    
    if (shareUrl && typeof window !== 'undefined') {
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }
  }

  const shareButtons = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      platform: 'facebook'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-500 hover:bg-sky-600',
      platform: 'twitter'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700 hover:bg-blue-800',
      platform: 'linkedin'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      color: 'bg-pink-600 hover:bg-pink-700',
      platform: 'instagram'
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Your Schedule
          </DialogTitle>
          <DialogDescription>
            Share your yoga schedule with your community and students.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Copy Link Section */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Copy Link</h4>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={url}
                readOnly
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="flex-shrink-0"
              >
                {copied ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Social Media Sharing */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Share to Social Media</h4>
            <div className="grid grid-cols-2 gap-3">
              {shareButtons.map((button) => (
                <Button
                  key={button.platform}
                  onClick={() => shareToSocial(button.platform)}
                  className={`${button.color} text-white`}
                  size="sm"
                >
                  <button.icon className="h-4 w-4 mr-2" />
                  {button.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Native Share (if supported) */}
          {isClient && hasNativeShare && (
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Quick Share</h4>
              <Button
                onClick={() => {
                  if (typeof navigator !== 'undefined' && navigator.share) {
                    navigator.share({
                      title: title,
                      text: description,
                      url: url
                    }).catch(() => {
                      // Fallback to copy if sharing fails
                      copyToClipboard()
                    })
                  }
                }}
                variant="outline"
                className="w-full"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share with device
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 