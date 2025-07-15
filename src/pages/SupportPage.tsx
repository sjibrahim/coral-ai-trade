import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Mail, Phone, HelpCircle, ExternalLink } from "lucide-react";

const SupportPage = () => {
  // Sample support options data
  const supportOptions = [
    {
      title: "Contact Support",
      description: "Get in touch with our support team for assistance.",
      icon: MessageCircle,
      action: () => alert("Contacting support..."),
    },
    {
      title: "Email Us",
      description: "Send us an email with your questions or concerns.",
      icon: Mail,
      action: () => window.location.href = "mailto:support@example.com",
    },
    {
      title: "Call Us",
      description: "Speak to a representative over the phone.",
      icon: Phone,
      action: () => window.location.href = "tel:+18001234567",
    },
    {
      title: "Help Center",
      description: "Find answers to common questions in our help center.",
      icon: HelpCircle,
      action: () => window.open("https://example.com/help", "_blank"),
    },
    {
      title: "Visit Our Website",
      description: "Learn more about our services and features.",
      icon: ExternalLink,
      action: () => window.open("https://example.com", "_blank"),
    },
  ];
  
  return (
    <MobileLayout showBackButton title="Support Center">
      <div className="p-4 space-y-4 animate-fade-in">
        {/* Support Options */}
        {supportOptions.map((option, index) => (
          <Card key={index} className="bg-card rounded-xl border border-border/50">
            <CardContent className="flex flex-col space-y-3 p-4">
              <div className="flex items-center space-x-3">
                <option.icon className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">{option.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{option.description}</p>
              <Button variant="outline" onClick={option.action}>
                Learn More
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </MobileLayout>
  );
};

export default SupportPage;
