export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      billing_entities: {
        Row: {
          banking_info: Json | null
          created_at: string | null
          currency: string | null
          custom_rate_override: Json | null
          entity_name: string
          entity_type: string
          id: string
          individual_billing_email: string | null
          location_match: string[] | null
          notes: string | null
          rate_config: Json | null
          recipient_info: Json | null
          studio_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          banking_info?: Json | null
          created_at?: string | null
          currency?: string | null
          custom_rate_override?: Json | null
          entity_name: string
          entity_type?: string
          id?: string
          individual_billing_email?: string | null
          location_match?: string[] | null
          notes?: string | null
          rate_config?: Json | null
          recipient_info?: Json | null
          studio_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          banking_info?: Json | null
          created_at?: string | null
          currency?: string | null
          custom_rate_override?: Json | null
          entity_name?: string
          entity_type?: string
          id?: string
          individual_billing_email?: string | null
          location_match?: string[] | null
          notes?: string | null
          rate_config?: Json | null
          recipient_info?: Json | null
          studio_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_entities_studio_id_fkey"
            columns: ["studio_id"]
            isOneToOne: false
            referencedRelation: "studios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_entities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_entities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_feeds: {
        Row: {
          calendar_name: string | null
          created_at: string | null
          feed_url: string | null
          filtering_enabled: boolean | null
          filtering_patterns: Json | null
          id: string
          last_synced_at: string | null
          sync_approach: string | null
          user_id: string
        }
        Insert: {
          calendar_name?: string | null
          created_at?: string | null
          feed_url?: string | null
          filtering_enabled?: boolean | null
          filtering_patterns?: Json | null
          id?: string
          last_synced_at?: string | null
          sync_approach?: string | null
          user_id: string
        }
        Update: {
          calendar_name?: string | null
          created_at?: string | null
          feed_url?: string | null
          filtering_enabled?: boolean | null
          filtering_patterns?: Json | null
          id?: string
          last_synced_at?: string | null
          sync_approach?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_feeds_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_feeds_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_invitations: {
        Row: {
          calendar_metadata: Json | null
          calendar_provider: string | null
          created_at: string
          expires_at: string
          id: string
          invitation_email: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          calendar_metadata?: Json | null
          calendar_provider?: string | null
          created_at?: string
          expires_at: string
          id?: string
          invitation_email: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          calendar_metadata?: Json | null
          calendar_provider?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          invitation_email?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_invitations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_invitations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          booking_url: string | null
          custom_tags: string[] | null
          description: string | null
          end_time: string | null
          exclude_from_studio_matching: boolean | null
          feed_id: string
          id: string
          image_url: string | null
          invoice_id: string | null
          invoice_type: string | null
          location: string | null
          recurrence_id: string
          start_time: string | null
          status: string | null
          students_online: number | null
          students_studio: number | null
          studio_id: string | null
          substitute_notes: string | null
          substitute_teacher_entity_id: string | null
          tags: string[] | null
          title: string | null
          uid: string | null
          updated_at: string | null
          user_id: string
          visibility: string | null
        }
        Insert: {
          booking_url?: string | null
          custom_tags?: string[] | null
          description?: string | null
          end_time?: string | null
          exclude_from_studio_matching?: boolean | null
          feed_id: string
          id?: string
          image_url?: string | null
          invoice_id?: string | null
          invoice_type?: string | null
          location?: string | null
          recurrence_id?: string
          start_time?: string | null
          status?: string | null
          students_online?: number | null
          students_studio?: number | null
          studio_id?: string | null
          substitute_notes?: string | null
          substitute_teacher_entity_id?: string | null
          tags?: string[] | null
          title?: string | null
          uid?: string | null
          updated_at?: string | null
          user_id: string
          visibility?: string | null
        }
        Update: {
          booking_url?: string | null
          custom_tags?: string[] | null
          description?: string | null
          end_time?: string | null
          exclude_from_studio_matching?: boolean | null
          feed_id?: string
          id?: string
          image_url?: string | null
          invoice_id?: string | null
          invoice_type?: string | null
          location?: string | null
          recurrence_id?: string
          start_time?: string | null
          status?: string | null
          students_online?: number | null
          students_studio?: number | null
          studio_id?: string | null
          substitute_notes?: string | null
          substitute_teacher_entity_id?: string | null
          tags?: string[] | null
          title?: string | null
          uid?: string | null
          updated_at?: string | null
          user_id?: string
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_feed_id_fkey"
            columns: ["feed_id"]
            isOneToOne: false
            referencedRelation: "calendar_feeds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_total: number | null
          created_at: string | null
          currency: string | null
          id: string
          invoice_number: string | null
          invoice_type: string | null
          notes: string | null
          paid_at: string | null
          pdf_url: string | null
          period_end: string
          period_start: string
          sent_at: string | null
          status: Database["public"]["Enums"]["invoice_status"]
          studio_id: string
          substitute_teacher_entity_id: string | null
          user_id: string
        }
        Insert: {
          amount_total?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          invoice_number?: string | null
          invoice_type?: string | null
          notes?: string | null
          paid_at?: string | null
          pdf_url?: string | null
          period_end: string
          period_start: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          studio_id: string
          substitute_teacher_entity_id?: string | null
          user_id: string
        }
        Update: {
          amount_total?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          invoice_number?: string | null
          invoice_type?: string | null
          notes?: string | null
          paid_at?: string | null
          pdf_url?: string | null
          period_end?: string
          period_start?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          studio_id?: string
          substitute_teacher_entity_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_studio_id_fkey"
            columns: ["studio_id"]
            isOneToOne: false
            referencedRelation: "billing_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_substitute_teacher_entity_id_fkey"
            columns: ["substitute_teacher_entity_id"]
            isOneToOne: false
            referencedRelation: "billing_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      oauth_calendar_integrations: {
        Row: {
          access_token: string
          calendar_ids: string[]
          created_at: string | null
          expires_at: string | null
          id: string
          provider: string
          provider_user_id: string
          refresh_token: string | null
          scopes: string[]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token: string
          calendar_ids?: string[]
          created_at?: string | null
          expires_at?: string | null
          id?: string
          provider: string
          provider_user_id: string
          refresh_token?: string | null
          scopes?: string[]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string
          calendar_ids?: string[]
          created_at?: string | null
          expires_at?: string | null
          id?: string
          provider?: string
          provider_user_id?: string
          refresh_token?: string | null
          scopes?: string[]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "oauth_calendar_integrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oauth_calendar_integrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limit_blocks: {
        Row: {
          action: string
          blocked_at: string | null
          blocked_until: string
          id: string
          identifier: string
          metadata: Json | null
          reason: string | null
        }
        Insert: {
          action?: string
          blocked_at?: string | null
          blocked_until: string
          id?: string
          identifier: string
          metadata?: Json | null
          reason?: string | null
        }
        Update: {
          action?: string
          blocked_at?: string | null
          blocked_until?: string
          id?: string
          identifier?: string
          metadata?: Json | null
          reason?: string | null
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          action: string
          created_at: string | null
          expires_at: string
          id: string
          identifier: string
          metadata: Json | null
        }
        Insert: {
          action?: string
          created_at?: string | null
          expires_at: string
          id?: string
          identifier: string
          metadata?: Json | null
        }
        Update: {
          action?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          identifier?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      studio_teacher_requests: {
        Row: {
          admin_response: string | null
          created_at: string | null
          id: string
          message: string | null
          processed_at: string | null
          processed_by: string | null
          status: string | null
          studio_id: string
          teacher_id: string
          updated_at: string | null
        }
        Insert: {
          admin_response?: string | null
          created_at?: string | null
          id?: string
          message?: string | null
          processed_at?: string | null
          processed_by?: string | null
          status?: string | null
          studio_id: string
          teacher_id: string
          updated_at?: string | null
        }
        Update: {
          admin_response?: string | null
          created_at?: string | null
          id?: string
          message?: string | null
          processed_at?: string | null
          processed_by?: string | null
          status?: string | null
          studio_id?: string
          teacher_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "studio_teacher_requests_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "studio_teacher_requests_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "studio_teacher_requests_studio_id_fkey"
            columns: ["studio_id"]
            isOneToOne: false
            referencedRelation: "studios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "studio_teacher_requests_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "studio_teacher_requests_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      studios: {
        Row: {
          address: string | null
          amenities: string[] | null
          business_hours: Json | null
          contact_info: Json | null
          created_at: string | null
          created_by_user_id: string
          default_rate_config: Json | null
          description: string | null
          featured: boolean | null
          id: string
          instagram_url: string | null
          location_patterns: string[] | null
          name: string
          profile_images: string[] | null
          public_profile_enabled: boolean | null
          slug: string | null
          updated_at: string | null
          verified: boolean | null
          website_url: string | null
        }
        Insert: {
          address?: string | null
          amenities?: string[] | null
          business_hours?: Json | null
          contact_info?: Json | null
          created_at?: string | null
          created_by_user_id: string
          default_rate_config?: Json | null
          description?: string | null
          featured?: boolean | null
          id?: string
          instagram_url?: string | null
          location_patterns?: string[] | null
          name: string
          profile_images?: string[] | null
          public_profile_enabled?: boolean | null
          slug?: string | null
          updated_at?: string | null
          verified?: boolean | null
          website_url?: string | null
        }
        Update: {
          address?: string | null
          amenities?: string[] | null
          business_hours?: Json | null
          contact_info?: Json | null
          created_at?: string | null
          created_by_user_id?: string
          default_rate_config?: Json | null
          description?: string | null
          featured?: boolean | null
          id?: string
          instagram_url?: string | null
          location_patterns?: string[] | null
          name?: string
          profile_images?: string[] | null
          public_profile_enabled?: boolean | null
          slug?: string | null
          updated_at?: string | null
          verified?: boolean | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "studios_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "studios_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_filter_rules: {
        Row: {
          calendar_feed_id: string
          created_at: string | null
          id: string
          is_active: boolean | null
          match_type: string
          pattern_type: string
          pattern_value: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          calendar_feed_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          match_type?: string
          pattern_type: string
          pattern_value: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          calendar_feed_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          match_type?: string
          pattern_type?: string
          pattern_value?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sync_filter_rules_calendar_feed_id_fkey"
            columns: ["calendar_feed_id"]
            isOneToOne: false
            referencedRelation: "calendar_feeds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sync_filter_rules_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sync_filter_rules_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tag_rules: {
        Row: {
          id: string
          keyword: string | null
          keywords: string[] | null
          location_keywords: string[] | null
          tag_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          keyword?: string | null
          keywords?: string[] | null
          location_keywords?: string[] | null
          tag_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          keyword?: string | null
          keywords?: string[] | null
          location_keywords?: string[] | null
          tag_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tag_rules_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tag_rules_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tag_rules_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          audience: string[] | null
          class_type: string | null
          color: string | null
          cta_label: string | null
          cta_url: string | null
          id: string
          image_url: string | null
          name: string | null
          priority: number | null
          slug: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          audience?: string[] | null
          class_type?: string | null
          color?: string | null
          cta_label?: string | null
          cta_url?: string | null
          id?: string
          image_url?: string | null
          name?: string | null
          priority?: number | null
          slug?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          audience?: string[] | null
          class_type?: string | null
          color?: string | null
          cta_label?: string | null
          cta_url?: string | null
          id?: string
          image_url?: string | null
          name?: string | null
          priority?: number | null
          slug?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tags_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tags_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_invitations: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          invited_name: string | null
          notes: string | null
          personal_message: string | null
          status: string
          token: string
          updated_at: string
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          created_at?: string
          email: string
          expires_at: string
          id?: string
          invited_by?: string | null
          invited_name?: string | null
          notes?: string | null
          personal_message?: string | null
          status?: string
          token: string
          updated_at?: string
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          invited_name?: string | null
          notes?: string | null
          personal_message?: string | null
          status?: string
          token?: string
          updated_at?: string
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: []
      }
      user_invoice_settings: {
        Row: {
          address: string | null
          bic: string | null
          created_at: string | null
          custom_template_html: string | null
          email: string | null
          full_name: string
          iban: string | null
          kleinunternehmerregelung: boolean | null
          pdf_template_config: Json | null
          phone: string | null
          tax_id: string | null
          template_theme: string | null
          updated_at: string | null
          user_id: string
          vat_id: string | null
        }
        Insert: {
          address?: string | null
          bic?: string | null
          created_at?: string | null
          custom_template_html?: string | null
          email?: string | null
          full_name: string
          iban?: string | null
          kleinunternehmerregelung?: boolean | null
          pdf_template_config?: Json | null
          phone?: string | null
          tax_id?: string | null
          template_theme?: string | null
          updated_at?: string | null
          user_id: string
          vat_id?: string | null
        }
        Update: {
          address?: string | null
          bic?: string | null
          created_at?: string | null
          custom_template_html?: string | null
          email?: string | null
          full_name?: string
          iban?: string | null
          kleinunternehmerregelung?: boolean | null
          pdf_template_config?: Json | null
          phone?: string | null
          tax_id?: string | null
          template_theme?: string | null
          updated_at?: string | null
          user_id?: string
          vat_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_invoice_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_invoice_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          bio: string | null
          calendar_feed_count: number
          created_at: string | null
          email: string | null
          event_display_variant:
            | Database["public"]["Enums"]["event_display_variant"]
            | null
          id: string
          instagram_url: string | null
          is_featured: boolean | null
          name: string | null
          profile_image_url: string | null
          public_url: string | null
          role: Database["public"]["Enums"]["user_role"]
          timezone: string | null
          website_url: string | null
          yoga_styles: string[] | null
        }
        Insert: {
          bio?: string | null
          calendar_feed_count?: number
          created_at?: string | null
          email?: string | null
          event_display_variant?:
            | Database["public"]["Enums"]["event_display_variant"]
            | null
          id?: string
          instagram_url?: string | null
          is_featured?: boolean | null
          name?: string | null
          profile_image_url?: string | null
          public_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          timezone?: string | null
          website_url?: string | null
          yoga_styles?: string[] | null
        }
        Update: {
          bio?: string | null
          calendar_feed_count?: number
          created_at?: string | null
          email?: string | null
          event_display_variant?:
            | Database["public"]["Enums"]["event_display_variant"]
            | null
          id?: string
          instagram_url?: string | null
          is_featured?: boolean | null
          name?: string | null
          profile_image_url?: string | null
          public_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          timezone?: string | null
          website_url?: string | null
          yoga_styles?: string[] | null
        }
        Relationships: []
      }
    }
    Views: {
      public_events: {
        Row: {
          booking_url: string | null
          description: string | null
          end_time: string | null
          feed_id: string | null
          id: string | null
          image_url: string | null
          location: string | null
          start_time: string | null
          status: string | null
          studio_id: string | null
          tags: string[] | null
          title: string | null
          user_id: string | null
        }
        Insert: {
          booking_url?: string | null
          description?: string | null
          end_time?: string | null
          feed_id?: string | null
          id?: string | null
          image_url?: string | null
          location?: string | null
          start_time?: string | null
          status?: string | null
          studio_id?: string | null
          tags?: string[] | null
          title?: string | null
          user_id?: string | null
        }
        Update: {
          booking_url?: string | null
          description?: string | null
          end_time?: string | null
          feed_id?: string | null
          id?: string | null
          image_url?: string | null
          location?: string | null
          start_time?: string | null
          status?: string | null
          studio_id?: string | null
          tags?: string[] | null
          title?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_feed_id_fkey"
            columns: ["feed_id"]
            isOneToOne: false
            referencedRelation: "calendar_feeds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      public_profiles: {
        Row: {
          bio: string | null
          event_display_variant:
            | Database["public"]["Enums"]["event_display_variant"]
            | null
          id: string | null
          instagram_url: string | null
          is_featured: boolean | null
          name: string | null
          profile_image_url: string | null
          public_url: string | null
          timezone: string | null
          website_url: string | null
          yoga_styles: string[] | null
        }
        Insert: {
          bio?: string | null
          event_display_variant?:
            | Database["public"]["Enums"]["event_display_variant"]
            | null
          id?: string | null
          instagram_url?: string | null
          is_featured?: boolean | null
          name?: string | null
          profile_image_url?: string | null
          public_url?: string | null
          timezone?: string | null
          website_url?: string | null
          yoga_styles?: string[] | null
        }
        Update: {
          bio?: string | null
          event_display_variant?:
            | Database["public"]["Enums"]["event_display_variant"]
            | null
          id?: string | null
          instagram_url?: string | null
          is_featured?: boolean | null
          name?: string | null
          profile_image_url?: string | null
          public_url?: string | null
          timezone?: string | null
          website_url?: string | null
          yoga_styles?: string[] | null
        }
        Relationships: []
      }
    }
    Functions: {
      cleanup_expired_invitations: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      cleanup_expired_rate_limits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_rejected_requests: {
        Args: { cleanup_age_months?: number }
        Returns: number
      }
      create_calendar_invitation: {
        Args: {
          p_user_id: string
          p_expiry_hours?: number
          p_base_domain?: string
        }
        Returns: Json
      }
      delete_user_cascade: {
        Args: { target_user_id: string }
        Returns: Json
      }
      generate_invitation_email: {
        Args: { p_user_id: string; p_base_domain?: string }
        Returns: string
      }
      get_my_uid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_image_count: {
        Args: { user_id: string; folder_type?: string }
        Returns: number
      }
      set_role_context: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      event_display_variant: "minimal" | "compact" | "full"
      invoice_status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
      user_role: "user" | "beta" | "moderator" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      event_display_variant: ["minimal", "compact", "full"],
      invoice_status: ["draft", "sent", "paid", "overdue", "cancelled"],
      user_role: ["user", "beta", "moderator", "admin"],
    },
  },
} as const
