
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      assets: {
        Row: {
          brand_id: string
          created_at: string
          file_path: string
          file_type: string
          file_url: string
          id: string
          name: string
          user_id: string
          // Fix: Add optional campaign field to match usage in the application.
          campaign?: string | null
        }
        Insert: {
          brand_id: string
          created_at?: string
          file_path: string
          file_type: string
          file_url: string
          id?: string
          name: string
          user_id: string
          // Fix: Add optional campaign field to match usage in the application.
          campaign?: string | null
        }
        Update: {
          brand_id?: string
          created_at?: string
          file_path?: string
          file_type?: string
          file_url?: string
          id?: string
          name?: string
          user_id?: string
          // Fix: Add optional campaign field to match usage in the application.
          campaign?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_brand_id_fkey"
            columns: ["brand_id"]
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      brands: {
        Row: {
          created_at: string
          description: string | null
          font: string | null
          id: string
          logo_url: string | null
          name: string
          primary_color: string | null
          secondary_color: string | null
          user_id: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          font?: string | null
          id?: string
          logo_url?: string | null
          name: string
          primary_color?: string | null
          secondary_color?: string | null
          user_id: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          font?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          primary_color?: string | null
          secondary_color?: string | null
          user_id?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brands_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      launches: {
        Row: {
          brand_id: string
          created_at: string
          description: string | null
          id: string
          launch_date: string
          name: string
          status: "upcoming" | "launched" | "cancelled"
          user_id: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          description?: string | null
          id?: string
          launch_date: string
          name: string
          status?: "upcoming" | "launched" | "cancelled"
          user_id: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          description?: string | null
          id?: string
          launch_date?: string
          name?: string
          status?: "upcoming" | "launched" | "cancelled"
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "launches_brand_id_fkey"
            columns: ["brand_id"]
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "launches_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}