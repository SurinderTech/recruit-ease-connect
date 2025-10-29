import { useState } from "react";
import { Mail, Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface EmailTemplateProps {
  onNext: () => void;
}

export const EmailTemplate = ({ onNext }: EmailTemplateProps) => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handlePreview = () => {
    if (!subject || !body) {
      toast.error("Please fill in both subject and body");
      return;
    }
    toast.success("Preview clicked - Email template looks good!");
  };

  const handleNext = () => {
    if (!subject || !body) {
      toast.error("Please complete the email template");
      return;
    }
    onNext();
  };

  return (
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
            Use <code className="bg-muted px-2 py-1 rounded">{"{name}"}</code> and{" "}
            <code className="bg-muted px-2 py-1 rounded">{"{company}"}</code> to personalize each email.
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
              placeholder="Dear {name},&#10;&#10;I hope this message finds you well. I came across your profile and noticed your work at {company}...&#10;&#10;Looking forward to connecting!"
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
            >
              <Eye className="mr-2" />
              Preview Email
            </Button>
            <Button
              onClick={handleNext}
              variant="gradient"
              size="lg"
              className="flex-1"
            >
              Next
              <ArrowRight className="ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
