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
      "Access Requests": {
        Row: {
          id: number
          created_at: string | null
          f_name: string
          l_name: string
          email: string
        }
        Insert: {
          id?: number
          created_at?: string | null
          f_name: string
          l_name: string
          email: string
        }
        Update: {
          id?: number
          created_at?: string | null
          f_name?: string
          l_name?: string
          email?: string
        }
      }
      Auragraph: {
        Row: {
          id: string
          created_at: string | null
          last_updated: string
          aura_data: Json
          top_artists: Json
          genres: Json
        }
        Insert: {
          id: string
          created_at?: string | null
          last_updated?: string
          aura_data: Json
          top_artists: Json
          genres: Json
        }
        Update: {
          id?: string
          created_at?: string | null
          last_updated?: string
          aura_data?: Json
          top_artists?: Json
          genres?: Json
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
