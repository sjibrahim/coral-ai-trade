
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPage = () => {
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
          <h1 className="text-lg font-semibold">Privacy Policy</h1>
        </div>
      </header>
      
      <ScrollArea className="flex-1 p-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-4">Nexbit Privacy Policy</h2>
          <p className="text-muted-foreground mb-4">Last updated: May 10, 2025</p>
          
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-2">1. Introduction</h3>
              <p className="text-sm text-muted-foreground">
                At Nexbit, we value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and share information about you when you use our website, mobile applications, and services (collectively, the "Service").
              </p>
            </section>
            
            <section>
              <h3 className="text-lg font-semibold mb-2">2. Information We Collect</h3>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Personal Information:</strong> When you register for an account, we collect your name, email address, phone number, and password.
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Financial Information:</strong> For deposits and withdrawals, we may collect bank account details, cryptocurrency wallet addresses, and transaction history.
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Identity Verification:</strong> We may collect government-issued identification documents and other information required for KYC (Know Your Customer) verification.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Usage Data:</strong> We collect information about how you interact with our Service, including access times, pages viewed, and the features you use.
              </p>
            </section>
            
            <section>
              <h3 className="text-lg font-semibold mb-2">3. How We Use Your Information</h3>
              <p className="text-sm text-muted-foreground mb-2">
                We use your information to:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Provide, maintain, and improve our Service</li>
                <li>Process transactions and send related information</li>
                <li>Verify your identity and prevent fraud</li>
                <li>Communicate with you about your account and our Service</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-lg font-semibold mb-2">4. How We Share Your Information</h3>
              <p className="text-sm text-muted-foreground mb-2">
                We may share your information with:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Service providers who perform services on our behalf</li>
                <li>Financial institutions and payment processors to facilitate transactions</li>
                <li>Law enforcement or other authorities when required by law</li>
                <li>Professional advisors, such as lawyers, auditors, and insurers</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-lg font-semibold mb-2">5. Data Security</h3>
              <p className="text-sm text-muted-foreground">
                We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
              </p>
            </section>
            
            <section>
              <h3 className="text-lg font-semibold mb-2">6. Your Rights</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>The right to access and receive a copy of your personal information</li>
                <li>The right to correct inaccurate or incomplete information</li>
                <li>The right to request deletion of your personal information</li>
                <li>The right to restrict or object to processing of your personal information</li>
                <li>The right to data portability</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-lg font-semibold mb-2">7. Changes to this Privacy Policy</h3>
              <p className="text-sm text-muted-foreground">
                We may update this Privacy Policy from time to time. If we make material changes, we will notify you by email or through the Service. Your continued use of the Service after such notice constitutes your acceptance of the revised Privacy Policy.
              </p>
            </section>
            
            <section>
              <h3 className="text-lg font-semibold mb-2">8. Contact Us</h3>
              <p className="text-sm text-muted-foreground">
                If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at privacy@nexbit.com.
              </p>
            </section>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default PrivacyPage;
