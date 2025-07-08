'use client'

import React from 'react'
import { TagRule, Tag } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TagBadge } from '@/components/ui/tag-badge'
import { Button } from '@/components/ui/button'
import { X, ArrowRight, Search, Plus, Edit2 } from 'lucide-react'

// Extended TagRule interface to handle new fields until database types are regenerated
interface ExtendedTagRule extends TagRule {
  keywords: string[] | null
  location_keywords: string[] | null
}

interface Props {
  rules: ExtendedTagRule[]
  tags: Tag[]
  onDeleteRule: (ruleId: string) => void
  onEditRule: (rule: ExtendedTagRule) => void
  onCreateRule: () => void
  isCreating?: boolean
  isUpdating?: boolean
}

export const TagRulesCard: React.FC<Props> = ({ 
  rules, 
  tags, 
  onDeleteRule,
  onEditRule,
  onCreateRule,
  isCreating = false,
  isUpdating = false,
}) => {
  return (
    <Card variant="default">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">Tag Rules</CardTitle>
          <Button
            onClick={onCreateRule}
            variant="secondary"
            size="sm"
            disabled={isCreating}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Rule
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
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
                  className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border bg-gradient-to-r from-gray-50/50 to-blue-50/30 border-gray-200/50 hover:shadow-sm transition-all duration-200"
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

                  {/* Action buttons */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-blue-600 hover:bg-blue-50 transition-colors h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 p-0"
                      onClick={() => onEditRule(rule)}
                      disabled={isUpdating}
                    >
                      <Edit2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 p-0"
                      onClick={() => onDeleteRule(rule.id)}
                    >
                      <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
            
            {rules.length === 0 && !isCreating && (
              <div className="text-center py-6 sm:py-8 text-muted-foreground">
                <Search className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-muted/50" />
                <p className="text-sm">No tag rules configured</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Create your first rule to automatically tag events based on keywords
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 