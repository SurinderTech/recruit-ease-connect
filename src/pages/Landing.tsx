import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Upload, Zap, Clock, Target, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            🚀 RecruitEase
          </h1>
          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => navigate("/auth")}>
              Login
            </Button>
            <Button variant="gradient" onClick={() => navigate("/auth?tab=signup")}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Smart Bulk Email Sender for{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Recruiters
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Automate your recruitment outreach with personalized bulk emails. Upload your
            recruiter list, customize templates, and send thousands of emails effortlessly.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button size="lg" variant="gradient" onClick={() => navigate("/auth?tab=signup")}>
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose RecruitEase?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 space-y-4 hover:shadow-glow transition-all duration-300 animate-scale-in">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Easy CSV Upload</h3>
            <p className="text-muted-foreground">
              Simply upload your recruiter data in CSV format with name, email, company, and role
              fields.
            </p>
          </Card>

          <Card className="p-6 space-y-4 hover:shadow-glow transition-all duration-300 animate-scale-in delay-100">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Personalized Templates</h3>
            <p className="text-muted-foreground">
              Use variables like {"{name}"} and {"{company}"} to create personalized messages
              that stand out.
            </p>
          </Card>

          <Card className="p-6 space-y-4 hover:shadow-glow transition-all duration-300 animate-scale-in delay-200">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Instant Sending</h3>
            <p className="text-muted-foreground">
              Send or schedule your emails with one click. Track delivery status in real-time.
            </p>
          </Card>

          <Card className="p-6 space-y-4 hover:shadow-glow transition-all duration-300 animate-scale-in delay-300">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Schedule Campaigns</h3>
            <p className="text-muted-foreground">
              Plan your outreach strategy by scheduling emails for optimal delivery times.
            </p>
          </Card>

          <Card className="p-6 space-y-4 hover:shadow-glow transition-all duration-300 animate-scale-in delay-400">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Smart Analytics</h3>
            <p className="text-muted-foreground">
              Monitor your campaign performance with detailed statistics and insights.
            </p>
          </Card>

          <Card className="p-6 space-y-4 hover:shadow-glow transition-all duration-300 animate-scale-in delay-500">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Secure & Reliable</h3>
            <p className="text-muted-foreground">
              Your data is encrypted and secure. Built on enterprise-grade infrastructure.
            </p>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20 bg-muted/30">
        <h2 className="text-3xl font-bold text-center mb-12">
          How It Works
        </h2>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Upload Your Recruiter List</h3>
              <p className="text-muted-foreground">
                Import a CSV file with columns: name, email, company, and role. Our system
                validates and processes your data instantly.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Create Your Email Template</h3>
              <p className="text-muted-foreground">
                Write a compelling subject and message. Use personalization variables to make
                each email unique and relevant to the recipient.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Send or Schedule</h3>
              <p className="text-muted-foreground">
                Choose to send immediately or schedule for later. Monitor your campaign progress
                from the dashboard with real-time updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-6 bg-card p-12 rounded-2xl shadow-glow">
          <h2 className="text-4xl font-bold">
            Ready to Transform Your Recruitment Outreach?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of recruiters who trust RecruitEase for their email campaigns.
          </p>
          <Button size="lg" variant="gradient" onClick={() => navigate("/auth?tab=signup")}>
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>Developed by Surinder Kumar</p>
          <p className="mt-2">© 2025 RecruitEase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
