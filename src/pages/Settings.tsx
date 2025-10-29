import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, Key, Mail } from "lucide-react";

export const Settings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [fromName, setFromName] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        loadSettings(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/auth");
      } else if (session) {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadSettings = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        console.error("Error loading settings:", error);
        toast.error("Failed to load settings");
        return;
      }

      if (data) {
        setApiKey(data.api_key || "");
        setFromEmail(data.from_email || "");
        setFromName(data.from_name || "");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("user_settings")
        .upsert({
          user_id: user.id,
          api_key: apiKey,
          from_email: fromEmail,
          from_name: fromName,
        });

      if (error) throw error;

      toast.success("Settings saved successfully!");
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast.error(error.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-2">
              Configure your email service provider to start sending campaigns
            </p>
          </div>

          <Card className="shadow-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Resend API Configuration
              </CardTitle>
              <CardDescription>
                Enter your Resend API key to enable email sending. Get your API key from{" "}
                <a
                  href="https://resend.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  resend.com/api-keys
                </a>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="api-key">Resend API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="re_xxxxxxxxxxxxx"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Your API key is encrypted and stored securely
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="from-email">From Email</Label>
                  <Input
                    id="from-email"
                    type="email"
                    placeholder="noreply@yourdomain.com"
                    value={fromEmail}
                    onChange={(e) => setFromEmail(e.target.value)}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Must be a verified domain in Resend
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="from-name">From Name</Label>
                  <Input
                    id="from-name"
                    type="text"
                    placeholder="Your Company"
                    value={fromName}
                    onChange={(e) => setFromName(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  disabled={saving || loading}
                  className="w-full"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save Settings"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Setup Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">1. Create a Resend Account</h4>
                <p className="text-sm text-muted-foreground">
                  Sign up at{" "}
                  <a
                    href="https://resend.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    resend.com
                  </a>{" "}
                  if you haven't already
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">2. Verify Your Domain</h4>
                <p className="text-sm text-muted-foreground">
                  Add and verify your sending domain at{" "}
                  <a
                    href="https://resend.com/domains"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    resend.com/domains
                  </a>
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">3. Generate API Key</h4>
                <p className="text-sm text-muted-foreground">
                  Create a new API key at{" "}
                  <a
                    href="https://resend.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    resend.com/api-keys
                  </a>
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">4. Configure Above</h4>
                <p className="text-sm text-muted-foreground">
                  Paste your API key and verified email address in the form above
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};
