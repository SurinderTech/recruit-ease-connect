import { useState } from "react";
import { Upload, FileSpreadsheet, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface UploadCSVProps {
  onNext: () => void;
}

export const UploadCSV = ({ onNext }: UploadCSVProps) => {
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.name.endsWith(".csv")) {
        setFileName(file.name);
        toast.success("CSV file uploaded successfully!");
      } else {
        toast.error("Please upload a CSV file");
        e.target.value = "";
      }
    }
  };

  const handleNext = () => {
    if (!fileName) {
      toast.error("Please upload a CSV file first");
      return;
    }
    onNext();
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

          {fileName && (
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg animate-scale-in">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-success" />
                <p className="text-sm font-medium text-success">
                  {fileName}
                </p>
              </div>
            </div>
          )}

          <Button
            onClick={handleNext}
            variant="gradient"
            size="lg"
            className="w-full"
          >
            Next
            <ArrowRight className="ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
