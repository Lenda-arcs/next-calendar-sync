import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import { CalendarItem } from "@/lib/types"

interface CalendarItemCardProps {
  calendar: CalendarItem
  isSelected: boolean
  onToggle: (calendarId: string) => void
}

export function CalendarItemCard({ calendar, isSelected, onToggle }: CalendarItemCardProps) {
  return (
    <Card 
      variant="default"
      interactive
      className={`transition-all duration-200 cursor-pointer hover:shadow-md hover:border-blue-300 hover:bg-blue-50/30 ${
        isSelected 
          ? 'border-green-300 bg-green-50/20 shadow-sm' 
          : ''
      }`}
      onClick={() => onToggle(calendar.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div onClick={(e) => e.stopPropagation()}>
            <Checkbox
              id={calendar.id}
              checked={isSelected}
              onCheckedChange={() => onToggle(calendar.id)}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium truncate">
                {calendar.summary}
              </span>
              {calendar.primary && (
                <Badge variant="default" className="text-xs backdrop-blur-sm">
                  Primary
                </Badge>
              )}
              {calendar.accessRole && (
                <Badge variant="outline" className="text-xs backdrop-blur-sm">
                  {calendar.accessRole}
                </Badge>
              )}
            </div>
            {calendar.description && (
              <p className="text-sm text-muted-foreground truncate">
                {calendar.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {calendar.backgroundColor && (
              <div 
                className="w-4 h-4 rounded-full border-2 border-white/50 shadow-sm"
                style={{ backgroundColor: calendar.backgroundColor }}
              />
            )}
            {isSelected ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <X className="h-4 w-4 text-muted-foreground/50" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 