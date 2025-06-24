'use client'

import React from 'react'
import { Container } from '@/components/layout'
import DataLoader from '@/components/ui/data-loader'
import { TagRulesSkeleton, TagLibraryGridSkeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageSection } from '@/components/layout/page-section'

interface MockTagRule {
  id: string
  keyword: string
  tagId: string
}

interface MockTag {
  id: string
  name: string
  color: string
  classType?: string[]
  audience?: string[]
}

export default function TagSkeletonsTestPage() {
  const [loading, setLoading] = React.useState(false)
  const [rulesData, setRulesData] = React.useState<{ rules: MockTagRule[]; tags: MockTag[] } | null>(null)
  const [libraryData, setLibraryData] = React.useState<{ globalTags: MockTag[]; customTags: MockTag[] } | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const simulateLoad = async () => {
    setLoading(true)
    setError(null)
    setRulesData(null)
    setLibraryData(null)

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Simulate random success/error
    if (Math.random() > 0.8) {
      setError('Failed to load tag data')
    } else {
      const mockTags: MockTag[] = [
        {
          id: '1',
          name: 'Yoga',
          color: '#10B981',
          classType: ['Hatha', 'Vinyasa'],
          audience: ['Beginner', 'Intermediate']
        },
        {
          id: '2', 
          name: 'Pilates',
          color: '#F59E0B',
          classType: ['Mat', 'Reformer'],
          audience: ['All Levels']
        },
        {
          id: '3',
          name: 'Meditation',
          color: '#8B5CF6',
          classType: ['Guided', 'Silent'],
          audience: ['All Levels']
        }
      ]

      const mockRules: MockTagRule[] = [
        { id: '1', keyword: 'yoga', tagId: '1' },
        { id: '2', keyword: 'pilates', tagId: '2' },
        { id: '3', keyword: 'meditate', tagId: '3' }
      ]

      setRulesData({ rules: mockRules, tags: mockTags })
      setLibraryData({ 
        globalTags: mockTags.slice(0, 2), 
        customTags: mockTags.slice(2) 
      })
    }

    setLoading(false)
  }

  const reset = () => {
    setLoading(false)
    setRulesData(null)
    setLibraryData(null)
    setError(null)
  }

  return (
    <Container>
      <PageSection
        title="Tag Management Skeleton Test"
        subtitle="Testing skeleton loading states for tag rules and tag library components"
        spacing="large"
      >
        <div className="space-y-8">
          {/* Controls */}
          <div className="flex gap-4 justify-center">
            <Button onClick={simulateLoad} disabled={loading}>
              {loading ? 'Loading...' : 'Simulate Load (3s)'}
            </Button>
            <Button variant="outline" onClick={reset}>
              Reset
            </Button>
          </div>

          {/* Tag Rules Test */}
          <Card>
            <CardHeader>
              <CardTitle>Tag Rules Skeleton</CardTitle>
            </CardHeader>
            <CardContent>
              <DataLoader
                data={rulesData}
                loading={loading}
                error={error}
                skeleton={TagRulesSkeleton}
                skeletonCount={1}
                empty={
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No tags available. Create some tags first to set up tag rules.</p>
                  </div>
                }
              >
                {(data) => (
                  <Card variant="default">
                    <CardContent className="space-y-6 p-6">
                      {/* Mock Add New Rule Section */}
                      <div className="bg-gradient-to-r from-gray-50/50 to-blue-50/30 p-4 rounded-lg border border-gray-200/50">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-sm font-medium">Add New Rule</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-end gap-4 px-1">
                          <div className="flex-1">
                            <label className="text-sm font-medium">Keyword</label>
                            <input 
                              className="w-full mt-1 px-3 py-2 border rounded-md" 
                              placeholder="e.g. meditation" 
                              disabled 
                            />
                          </div>
                          <div className="flex-1 sm:flex-initial">
                            <label className="text-sm font-medium">Select Tag</label>
                            <select className="w-full sm:w-48 mt-1 px-3 py-2 border rounded-md" disabled>
                              <option>Select Tag...</option>
                            </select>
                          </div>
                          <Button disabled>Add Rule</Button>
                        </div>
                      </div>

                      {/* Mock Active Rules */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-sm font-medium">Active Rules ({data.rules.length})</span>
                        </div>
                        <div className="space-y-2">
                          {data.rules.map((rule) => {
                            const tag = data.tags.find(t => t.id === rule.tagId)
                            return (
                              <div
                                key={rule.id}
                                className="flex items-center gap-3 bg-gradient-to-r from-gray-50/50 to-blue-50/30 px-4 py-3 rounded-lg border border-gray-200/50"
                              >
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                                                     <span className="text-sm font-medium">&ldquo;{rule.keyword}&rdquo;</span>
                                  <span className="text-xs text-muted-foreground hidden sm:block">
                                    in title or description
                                  </span>
                                </div>
                                <span className="text-xs text-muted-foreground hidden sm:inline">applies</span>
                                <span 
                                  className="px-2 py-1 rounded-full text-xs font-medium text-white"
                                  style={{ backgroundColor: tag?.color || '#6B7280' }}
                                >
                                  {tag?.name || 'Unknown Tag'}
                                </span>
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0">×</Button>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </DataLoader>
            </CardContent>
          </Card>

          {/* Tag Library Test */}
          <Card>
            <CardHeader>
              <CardTitle>Tag Library Skeleton</CardTitle>
            </CardHeader>
            <CardContent>
              <DataLoader
                data={libraryData}
                loading={loading}
                error={error}
                skeleton={TagLibraryGridSkeleton}
                skeletonCount={1}
                empty={
                  <p className="text-muted-foreground text-center">
                    No tags found. Create your first tag!
                  </p>
                }
              >
                {(data) => (
                  <div className="space-y-8">
                    {/* Global Tags Section */}
                    {data.globalTags.length > 0 && (
                      <Card variant="default">
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">Global Tags</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                              {data.globalTags.map((tag) => (
                                <div
                                  key={tag.id}
                                  className="p-4 rounded-lg backdrop-blur-sm bg-white/50 border border-white/40 hover:bg-white/60 cursor-pointer"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-3 min-w-0 flex-1">
                                      <div
                                        className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5"
                                        style={{ backgroundColor: tag.color }}
                                      />
                                      <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="text-sm font-medium">{tag.name}</span>
                                          <span className="h-3 w-3 text-muted-foreground">🌐</span>
                                        </div>
                                        {tag.classType && (
                                          <p className="text-xs text-muted-foreground">
                                            {tag.classType.join(', ')}
                                          </p>
                                        )}
                                        {tag.audience && (
                                          <p className="text-xs text-muted-foreground mt-0.5">
                                            {tag.audience.join(', ')}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Custom Tags Section */}
                    <Card variant="default">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Your Custom Tags</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {data.customTags.map((tag) => (
                              <div
                                key={tag.id}
                                className="p-4 rounded-lg backdrop-blur-sm bg-white/50 border border-white/40 hover:bg-white/60 cursor-pointer"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-start gap-3 min-w-0 flex-1">
                                    <div
                                      className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5"
                                      style={{ backgroundColor: tag.color }}
                                    />
                                    <div className="min-w-0 flex-1">
                                      <span className="text-sm font-medium">{tag.name}</span>
                                      {tag.classType && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                          {tag.classType.join(', ')}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex gap-1 flex-shrink-0">
                                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0">✏️</Button>
                                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0">🗑️</Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {/* Create button */}
                            <div className="p-4 rounded-lg border-2 border-dashed border-white/40 bg-white/20 hover:bg-white/30 cursor-pointer flex items-center justify-center min-h-[84px]">
                              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                <span className="text-lg">+</span>
                                <span className="text-sm font-medium">Create Tag</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </DataLoader>
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </Container>
  )
} 