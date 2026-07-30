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
      ambassador_applications: {
        Row: {
          audience_size: string | null
          city: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          instagram: string | null
          message: string
          phone: string | null
          profile_type: string
          state: string | null
          status: string
          updated_at: string
        }
        Insert: {
          audience_size?: string | null
          city?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          instagram?: string | null
          message: string
          phone?: string | null
          profile_type: string
          state?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          audience_size?: string | null
          city?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          instagram?: string | null
          message?: string
          phone?: string | null
          profile_type?: string
          state?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      bling_order_map: {
        Row: {
          bling_nfe_id: string | null
          bling_order_id: string | null
          created_at: string
          error_message: string | null
          nfe_key: string | null
          nfe_number: string | null
          nfe_status: string | null
          shopify_order_id: string
          shopify_order_name: string | null
          updated_at: string
        }
        Insert: {
          bling_nfe_id?: string | null
          bling_order_id?: string | null
          created_at?: string
          error_message?: string | null
          nfe_key?: string | null
          nfe_number?: string | null
          nfe_status?: string | null
          shopify_order_id: string
          shopify_order_name?: string | null
          updated_at?: string
        }
        Update: {
          bling_nfe_id?: string | null
          bling_order_id?: string | null
          created_at?: string
          error_message?: string | null
          nfe_key?: string | null
          nfe_number?: string | null
          nfe_status?: string | null
          shopify_order_id?: string
          shopify_order_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      bling_product_map: {
        Row: {
          bling_product_id: string | null
          created_at: string
          last_price: number | null
          last_stock: number | null
          last_synced_at: string | null
          shopify_inventory_item_id: string | null
          shopify_variant_id: string | null
          sku: string
          updated_at: string
        }
        Insert: {
          bling_product_id?: string | null
          created_at?: string
          last_price?: number | null
          last_stock?: number | null
          last_synced_at?: string | null
          shopify_inventory_item_id?: string | null
          shopify_variant_id?: string | null
          sku: string
          updated_at?: string
        }
        Update: {
          bling_product_id?: string | null
          created_at?: string
          last_price?: number | null
          last_stock?: number | null
          last_synced_at?: string | null
          shopify_inventory_item_id?: string | null
          shopify_variant_id?: string | null
          sku?: string
          updated_at?: string
        }
        Relationships: []
      }
      bling_sync_log: {
        Row: {
          created_at: string
          details: Json | null
          id: string
          kind: string
          message: string | null
          status: string
        }
        Insert: {
          created_at?: string
          details?: Json | null
          id?: string
          kind: string
          message?: string | null
          status: string
        }
        Update: {
          created_at?: string
          details?: Json | null
          id?: string
          kind?: string
          message?: string | null
          status?: string
        }
        Relationships: []
      }
      bling_tokens: {
        Row: {
          access_token: string
          created_at: string
          expires_at: string
          id: boolean
          refresh_token: string
          scope: string | null
          updated_at: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_at: string
          id?: boolean
          refresh_token: string
          scope?: string | null
          updated_at?: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_at?: string
          id?: boolean
          refresh_token?: string
          scope?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      dashboard_temperos: {
        Row: {
          ativo: boolean
          created_at: string
          custos_fixos_override: Json | null
          ean: string | null
          estoque_atual: number
          estoque_minimo: number
          foto_path: string | null
          gramas_pote: number
          id: string
          nome: string
          ordem: number
          preco_kg: number
          sku: string | null
          tabela_nutricional: Json | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          custos_fixos_override?: Json | null
          ean?: string | null
          estoque_atual?: number
          estoque_minimo?: number
          foto_path?: string | null
          gramas_pote?: number
          id?: string
          nome: string
          ordem?: number
          preco_kg?: number
          sku?: string | null
          tabela_nutricional?: Json | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          ativo?: boolean
          created_at?: string
          custos_fixos_override?: Json | null
          ean?: string | null
          estoque_atual?: number
          estoque_minimo?: number
          foto_path?: string | null
          gramas_pote?: number
          id?: string
          nome?: string
          ordem?: number
          preco_kg?: number
          sku?: string | null
          tabela_nutricional?: Json | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      dashboard_variables: {
        Row: {
          caixa: number
          comissao: number
          contabilidade_mensal: number
          created_at: string
          custo_fabril: number
          id: string
          lacre: number
          markup_atacado: number
          markup_cliente: number
          pote: number
          producao_estimada: number
          rotulo: number
          simples_nacional: number
          termoencolhivel: number
          transporte: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          caixa?: number
          comissao?: number
          contabilidade_mensal?: number
          created_at?: string
          custo_fabril?: number
          id?: string
          lacre?: number
          markup_atacado?: number
          markup_cliente?: number
          pote?: number
          producao_estimada?: number
          rotulo?: number
          simples_nacional?: number
          termoencolhivel?: number
          transporte?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          caixa?: number
          comissao?: number
          contabilidade_mensal?: number
          created_at?: string
          custo_fabril?: number
          id?: string
          lacre?: number
          markup_atacado?: number
          markup_cliente?: number
          pote?: number
          producao_estimada?: number
          rotulo?: number
          simples_nacional?: number
          termoencolhivel?: number
          transporte?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      pricing_history: {
        Row: {
          applied_at: string
          applied_by: string | null
          currency: string
          id: string
          new_price: number
          previous_price: number | null
          reason: string | null
          reverted: boolean
          reverted_at: string | null
          reverted_by: string | null
          rule_id: string | null
          shopify_variant_id: string | null
          sku: string
        }
        Insert: {
          applied_at?: string
          applied_by?: string | null
          currency?: string
          id?: string
          new_price: number
          previous_price?: number | null
          reason?: string | null
          reverted?: boolean
          reverted_at?: string | null
          reverted_by?: string | null
          rule_id?: string | null
          shopify_variant_id?: string | null
          sku: string
        }
        Update: {
          applied_at?: string
          applied_by?: string | null
          currency?: string
          id?: string
          new_price?: number
          previous_price?: number | null
          reason?: string | null
          reverted?: boolean
          reverted_at?: string | null
          reverted_by?: string | null
          rule_id?: string | null
          shopify_variant_id?: string | null
          sku?: string
        }
        Relationships: [
          {
            foreignKeyName: "pricing_history_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "pricing_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_rules: {
        Row: {
          active: boolean
          created_at: string
          created_by: string | null
          id: string
          markup_multiplier: number
          min_margin_pct: number | null
          name: string
          sublinha: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          created_by?: string | null
          id?: string
          markup_multiplier: number
          min_margin_pct?: number | null
          name: string
          sublinha: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          created_by?: string | null
          id?: string
          markup_multiplier?: number
          min_margin_pct?: number | null
          name?: string
          sublinha?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_costs: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          sku: string
          source: string
          unit_cost: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          sku: string
          source?: string
          unit_cost: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          sku?: string
          source?: string
          unit_cost?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      product_reviews: {
        Row: {
          author_name: string
          body: string
          city: string | null
          created_at: string
          id: string
          product_handle: string
          rating: number
          status: string
          title: string | null
          updated_at: string
        }
        Insert: {
          author_name: string
          body: string
          city?: string | null
          created_at?: string
          id?: string
          product_handle: string
          rating: number
          status?: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          author_name?: string
          body?: string
          city?: string | null
          created_at?: string
          id?: string
          product_handle?: string
          rating?: number
          status?: string
          title?: string | null
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
      app_role: "admin" | "manager" | "user"
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
      app_role: ["admin", "manager", "user"],
    },
  },
} as const
