export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          category: string | null
          content: string
          created_at: string
          excerpt: string
          featured_image_url: string | null
          id: string
          is_published: boolean
          published_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content?: string
          created_at?: string
          excerpt?: string
          featured_image_url?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          excerpt?: string
          featured_image_url?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string
          is_hidden: boolean
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          is_hidden?: boolean
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          is_hidden?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          budget: string | null
          company: string | null
          country: string | null
          created_at: string
          description: string
          email: string
          full_name: string
          id: string
          phone: string | null
          preferred_contact: string | null
          project_type: string | null
          status: string
          updated_at: string
        }
        Insert: {
          budget?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          description: string
          email: string
          full_name: string
          id?: string
          phone?: string | null
          preferred_contact?: string | null
          project_type?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          budget?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          description?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          preferred_contact?: string | null
          project_type?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string
          subject?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          actor_email: string | null
          actor_name: string | null
          body: string | null
          created_at: string
          id: string
          kind: string
          read: boolean
          ref_id: string | null
          title: string
        }
        Insert: {
          actor_email?: string | null
          actor_name?: string | null
          body?: string | null
          created_at?: string
          id?: string
          kind: string
          read?: boolean
          ref_id?: string | null
          title: string
        }
        Update: {
          actor_email?: string | null
          actor_name?: string | null
          body?: string | null
          created_at?: string
          id?: string
          kind?: string
          read?: boolean
          ref_id?: string | null
          title?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string | null
          collaborated_with: string | null
          created_at: string
          description: string
          features: string[]
          github_url: string | null
          id: string
          images: Json
          is_featured: boolean
          is_hidden: boolean
          live_url: string | null
          slug: string
          sort_order: number
          status: string | null
          technologies: string[]
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          collaborated_with?: string | null
          created_at?: string
          description?: string
          features?: string[]
          github_url?: string | null
          id?: string
          images?: Json
          is_featured?: boolean
          is_hidden?: boolean
          live_url?: string | null
          slug: string
          sort_order?: number
          status?: string | null
          technologies?: string[]
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          collaborated_with?: string | null
          created_at?: string
          description?: string
          features?: string[]
          github_url?: string | null
          id?: string
          images?: Json
          is_featured?: boolean
          is_hidden?: boolean
          live_url?: string | null
          slug?: string
          sort_order?: number
          status?: string | null
          technologies?: string[]
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_profile: {
        Row: {
          avatar_url: string | null
          biography: string
          company_logo_url: string | null
          company_motto: string
          company_name: string
          contact_email: string | null
          contact_phone: string | null
          course: string
          cover_url: string | null
          created_at: string
          cv_url: string | null
          education: string
          experience: Json
          full_name: string
          id: string
          intro: string
          motto: string
          position: string
          school: string
          skills: Json
          socials: Json
          timeline: Json
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          biography?: string
          company_logo_url?: string | null
          company_motto?: string
          company_name?: string
          contact_email?: string | null
          contact_phone?: string | null
          course?: string
          cover_url?: string | null
          created_at?: string
          cv_url?: string | null
          education?: string
          experience?: Json
          full_name?: string
          id?: string
          intro?: string
          motto?: string
          position?: string
          school?: string
          skills?: Json
          socials?: Json
          timeline?: Json
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          biography?: string
          company_logo_url?: string | null
          company_motto?: string
          company_name?: string
          contact_email?: string | null
          contact_phone?: string | null
          course?: string
          cover_url?: string | null
          created_at?: string
          cv_url?: string | null
          education?: string
          experience?: Json
          full_name?: string
          id?: string
          intro?: string
          motto?: string
          position?: string
          school?: string
          skills?: Json
          socials?: Json
          timeline?: Json
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin"
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
      app_role: ["admin"],
    },
  },
} as const
