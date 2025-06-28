'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input, LoadingLink } from '@/components/ui'
import { useSupabaseQuery } from '@/lib/hooks/useSupabaseQuery'
import { PublicProfile } from '@/lib/types'
import { PATHS } from '@/lib/paths'

export function TeacherSearch() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const { data: teachersData, isLoading } = useSupabaseQuery<PublicProfile[]>({
    queryKey: ['teacher-search', query],
    fetcher: async (supabase) => {
      if (!query) return []
      const { data, error } = await supabase
        .from('users')
        .select('id, name, profile_image_url, bio, public_url')
        .ilike('name', `%${query}%`)
        .order('name', { ascending: true })
        .limit(5)
      if (error) throw error
      return data || []
    },
    enabled: query.length > 0,
    staleTime: 60_000,
  })

  // Ensure teachers is always an array to prevent null.length errors
  const teachers = teachersData || []

  return (
    <div className="relative">
      <Input
        leftIcon={<Search className="h-4 w-4" />}
        placeholder="Search teachers..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          // Delay closing to allow for clicks on results
          setTimeout(() => setOpen(false), 150)
        }}
      />
      {open && query.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-lg border bg-popover p-0 shadow-md outline-none w-72">
        {isLoading ? (
          <div className="p-4 text-center text-sm">Loading...</div>
        ) : teachers.length > 0 ? (
          <ul className="divide-y divide-muted">
            {teachers.map((t) => (
              <li key={t.id}>
                <LoadingLink
                  href={PATHS.DYNAMIC.TEACHER_SCHEDULE(t.public_url || t.id || '')}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-accent"
                >
                  {t.profile_image_url ? (
                    <img
                      src={t.profile_image_url}
                      alt={t.name || 'Teacher'}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                      {t.name?.charAt(0)}
                    </div>
                  )}
                  <span>{t.name}</span>
                </LoadingLink>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 text-sm text-muted-foreground">No results found</div>
        )}
        </div>
      )}
    </div>
  )
}
