import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  campaign_id: string;
  batch_size?: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const { campaign_id, batch_size = 10 }: EmailRequest = await req.json();

    console.log(`Processing emails for campaign: ${campaign_id}`);

    // Get user's email settings
    const { data: settings, error: settingsError } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (settingsError || !settings?.api_key) {
      console.error("Settings error:", settingsError);
      return new Response(
        JSON.stringify({ 
          error: "Email service not configured. Please add your Resend API key in Settings." 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Resend API client setup
    const resendApiKey = settings.api_key;

    // Get campaign details
    const { data: campaign, error: campaignError } = await supabase
      .from("email_campaigns")
      .select("*")
      .eq("id", campaign_id)
      .eq("user_id", user.id)
      .single();

    if (campaignError || !campaign) {
      throw new Error("Campaign not found");
    }

    // Get pending contacts (limit to batch_size)
    const { data: contacts, error: contactsError } = await supabase
      .from("email_contacts")
      .select("*")
      .eq("campaign_id", campaign_id)
      .eq("status", "pending")
      .limit(batch_size);

    if (contactsError) {
      throw new Error(`Failed to fetch contacts: ${contactsError.message}`);
    }

    if (!contacts || contacts.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: "No pending emails to send",
          sent: 0,
          failed: 0 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Found ${contacts.length} contacts to process`);

    let sentCount = 0;
    let failedCount = 0;

    // Process each contact
    for (const contact of contacts) {
      try {
        // Personalize email body
        let personalizedBody = campaign.body
          .replace(/{name}/g, contact.name)
          .replace(/{email}/g, contact.email)
          .replace(/{company}/g, contact.company || "")
          .replace(/{role}/g, contact.role || "");

        let personalizedSubject = campaign.subject
          .replace(/{name}/g, contact.name)
          .replace(/{company}/g, contact.company || "");

        console.log(`Sending email to: ${contact.email}`);

        // Send email via Resend API
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: settings.from_email || "onboarding@resend.dev",
            to: [contact.email],
            subject: personalizedSubject,
            html: personalizedBody.replace(/\n/g, "<br>"),
          }),
        });

        if (!emailResponse.ok) {
          const errorData = await emailResponse.json();
          throw new Error(errorData.message || "Failed to send email");
        }

        const emailData = await emailResponse.json();
        console.log(`Email sent successfully to ${contact.email}:`, emailData);

        // Update contact status
        await supabase
          .from("email_contacts")
          .update({
            status: "sent",
            sent_at: new Date().toISOString(),
          })
          .eq("id", contact.id);

        sentCount++;
      } catch (error: any) {
        console.error(`Failed to send email to ${contact.email}:`, error);

        // Update contact with error
        await supabase
          .from("email_contacts")
          .update({
            status: "failed",
            error_message: error.message || "Unknown error",
          })
          .eq("id", contact.id);

        failedCount++;
      }
    }

    // Update campaign statistics
    const { data: updatedCampaign } = await supabase
      .from("email_campaigns")
      .select("sent_count, failed_count")
      .eq("id", campaign_id)
      .single();

    if (updatedCampaign) {
      await supabase
        .from("email_campaigns")
        .update({
          sent_count: (updatedCampaign.sent_count || 0) + sentCount,
          failed_count: (updatedCampaign.failed_count || 0) + failedCount,
          status: "sending",
        })
        .eq("id", campaign_id);
    }

    console.log(`Batch complete - Sent: ${sentCount}, Failed: ${failedCount}`);

    return new Response(
      JSON.stringify({
        message: "Batch processing complete",
        sent: sentCount,
        failed: failedCount,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-bulk-emails function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
