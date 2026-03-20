import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-admin-password",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const adminPassword = Deno.env.get("ADMIN_PASSWORD");
  if (!adminPassword) {
    return new Response(JSON.stringify({ error: "Admin not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const providedPassword = req.headers.get("x-admin-password");
  if (providedPassword !== adminPassword) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: signups, error } = await supabase
    .from("waitlist_signups")
    .select("*")
    .order("position", { ascending: true });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Build referral tree
  const referralMap: Record<string, string[]> = {};
  const emailMap: Record<string, string> = {};
  for (const s of signups || []) {
    emailMap[s.id] = s.email;
    if (s.referred_by) {
      if (!referralMap[s.referred_by]) referralMap[s.referred_by] = [];
      referralMap[s.referred_by].push(s.id);
    }
  }

  const stats = {
    total: signups?.length || 0,
    ios: signups?.filter((s: any) => s.platform === "ios").length || 0,
    android: signups?.filter((s: any) => s.platform === "android").length || 0,
    noPlatform: signups?.filter((s: any) => !s.platform).length || 0,
    withReferrals: signups?.filter((s: any) => s.referral_count > 0).length || 0,
    referredUsers: signups?.filter((s: any) => s.referred_by).length || 0,
    todaySignups: signups?.filter((s: any) => {
      const today = new Date().toISOString().split("T")[0];
      return s.created_at.startsWith(today);
    }).length || 0,
  };

  return new Response(
    JSON.stringify({ signups, stats, referralMap, emailMap }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
});
