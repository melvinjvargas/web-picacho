export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          image_url?: string | null;
        };
        Update: {
          name?: string;
          slug?: string;
          image_url?: string | null;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          category: string;
          price: number;
          original_price: number | null;
          is_active: boolean;
          is_new: boolean;
          design_description: string | null;
          sizes: string[];
          colors: Record<string, unknown>[];
          images: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          category: string;
          price: number;
          original_price?: number | null;
          is_active?: boolean;
          is_new?: boolean;
          design_description?: string | null;
          sizes?: string[];
          colors?: Record<string, unknown>[];
          images?: string[];
        };
        Update: {
          name?: string;
          slug?: string;
          category?: string;
          price?: number;
          original_price?: number | null;
          is_active?: boolean;
          is_new?: boolean;
          design_description?: string | null;
          sizes?: string[];
          colors?: Record<string, unknown>[];
          images?: string[];
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          customer_name: string | null;
          customer_phone: string | null;
          items: Record<string, unknown>[];
          total: number;
          status: string;
          whatsapp_message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_name?: string | null;
          customer_phone?: string | null;
          items: Record<string, unknown>[];
          total: number;
          status?: string;
          whatsapp_message?: string | null;
        };
        Update: {
          customer_name?: string | null;
          customer_phone?: string | null;
          items?: Record<string, unknown>[];
          total?: number;
          status?: string;
          whatsapp_message?: string | null;
        };
        Relationships: [];
      };
      discounts: {
        Row: {
          id: string;
          code: string;
          percentage: number;
          fixed_amount: number | null;
          is_active: boolean;
          usage_count: number;
          valid_from: string | null;
          valid_until: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          percentage?: number;
          fixed_amount?: number | null;
          is_active?: boolean;
          usage_count?: number;
          valid_from?: string | null;
          valid_until?: string | null;
        };
        Update: {
          code?: string;
          percentage?: number;
          fixed_amount?: number | null;
          is_active?: boolean;
          usage_count?: number;
          valid_from?: string | null;
          valid_until?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
  };
}
