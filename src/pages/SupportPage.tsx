
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Mail, Phone, HelpCircle, ExternalLink, Headphones } from "lucide-react";

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
    <MobileLayout showBackButton hideNavbar>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/40">
        <div className="px-3 py-4">
          {/* Hero Header */}
          <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 p-6 shadow-xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-white/10 transform translate-x-8 -translate-y-8"></div>
            <div className="absolute bottom-0 left-0 h-16 w-16 rounded-full bg-white/10 transform -translate-x-4 translate-y-4"></div>
            
            <div className="relative z-10 text-center text-white">
              <div className="flex items-center justify-center mb-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <Headphones className="h-5 w-5" />
                </div>
                <h1 className="text-xl font-bold">Support Center</h1>
              </div>
              <p className="text-blue-100 text-sm">We're here to help you 24/7</p>
            </div>
          </div>

          {/* Support Options */}
          <div className="space-y-3">
            {supportOptions.map((option, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="flex flex-col space-y-3 p-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <option.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-800">{option.title}</h3>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={option.action}
                    className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    Get Help
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default SupportPage;
