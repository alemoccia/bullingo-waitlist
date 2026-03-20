import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, platform, referred_by } = await req.json();

    // Get client IP from headers
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check if this IP already signed up
    if (ip && ip !== "unknown") {
      const { data: existing } = await supabase
        .from("waitlist_signups")
        .select("id")
        .eq("ip_address", ip)
        .maybeSingle();

      if (existing) {
        return new Response(
          JSON.stringify({ error: "Already signed up from this device" }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Resolve referrer
    let referredById: string | null = null;
    if (referred_by) {
      const { data: referrer } = await supabase
        .from("waitlist_signups")
        .select("id")
        .eq("referral_code", referred_by)
        .maybeSingle();
      if (referrer) referredById = referrer.id;
    }

    const { data, error } = await supabase
      .from("waitlist_signups")
      .insert({
        email,
        platform: platform || null,
        referred_by: referredById,
        ip_address: ip !== "unknown" ? ip : null,
      })
      .select("id, position, referral_code")
      .single();

    if (error) {
      if (error.code === "23505") {
        // Could be email or IP duplicate
        const msg = error.message.includes("ip_address")
          ? "Already signed up from this device"
          : "You're already on the waitlist!";
        return new Response(
          JSON.stringify({ error: msg }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw error;
    }

    // Add subscriber to MailerLite
    const mailerLiteKey = Deno.env.get("MAILERLITE_API_KEY");
    if (mailerLiteKey) {
      try {
        const origin = req.headers.get("origin") || "https://bullingo.com";
        const referralLink = `${origin}?ref=${data.referral_code}`;

        const subscriberPayload: Record<string, unknown> = {
          email,
          fields: {
            referral_code: data.referral_code,
            referral_link: referralLink,
            waitlist_position: String(data.position),
            ...(platform ? { platform } : {}),
          },
        };

        // Add to group if configured
        const groupId = Deno.env.get("MAILERLITE_GROUP_ID");
        if (groupId) {
          subscriberPayload.groups = [groupId];
        }

        await fetch("https://connect.mailerlite.com/api/subscribers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${mailerLiteKey}`,
          },
          body: JSON.stringify(subscriberPayload),
        });
      } catch {
        // Don't block signup if MailerLite fails
        console.error("MailerLite API call failed");
      }
    }

    // Get total count
    const { count } = await supabase
      .from("waitlist_signups")
      .select("*", { count: "exact", head: true });

    return new Response(
      JSON.stringify({
        id: data.id,
        position: data.position,
        referralCode: data.referral_code,
        totalWaiters: count || data.position,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Something went wrong" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
