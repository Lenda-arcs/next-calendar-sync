'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart } from 'lucide-react'

interface YogaStylesSelectProps {
  value: string[]
  onChange: (styles: string[]) => void
  className?: string
}

export const YogaStylesSelect: React.FC<YogaStylesSelectProps> = ({ 
  value, 
  onChange, 
  className = "" 
}) => {
  // TODO: make more dynamic, e.g. fetch from API or config
  const yogaStyles = [
    'Hatha Yoga',
    'Vinyasa Flow', 
    'Ashtanga',
    'Bikram/Hot Yoga',
    'Iyengar',
    'Kundalini',
    'Yin Yoga',
    'Restorative',
    'Power Yoga',
    'Prenatal Yoga',
    'Meditation',
    'Breathwork'
  ]

  const toggleStyle = (style: string) => {
    if (value.includes(style)) {
      onChange(value.filter(s => s !== style))
    } else {
      onChange([...value, style])
    }
  }

  return (
    <Card variant="glass" className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Heart className="h-5 w-5" />
          Yoga Styles You Teach
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {yogaStyles.map(style => (
            <Badge
              key={style}
              variant={value.includes(style) ? 'default' : 'outline'}
              className="cursor-pointer transition-all hover:scale-105 backdrop-blur-sm"
              onClick={() => toggleStyle(style)}
            >
              {style}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-foreground/60">
          Select the yoga styles you teach (click to toggle)
        </p>
      </CardContent>
    </Card>
  )
}

export default YogaStylesSelect 