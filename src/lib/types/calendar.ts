export interface CalendarItem {
  id: string
  summary: string
  primary?: boolean
  accessRole?: string
  backgroundColor?: string
  description?: string
  selected: boolean
}

export interface CalendarSelectionState {
  selections: Record<string, boolean>
  initialSelections: Record<string, boolean>
  hasChanges: boolean
  selectedCount: number
  allSelected: boolean
}

export interface OAuthIntegration {
  id: string
  user_id: string
  provider: string
  access_token: string
  refresh_token: string
  expires_at: string
  created_at: string
  updated_at: string
}

export interface CalendarInvitation {
  id: string
  user_id: string
  invitation_email: string
  calendar_provider?: string
  status: 'pending' | 'accepted' | 'expired' | 'cancelled'
  calendar_metadata: Record<string, unknown>
  expires_at: string
  created_at: string
  updated_at: string
}

export interface CreateInvitationRequest {
  expiry_hours?: number
  base_domain?: string
}

export interface CreateInvitationResponse {
  id: string
  invitation_email: string
  expires_at: string
  status: string
} 