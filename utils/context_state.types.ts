import { SupabaseClient, User } from "@supabase/supabase-js";

interface Database {
  public: {
    Tables: {
      click: {
        Row: {
          created_at: string;
          id: number;
          link_id: number;
          remote_ip: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          link_id: number;
          remote_ip: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          link_id?: number;
          remote_ip?: string;
        };
      };
      link: {
        Row: {
          created_at: string;
          icon_url: string;
          id: number;
          page_id: number;
          text: string;
          url: string;
        };
        Insert: {
          created_at?: string;
          icon_url: string;
          id?: number;
          page_id: number;
          text: string;
          url: string;
        };
        Update: {
          created_at?: string;
          icon_url?: string;
          id?: number;
          page_id?: number;
          text?: string;
          url?: string;
        };
      };
      page: {
        Row: {
          created_at: string;
          description: string;
          id: number;
          slug: string;
          title: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          id?: number;
          slug: string;
          title: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: number;
          slug?: string;
          title?: string;
          user_id?: string;
        };
      };
      visit: {
        Row: {
          created_at: string;
          id: number;
          page_id: number;
          remote_ip: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          page_id: number;
          remote_ip: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          page_id?: number;
          remote_ip?: string;
        };
      };
    };
    Views: {
      page_views: {
        Row: {
          count: number | null;
          id: number | null;
          slug: string | null;
          title: string | null;
          user_id: string | null;
        };
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type ContextState = {
  supabaseClient?: SupabaseClient<Database>;
  user?: User;
};
