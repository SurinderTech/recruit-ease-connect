import { useState } from "react";
import { Upload, FileSpreadsheet, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface UploadCSVProps {
  onNext: (campaignId: string) => void;
  userId: string;
}

export const UploadCSV = ({ onNext, userId }: UploadCSVProps) => {
  const [fileName, setFileName] = useState<string>("");
  const [campaignName, setCampaignName] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [csvData, setCsvData] = useState<any[]>([]);

  const parseCSV = (text: string): any[] => {
    const lines = text.split("\n").filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map(v => v.trim());
      if (values.length === headers.length) {
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        data.push(row);
      }
    }

    return data;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.name.endsWith(".csv")) {
        setFileName(file.name);
        
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          const parsed = parseCSV(text);
          
          if (parsed.length === 0) {
            toast.error("CSV file is empty or invalid format");
            return;
          }

          const requiredFields = ["name", "email"];
          const hasRequired = requiredFields.every(field => 
            parsed[0].hasOwnProperty(field)
          );

          if (!hasRequired) {
            toast.error("CSV must contain 'name' and 'email' columns");
            return;
          }

          setCsvData(parsed);
          toast.success(`CSV file uploaded! Found ${parsed.length} contacts`);
        };
        reader.readAsText(file);
      } else {
        toast.error("Please upload a CSV file");
        e.target.value = "";
      }
    }
  };

  const handleNext = async () => {
    if (!fileName || csvData.length === 0) {
      toast.error("Please upload a CSV file first");
      return;
    }

    if (!campaignName.trim()) {
      toast.error("Please enter a campaign name");
      return;
    }

    setUploading(true);

    try {
      // Create campaign
      const { data: campaign, error: campaignError } = await supabase
        .from("email_campaigns")
        .insert({
          user_id: userId,
          name: campaignName,
          subject: "",
          body: "",
          status: "draft",
          total_contacts: csvData.length,
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      // Insert contacts
      const contacts = csvData.map(row => ({
        user_id: userId,
        campaign_id: campaign.id,
        name: row.name,
        email: row.email,
        company: row.company || "",
        role: row.role || "",
        status: "pending",
      }));

      const { error: contactsError } = await supabase
        .from("email_contacts")
        .insert(contacts);

      if (contactsError) throw contactsError;

      toast.success("Campaign created successfully!");
      onNext(campaign.id);
    } catch (error: any) {
      console.error("Error creating campaign:", error);
      toast.error(error.message || "Failed to create campaign");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <Card className="shadow-card bg-gradient-card border-border/50">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/10">
              <FileSpreadsheet className="w-12 h-12 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Upload Recruiter List</CardTitle>
          <CardDescription className="text-base mt-2">
            Upload recruiter CSV with columns: name, email, company, role.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="campaign-name">Campaign Name</Label>
            <Input
              id="campaign-name"
              placeholder="e.g., Tech Recruiters Q1 2025"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
            />
          </div>

          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors duration-200">
            <label htmlFor="csv-upload" className="cursor-pointer block">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">CSV files only</p>
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {fileName && csvData.length > 0 && (
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg animate-scale-in">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-success" />
                <div>
                  <p className="text-sm font-medium text-success">{fileName}</p>
                  <p className="text-xs text-muted-foreground">
                    {csvData.length} contacts loaded
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={handleNext}
            variant="gradient"
            size="lg"
            className="w-full"
            disabled={uploading}
          >
            {uploading ? "Creating Campaign..." : "Next"}
            <ArrowRight className="ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
