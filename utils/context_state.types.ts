import { SupabaseClient, User } from "@supabase/supabase-js";
import { Database } from "./database.types.ts";

export type ContextState = {
  supabaseClient?: SupabaseClient<Database>;
  user?: User;
};
