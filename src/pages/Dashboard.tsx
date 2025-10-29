import { useState, useEffect } from "react";
import { BarChart3, Send, CheckCircle, AlertCircle, XCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface DashboardProps {
  campaignId: string;
}

export const Dashboard = ({ campaignId }: DashboardProps) => {
  const [campaign, setCampaign] = useState<any>(null);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampaignData();
    
    // Refresh data every 5 seconds while sending
    const interval = setInterval(() => {
      if (campaign?.status === "sending") {
        loadCampaignData();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [campaignId, campaign?.status]);

  const loadCampaignData = async () => {
    try {
      const { data, error } = await supabase
        .from("email_campaigns")
        .select("*")
        .eq("id", campaignId)
        .single();

      if (error) throw error;
      setCampaign(data);
    } catch (error) {
      console.error("Error loading campaign:", error);
      toast.error("Failed to load campaign data");
    } finally {
      setLoading(false);
    }
  };

  const handleSendNow = async () => {
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-bulk-emails", {
        body: {
          campaign_id: campaignId,
          batch_size: 10,
        },
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(`Batch complete! Sent: ${data.sent}, Failed: ${data.failed}`);
        loadCampaignData();
      }
    } catch (error: any) {
      console.error("Error sending emails:", error);
      toast.error(error.message || "Failed to send emails");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const pendingCount = campaign?.total_contacts - (campaign?.sent_count || 0) - (campaign?.failed_count || 0);

  const stats = [
    {
      icon: CheckCircle,
      label: "Sent Successfully",
      value: campaign?.sent_count || 0,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      icon: AlertCircle,
      label: "Pending",
      value: pendingCount || 0,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: XCircle,
      label: "Failed",
      value: campaign?.failed_count || 0,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in space-y-6">
      <Card className="shadow-card bg-gradient-card border-border/50">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/10">
              <BarChart3 className="w-12 h-12 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">{campaign?.name}</CardTitle>
          <CardDescription className="text-base mt-2">
            Monitor your email campaign progress
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105 animate-scale-in border-border/50"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-card bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="text-xl">Campaign Actions</CardTitle>
          <CardDescription>
            Send emails in batches to manage your campaign effectively
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleSendNow}
            variant="gradient"
            size="lg"
            className="w-full"
            disabled={sending || pendingCount === 0}
          >
            {sending ? (
              <>
                <RefreshCw className="mr-2 animate-spin" />
                Sending Batch...
              </>
            ) : (
              <>
                <Send className="mr-2" />
                Send Next Batch (10 emails)
              </>
            )}
          </Button>
          
          {pendingCount === 0 && campaign?.sent_count > 0 && (
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg text-center">
              <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
              <p className="font-semibold text-success">Campaign Complete!</p>
              <p className="text-sm text-muted-foreground mt-1">
                All emails have been processed
              </p>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            <p>• Emails are sent in batches of 10</p>
            <p>• Click "Send Next Batch" to continue sending</p>
            <p>• Make sure you've configured your email settings first</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
