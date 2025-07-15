
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { ExternalLink, MessageCircle } from "lucide-react";

const SupportPage = () => {
  const openCustomerSupport = () => {
    window.open("https://t.me/trexosupport", "_blank");
  };

  return (
    <MobileLayout showBackButton title="Customer Support">
      <div className="p-4 space-y-6 animate-fade-in">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
            <MessageCircle className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Need Help?</h2>
            <p className="text-muted-foreground">
              Our customer support team is available 24/7 to assist you with any questions or issues.
            </p>
          </div>
        </div>

        {/* Support Card */}
        <div className="bg-card rounded-xl p-6 border border-border/30">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Customer Support</h3>
            <p className="text-muted-foreground">
              Get instant help and support through our Telegram channel
            </p>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Contact us via</p>
              <p className="font-medium text-lg">@trexosupport</p>
            </div>

            <Button 
              onClick={openCustomerSupport}
              className="w-full py-3 bg-[#0088cc] hover:bg-[#0077b5] text-white font-medium flex items-center justify-center gap-2"
              size="lg"
            >
              <MessageCircle className="w-5 h-5" />
              Open Telegram Support
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Support Features */}
        <div className="bg-card rounded-xl p-5 border border-border/30">
          <h4 className="font-semibold mb-4">What we can help with:</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm">Account Issues</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm">Deposit & Withdrawal Problems</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm">Trading Questions</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm">Technical Support</span>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default SupportPage;
