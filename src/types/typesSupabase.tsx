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
      budget_data: {
        Row: {
          category: string
          cost: number
          frequency: string
          id: number
          inserted_at: string
          name: string
          transactiontype: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          cost: number
          frequency: string
          id?: number
          inserted_at?: string
          name: string
          transactiontype: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          cost?: number
          frequency?: string
          id?: number
          inserted_at?: string
          name?: string
          transactiontype?: string
          updated_at?: string
          user_id?: string
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
