'use client'

import React from 'react'
import { TagRule, Tag } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TagBadge } from '@/components/ui/tag-badge'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { MultiSelect, MultiSelectOption } from '@/components/ui/multi-select'
import { X, ArrowRight, Search, Plus, Loader2 } from 'lucide-react'

interface KeywordSuggestion {
  keyword: string
  count: number
  type: 'title' | 'location'
}

// Extended TagRule interface to handle new fields until database types are regenerated
interface ExtendedTagRule extends TagRule {
  keywords?: string[]
  location_keywords?: string[]
}

interface Props {
  rules: ExtendedTagRule[]
  tags: Tag[]
  keywordSuggestions: KeywordSuggestion[]
  onDeleteRule: (ruleId: string) => void
  onAddRule: () => void
  newKeywords: string[]
  setNewKeywords: (value: string[]) => void
  newLocationKeywords: string[]
  setNewLocationKeywords: (value: string[]) => void
  selectedTag: string
  setSelectedTag: (value: string) => void
  isCreating?: boolean
  suggestionsLoading?: boolean
}

export const TagRulesCard: React.FC<Props> = ({ 
  rules, 
  tags, 
  keywordSuggestions,
  onDeleteRule,
  onAddRule,
  newKeywords,
  setNewKeywords,
  newLocationKeywords,
  setNewLocationKeywords,
  selectedTag,
  setSelectedTag,
  isCreating = false,
  suggestionsLoading = false,
}) => {
  const selectedTagData = tags.find(tag => tag.id === selectedTag)

  // Convert keyword suggestions to multi-select options
  const titleSuggestionOptions: MultiSelectOption[] = keywordSuggestions
    .filter(s => s.type === 'title')
    .map(s => ({
      value: s.keyword,
      label: s.keyword,
      count: s.count
    }))

  const locationSuggestionOptions: MultiSelectOption[] = keywordSuggestions
    .filter(s => s.type === 'location')
    .map(s => ({
      value: s.keyword,
      label: s.keyword,
      count: s.count
    }))

  return (
    <Card variant="default">
      <CardHeader>
        <CardTitle className="text-foreground">Tag Rules</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Rule Section */}
        <div className="bg-gradient-to-r from-gray-50/50 to-blue-50/30 p-4 rounded-lg border border-gray-200/50">
          <div className="flex items-center gap-2 mb-4">
            <Plus className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium text-foreground">Add New Rule</h3>
          </div>
          
          <div className="space-y-4">
            {/* Keywords for title/description */}
            <div className="flex-1">
                             <MultiSelect
                 label="Keywords (Title/Description)"
                 placeholder={suggestionsLoading ? "Loading suggestions..." : "Select or type keywords..."}
                 options={titleSuggestionOptions}
                 value={newKeywords}
                 onChange={setNewKeywords}
                 maxSelections={5}
                 showCounts={true}
                 displayMode="badges"
               />
              <p className="text-xs text-muted-foreground mt-1">
                Match these keywords in event titles or descriptions (max 5)
              </p>
            </div>

            {/* Keywords for location */}
            <div className="flex-1">
                             <MultiSelect
                 label="Location Keywords (Optional)"
                 placeholder={suggestionsLoading ? "Loading suggestions..." : "Select or type location keywords..."}
                 options={locationSuggestionOptions}
                 value={newLocationKeywords}
                 onChange={setNewLocationKeywords}
                 maxSelections={5}
                 showCounts={true}
                 displayMode="badges"
               />
              <p className="text-xs text-muted-foreground mt-1">
                Match these keywords in event locations (max 5)
              </p>
            </div>

            {/* Tag selection and submit */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="flex-1 sm:flex-initial space-y-2">
                <Select
                  id="tagSelect"
                  label="Select Tag"
                  options={tags.map((tag) => ({
                    value: tag.id,
                    label: tag.name || 'Unnamed Tag'
                  }))}
                  value={selectedTag}
                  onChange={setSelectedTag}
                  placeholder="Select Tag..."
                  disabled={isCreating}
                  className="w-full sm:w-48"
                />
              </div>
              <Button
                onClick={onAddRule}
                disabled={
                  (newKeywords.length === 0 && newLocationKeywords.length === 0) || 
                  !selectedTag || 
                  isCreating
                }
                variant="secondary"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Adding...
                  </>
                ) : (
                  'Add Rule'
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Active Rules Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium text-foreground">
              Active Rules ({rules.length}{isCreating ? ' + 1 pending' : ''})
            </h3>
          </div>
          
          <div className="space-y-2">
            {rules.map((rule) => {
              const tag = tags.find((t) => t.id === rule.tag_id)
              return (
                <div
                  key={rule.id}
                  className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-gray-50/50 to-blue-50/30 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-200/50 hover:shadow-sm transition-all duration-200"
                >
                  {/* Keyword section */}
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                    <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <div className="flex flex-wrap gap-1 mb-1">
                        {/* Display keywords if available */}
                        {rule.keywords && rule.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {rule.keywords.map((keyword: string, index: number) => (
                              <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        )}
                        {/* Display location keywords if available */}
                        {rule.location_keywords && rule.location_keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {rule.location_keywords.map((keyword: string, index: number) => (
                              <span key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                📍 {keyword}
                              </span>
                            ))}
                          </div>
                        )}
                        {/* Fallback for old single keyword format */}
                        {rule.keyword && (
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            {rule.keyword}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground hidden sm:block">
                        {rule.keywords && rule.keywords.length > 0 && "in title/description"}
                        {rule.keywords && rule.keywords.length > 0 && rule.location_keywords && rule.location_keywords.length > 0 && " • "}
                        {rule.location_keywords && rule.location_keywords.length > 0 && "in location"}
                        {rule.keyword && "in title or description (legacy)"}
                      </span>
                    </div>
                  </div>

                  {/* Arrow connector - hidden on mobile */}
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0 hidden sm:block" />

                  {/* Tag section */}
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-xs text-muted-foreground hidden sm:inline">applies</span>
                    <TagBadge 
                      variant="safe"
                      color={tag?.color}
                      className="font-medium text-xs"
                    >
                      {tag?.name || 'Unknown Tag'}
                    </TagBadge>
                  </div>

                  {/* Delete button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 p-0"
                    onClick={() => onDeleteRule(rule.id)}
                  >
                    <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              )
            })}

            {/* Loading indicator for new rule being created */}
            {isCreating && (newKeywords.length > 0 || newLocationKeywords.length > 0) && selectedTagData && (
              <div className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-50/50 to-purple-50/30 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-blue-200/50 animate-pulse">
                {/* Keyword section with loading */}
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                  <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0 animate-spin" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-blue-700 truncate">
                      &ldquo;{[...newKeywords, ...newLocationKeywords].join(', ')}&rdquo;
                    </span>
                    <span className="text-xs text-blue-500 hidden sm:block">
                      creating rule...
                    </span>
                  </div>
                </div>

                {/* Arrow connector - hidden on mobile */}
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-400 flex-shrink-0 hidden sm:block" />

                {/* Tag section */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-xs text-blue-500 hidden sm:inline">applies</span>
                  <TagBadge 
                    variant="safe"
                    color={selectedTagData.color}
                    className="font-medium text-xs opacity-80"
                  >
                    {selectedTagData.name || 'Unknown Tag'}
                  </TagBadge>
                </div>

                {/* Placeholder for delete button */}
                <div className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0" />
              </div>
            )}
            
            {rules.length === 0 && !isCreating && (
              <div className="text-center py-6 sm:py-8 text-muted-foreground">
                <Search className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-muted/50" />
                <p className="text-sm">No tag rules configured</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Create your first rule above to automatically tag events based on keywords
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 