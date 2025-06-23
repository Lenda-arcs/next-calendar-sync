'use client'

import React from 'react'
import { TagRule, Tag } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TagBadge } from '@/components/ui/tag-badge'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { Select } from '@/components/ui/select'
import { X, ArrowRight, Search, Plus, Loader2 } from 'lucide-react'

interface Props {
  rules: TagRule[]
  tags: Tag[]
  onDeleteRule: (ruleId: string) => void
  onAddRule: () => void
  newKeyword: string
  setNewKeyword: (value: string) => void
  selectedTag: string
  setSelectedTag: (value: string) => void
  isCreating?: boolean
}

export const TagRulesCard: React.FC<Props> = ({ 
  rules, 
  tags, 
  onDeleteRule,
  onAddRule,
  newKeyword,
  setNewKeyword,
  selectedTag,
  setSelectedTag,
  isCreating = false,
}) => {
  const selectedTagData = tags.find(tag => tag.id === selectedTag)

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
          
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 px-1">
            <div className="flex-1">
              <FormField
                id="newKeyword"
                label="Keyword"
                name="newKeyword"
                type="text"
                placeholder="e.g. meditation"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                disabled={isCreating}
              />
            </div>
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
              />
            </div>
            <Button
              onClick={onAddRule}
              disabled={!newKeyword.trim() || !selectedTag || isCreating}
              variant="glass"
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
                      <span className="text-sm font-medium text-foreground truncate">
                        &ldquo;{rule.keyword}&rdquo;
                      </span>
                      <span className="text-xs text-muted-foreground hidden sm:block">
                        in title or description
                      </span>
                    </div>
                  </div>

                  {/* Arrow connector - hidden on mobile */}
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0 hidden sm:block" />

                  {/* Tag section */}
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-xs text-muted-foreground hidden sm:inline">applies</span>
                    <TagBadge 
                      variant="dynamic"
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
            {isCreating && newKeyword && selectedTagData && (
              <div className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-50/50 to-purple-50/30 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-blue-200/50 animate-pulse">
                {/* Keyword section with loading */}
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                  <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0 animate-spin" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-blue-700 truncate">
                      &ldquo;{newKeyword}&rdquo;
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
                    variant="dynamic"
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