export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      calendar_feeds: {
        Row: {
          calendar_name: string | null
          created_at: string | null
          feed_url: string | null
          id: string
          last_synced_at: string | null
          user_id: string | null
        }
        Insert: {
          calendar_name?: string | null
          created_at?: string | null
          feed_url?: string | null
          id?: string
          last_synced_at?: string | null
          user_id?: string | null
        }
        Update: {
          calendar_name?: string | null
          created_at?: string | null
          feed_url?: string | null
          id?: string
          last_synced_at?: string | null
          user_id?: string | null
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
          location: string | null
          recurrence_id: string
          start_time: string | null
          status: string | null
          students_online: number | null
          students_studio: number | null
          studio_id: string | null
          tags: string[] | null
          title: string | null
          uid: string | null
          updated_at: string | null
          user_id: string | null
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
          location?: string | null
          recurrence_id?: string
          start_time?: string | null
          status?: string | null
          students_online?: number | null
          students_studio?: number | null
          studio_id?: string | null
          tags?: string[] | null
          title?: string | null
          uid?: string | null
          updated_at?: string | null
          user_id?: string | null
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
          location?: string | null
          recurrence_id?: string
          start_time?: string | null
          status?: string | null
          students_online?: number | null
          students_studio?: number | null
          studio_id?: string | null
          tags?: string[] | null
          title?: string | null
          uid?: string | null
          updated_at?: string | null
          user_id?: string | null
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
            foreignKeyName: "events_studio_id_fkey"
            columns: ["studio_id"]
            isOneToOne: false
            referencedRelation: "studios"
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
          notes: string | null
          paid_at: string | null
          pdf_url: string | null
          period_end: string
          period_start: string
          sent_at: string | null
          status: Database["public"]["Enums"]["invoice_status"]
          studio_id: string
          user_id: string
        }
        Insert: {
          amount_total?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          invoice_number?: string | null
          notes?: string | null
          paid_at?: string | null
          pdf_url?: string | null
          period_end: string
          period_start: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          studio_id: string
          user_id: string
        }
        Update: {
          amount_total?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          invoice_number?: string | null
          notes?: string | null
          paid_at?: string | null
          pdf_url?: string | null
          period_end?: string
          period_start?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          studio_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_studio_id_fkey"
            columns: ["studio_id"]
            isOneToOne: false
            referencedRelation: "studios"
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
      studios: {
        Row: {
          address: string | null
          base_rate: number | null
          billing_email: string | null
          created_at: string | null
          currency: string | null
          id: string
          location_match: string[] | null
          max_discount: number | null
          notes: string | null
          online_penalty_per_student: number | null
          rate_type: string | null
          student_threshold: number | null
          studio_name: string
          studio_penalty_per_student: number | null
          user_id: string
        }
        Insert: {
          address?: string | null
          base_rate?: number | null
          billing_email?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          location_match?: string[] | null
          max_discount?: number | null
          notes?: string | null
          online_penalty_per_student?: number | null
          rate_type?: string | null
          student_threshold?: number | null
          studio_name: string
          studio_penalty_per_student?: number | null
          user_id: string
        }
        Update: {
          address?: string | null
          base_rate?: number | null
          billing_email?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          location_match?: string[] | null
          max_discount?: number | null
          notes?: string | null
          online_penalty_per_student?: number | null
          rate_type?: string | null
          student_threshold?: number | null
          studio_name?: string
          studio_penalty_per_student?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "studios_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "studios_user_id_fkey"
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
          tag_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          keyword?: string | null
          keywords?: string[] | null
          location_keywords?: string[] | null
          tag_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          keyword?: string | null
          keywords?: string[] | null
          location_keywords?: string[] | null
          tag_id?: string | null
          updated_at?: string | null
          user_id?: string | null
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
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
      user_invoice_settings: {
        Row: {
          address: string | null
          bic: string | null
          created_at: string | null
          email: string | null
          full_name: string
          iban: string | null
          phone: string | null
          tax_id: string | null
          updated_at: string | null
          user_id: string
          vat_id: string | null
        }
        Insert: {
          address?: string | null
          bic?: string | null
          created_at?: string | null
          email?: string | null
          full_name: string
          iban?: string | null
          phone?: string | null
          tax_id?: string | null
          updated_at?: string | null
          user_id: string
          vat_id?: string | null
        }
        Update: {
          address?: string | null
          bic?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string
          iban?: string | null
          phone?: string | null
          tax_id?: string | null
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
      cleanup_expired_rate_limits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
