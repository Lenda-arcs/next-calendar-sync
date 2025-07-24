import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { EventCard } from '@/components/events'
import { Container } from '@/components/layout/container'
import { PageSection } from '@/components/layout/page-section'
import { FeaturedTeacherData } from '@/lib/server/featured-teacher-service'
import { convertEventToCardProps } from '@/lib/event-utils'
import { ExternalLink, Instagram, Globe } from 'lucide-react'
import { createServerClient } from '@/lib/supabase-server'
import { Tag } from '@/lib/types'

interface FeaturedTeacherProps {
  data: FeaturedTeacherData
}

export async function FeaturedTeacher({ data }: FeaturedTeacherProps) {
  const { teacher, events } = data

  // Fetch tags for proper image processing (similar to PublicEventList)
  let allTags: Tag[] = []
  try {
    const supabase = await createServerClient()
    const { data: tagsData } = await supabase
      .from('tags')
      .select('*')
      .or(`user_id.eq.${teacher.id},user_id.is.null`)
      .order('priority', { ascending: false })
    
    allTags = (tagsData as Tag[]) || []
  } catch (error) {
    console.error('Error fetching tags for featured teacher:', error)
  }

  // Limit to 3 events and convert with proper tags for image processing
  const limitedEvents = events.slice(0, 3)
  const eventCards = limitedEvents.map(event => convertEventToCardProps(event, allTags))

  // Get teacher's initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <PageSection className="py-16">
      <Container>
        <Card variant="elevated">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-4">Featured Teacher</CardTitle>
            <CardDescription className="text-lg">
              Discover classes from one of our talented instructors.
              <br />
              Each week we highlight a different teacher from our community.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Teacher Profile */}
            <div className="mb-8 flex items-center justify-center">
              <div className="text-center max-w-md">
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  <AvatarImage 
                    src={teacher.profile_image_url || undefined} 
                    alt={teacher.name}
                  />
                  <AvatarFallback className="text-lg font-semibold">
                    {getInitials(teacher.name)}
                  </AvatarFallback>
                </Avatar>
                
                <h3 className="text-2xl font-serif text-foreground mb-2">
                  {teacher.name}
                </h3>
                
                {teacher.bio && (
                  <p className="text-foreground/70 mb-4 text-sm">
                    {teacher.bio}
                  </p>
                )}
                
                {/* Yoga Styles */}
                {teacher.yoga_styles && teacher.yoga_styles.length > 0 && (
                  <div className="flex justify-center gap-2 mb-4 flex-wrap">
                    {teacher.yoga_styles.slice(0, 3).map((style, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {style}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Social Links */}
                <div className="flex justify-center gap-3 mb-4">
                  {teacher.website_url && (
                    <Link 
                      href={teacher.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground/60 hover:text-foreground transition-colors"
                    >
                      <Globe className="h-4 w-4" />
                    </Link>
                  )}
                  {teacher.instagram_url && (
                    <Link 
                      href={teacher.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground/60 hover:text-foreground transition-colors"
                    >
                      <Instagram className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
            
            {/* Next 3 Classes */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {eventCards.map((event) => (
                <EventCard 
                  key={event.id} 
                  {...event}
                  variant="compact"
                />
              ))}
            </div>

            {/* Call to Action */}
            <div className="mt-8 text-center">
              <p className="text-foreground/70 mb-4">
                View {teacher.name}&apos;s complete schedule and book directly
              </p>
              <Button asChild size="lg">
                <Link 
                  href={`/schedule/${teacher.public_url}`}
                  className="inline-flex items-center gap-2"
                >
                  View Full Schedule
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </Container>
    </PageSection>
  )
} 