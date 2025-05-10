
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

const TermsPage = () => {
  return (
    <div className="flex flex-col min-h-[100svh] bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4">
          <Link to="/login" className="mr-3">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Terms of Service</h1>
        </div>
      </header>
      
      <ScrollArea className="flex-1 p-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-4">Nexbit Terms of Service</h2>
          <p className="text-muted-foreground mb-4">Last updated: May 10, 2025</p>
          
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-2">1. Introduction</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Welcome to Nexbit. These Terms of Service ("Terms") govern your use of the Nexbit platform, including our website, mobile applications, and all related services (collectively, the "Service"). 
              </p>
              <p className="text-sm text-muted-foreground">
                By accessing or using our Service, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Service.
              </p>
            </section>
            
            <section>
              <h3 className="text-lg font-semibold mb-2">2. Account Registration</h3>
              <p className="text-sm text-muted-foreground mb-2">
                To use certain features of our Service, you must register for an account. When you register, you agree to provide accurate, current, and complete information about yourself.
              </p>
              <p className="text-sm text-muted-foreground">
                You are responsible for safeguarding your account credentials and for all activities that occur under your account. Notify us immediately of any unauthorized use of your account.
              </p>
            </section>
            
            <section>
              <h3 className="text-lg font-semibold mb-2">3. User Responsibilities</h3>
              <p className="text-sm text-muted-foreground mb-2">
                You are responsible for your use of the Service and for any content you post. Content must not violate the rights of third parties or contain any material that is unlawful, defamatory, or otherwise objectionable.
              </p>
              <p className="text-sm text-muted-foreground">
                You agree not to use the Service for any illegal purpose or in violation of any local, state, national, or international law.
              </p>
            </section>
            
            <section>
              <h3 className="text-lg font-semibold mb-2">4. Referral Program</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Our referral program allows users to earn rewards by inviting others to join Nexbit. All referrals must be made in good faith, with genuine invitations to people who would be interested in our service.
              </p>
              <p className="text-sm text-muted-foreground">
                We reserve the right to cancel rewards and take appropriate action if we detect fraud, spam, or abuse of the referral system.
              </p>
            </section>
            
            <section>
              <h3 className="text-lg font-semibold mb-2">5. Payments and Withdrawals</h3>
              <p className="text-sm text-muted-foreground mb-2">
                All payment transactions are processed by our trusted payment partners. When you make a deposit or request a withdrawal, you agree to comply with the terms and verification processes of these payment processors.
              </p>
              <p className="text-sm text-muted-foreground">
                Withdrawals may be subject to processing periods and verification checks for security purposes.
              </p>
            </section>
            
            <section>
              <h3 className="text-lg font-semibold mb-2">6. Termination</h3>
              <p className="text-sm text-muted-foreground">
                We reserve the right to suspend or terminate your access to the Service at our discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users of the Service, us, or third parties, or for any other reason.
              </p>
            </section>
            
            <section>
              <h3 className="text-lg font-semibold mb-2">7. Changes to Terms</h3>
              <p className="text-sm text-muted-foreground">
                We may modify these Terms at any time. If we make changes, we will provide notice of such changes, such as by sending an email notification or providing notice through the Service. Your continued use of the Service following notification of changes constitutes your acceptance of our modified Terms.
              </p>
            </section>
            
            <section>
              <h3 className="text-lg font-semibold mb-2">8. Contact Us</h3>
              <p className="text-sm text-muted-foreground">
                If you have any questions about these Terms, please contact us at support@nexbit.com.
              </p>
            </section>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default TermsPage;
