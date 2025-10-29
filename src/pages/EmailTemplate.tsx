import { useState, useEffect } from "react";
import { Mail, Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface EmailTemplateProps {
  onNext: () => void;
  campaignId: string;
}

export const EmailTemplate = ({ onNext, campaignId }: EmailTemplateProps) => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sampleContact, setSampleContact] = useState<any>(null);

  useEffect(() => {
    loadSampleContact();
  }, [campaignId]);

  const loadSampleContact = async () => {
    const { data } = await supabase
      .from("email_contacts")
      .select("*")
      .eq("campaign_id", campaignId)
      .limit(1)
      .single();

    if (data) {
      setSampleContact(data);
    }
  };

  const personalizeText = (text: string) => {
    if (!sampleContact) return text;
    
    return text
      .replace(/{name}/g, sampleContact.name)
      .replace(/{email}/g, sampleContact.email)
      .replace(/{company}/g, sampleContact.company || "[Company]")
      .replace(/{role}/g, sampleContact.role || "[Role]");
  };

  const handlePreview = () => {
    if (!subject || !body) {
      toast.error("Please fill in both subject and body");
      return;
    }
    setShowPreview(true);
  };

  const handleNext = async () => {
    if (!subject || !body) {
      toast.error("Please complete the email template");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("email_campaigns")
        .update({
          subject,
          body,
        })
        .eq("id", campaignId);

      if (error) throw error;

      toast.success("Template saved successfully!");
      onNext();
    } catch (error: any) {
      console.error("Error saving template:", error);
      toast.error(error.message || "Failed to save template");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-3xl mx-auto animate-fade-in">
        <Card className="shadow-card bg-gradient-card border-border/50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-primary/10">
                <Mail className="w-12 h-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Write Your Email Template</CardTitle>
            <CardDescription className="text-base mt-2">
              Use <code className="bg-muted px-2 py-1 rounded">{"{name}"}</code>,{" "}
              <code className="bg-muted px-2 py-1 rounded">{"{company}"}</code>,{" "}
              and <code className="bg-muted px-2 py-1 rounded">{"{role}"}</code> to personalize each email.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-base font-semibold">
                Email Subject
              </Label>
              <Input
                id="subject"
                placeholder="e.g., Exciting Opportunity at {company}"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body" className="text-base font-semibold">
                Email Body
              </Label>
              <Textarea
                id="body"
                placeholder="Dear {name},&#10;&#10;I hope this message finds you well. I came across your profile and noticed your work at {company} as a {role}...&#10;&#10;Looking forward to connecting!"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-[250px] text-base resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Tip: Keep your message professional and personalized
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handlePreview}
                variant="outline"
                size="lg"
                className="flex-1"
                disabled={!sampleContact}
              >
                <Eye className="mr-2" />
                Preview Email
              </Button>
              <Button
                onClick={handleNext}
                variant="gradient"
                size="lg"
                className="flex-1"
                disabled={saving}
              >
                {saving ? "Saving..." : "Next"}
                <ArrowRight className="ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Email Preview</DialogTitle>
            <DialogDescription>
              This is how your email will look to {sampleContact?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold">To:</Label>
              <p className="text-sm text-muted-foreground">{sampleContact?.email}</p>
            </div>
            <div>
              <Label className="text-sm font-semibold">Subject:</Label>
              <p className="text-sm">{personalizeText(subject)}</p>
            </div>
            <div>
              <Label className="text-sm font-semibold">Body:</Label>
              <div className="mt-2 p-4 bg-muted rounded-lg whitespace-pre-wrap text-sm">
                {personalizeText(body)}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
