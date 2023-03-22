import { SupabaseClient, User } from "@supabase/supabase-js";

export type ContextState = {
  supabaseClient?: SupabaseClient;
  user?: User;
};
