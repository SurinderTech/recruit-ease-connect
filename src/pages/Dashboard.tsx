import { BarChart3, Send, Clock, Users, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const Dashboard = () => {
  const handleSendNow = () => {
    toast.success("Sending emails now...", {
      description: "Your bulk email campaign has been initiated!",
    });
    console.log("Send Now clicked");
  };

  const handleScheduleDaily = () => {
    toast.success("Daily schedule created!", {
      description: "Emails will be sent automatically every day at 9:00 AM",
    });
    console.log("Schedule Daily clicked");
  };

  const stats = [
    {
      icon: Users,
      label: "Total Recruiters",
      value: "50",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: CheckCircle,
      label: "Sent Today",
      value: "10",
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      icon: AlertCircle,
      label: "Pending",
      value: "40",
      color: "text-accent",
      bgColor: "bg-accent/10",
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
          <CardTitle className="text-3xl font-bold">Email Automation Dashboard</CardTitle>
          <CardDescription className="text-base mt-2">
            Monitor your email campaigns and manage bulk sending
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
            Send your emails immediately or schedule them for daily delivery
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleSendNow}
            variant="gradient"
            size="lg"
            className="flex-1"
          >
            <Send className="mr-2" />
            Send Now
          </Button>
          <Button
            onClick={handleScheduleDaily}
            variant="default"
            size="lg"
            className="flex-1"
          >
            <Clock className="mr-2" />
            Schedule Daily
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-card bg-muted/30 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-muted-foreground">10 emails sent successfully today</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <AlertCircle className="w-4 h-4 text-accent" />
              <span className="text-muted-foreground">40 emails pending in queue</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">50 total recruiters in database</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
