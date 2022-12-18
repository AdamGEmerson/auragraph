export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      Auragraph: {
        Row: {
          id: string
          created_at: string | null
          last_updated: string
          aura_data: Json
          top_artists: Json
        }
        Insert: {
          id: string
          created_at?: string | null
          last_updated?: string
          aura_data: Json
          top_artists: Json
        }
        Update: {
          id?: string
          created_at?: string | null
          last_updated?: string
          aura_data?: Json
          top_artists?: Json
        }
      }
      Authentication: {
        Row: {
          id: string
          created_at: string
          access_token: string
          expiration_date: string
          token_type: string
        }
        Insert: {
          id?: string
          created_at?: string
          access_token: string
          expiration_date: string
          token_type: string
        }
        Update: {
          id?: string
          created_at?: string
          access_token?: string
          expiration_date?: string
          token_type?: string
        }
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
  }
}
