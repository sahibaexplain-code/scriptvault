import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "@/lib/env";
import { SUPABASE_SERVICE_ROLE_KEY, requireSecret } from "@/lib/server-env";

/**
 * Service-role client. BYPASSES Row Level Security.
 * Only use inside server code after you have checked who the caller is.
 */
export function createAdminClient() {
  return createClient(SUPABASE_URL, requireSecret("SUPABASE_SERVICE_ROLE_KEY", SUPABASE_SERVICE_ROLE_KEY), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
