
import MobileLayout from "@/components/layout/MobileLayout";
import { ScrollArea } from "@/components/ui/scroll-area";

const PrivacyPage = () => {
  return (
    <MobileLayout showBackButton title="Privacy Policy">
      <ScrollArea className="h-[calc(100vh-60px)]">
        <div className="p-4 space-y-6 pb-20">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Nexbit Privacy Policy</h2>
            <p className="text-sm text-muted-foreground">Last updated: May 10, 2025</p>
            
            <section className="space-y-2">
              <h3 className="font-semibold text-lg">1. Introduction</h3>
              <p className="text-sm">
                At Nexbit, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our services.
              </p>
            </section>
            
            <section className="space-y-2">
              <h3 className="font-semibold text-lg">2. Information We Collect</h3>
              <p className="text-sm">
                We collect information that you provide directly to us, such as when you create an account, complete a transaction, or contact customer support. This may include:
              </p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Personal identifiers (name, email address, phone number)</li>
                <li>Financial information for transactions</li>
                <li>Identification documents for verification purposes</li>
                <li>Communication records between you and our support team</li>
              </ul>
              <p className="text-sm mt-2">
                We also collect information automatically when you use our services, including:
              </p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data (pages visited, time spent, actions taken)</li>
                <li>Location information</li>
              </ul>
            </section>
            
            <section className="space-y-2">
              <h3 className="font-semibold text-lg">3. How We Use Your Information</h3>
              <p className="text-sm">
                We use your information for the following purposes:
              </p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>To provide and maintain our services</li>
                <li>To process transactions and manage your account</li>
                <li>To comply with legal obligations and regulatory requirements</li>
                <li>To detect and prevent fraud and security breaches</li>
                <li>To improve our services and develop new features</li>
                <li>To communicate with you about our services</li>
              </ul>
            </section>
            
            <section className="space-y-2">
              <h3 className="font-semibold text-lg">4. Data Sharing and Disclosure</h3>
              <p className="text-sm">
                We may share your information with:
              </p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Service providers who help us operate our business</li>
                <li>Financial institutions to process transactions</li>
                <li>Regulatory authorities and law enforcement when required</li>
                <li>Professional advisors (e.g., lawyers, auditors)</li>
              </ul>
            </section>
            
            <section className="space-y-2">
              <h3 className="font-semibold text-lg">5. Data Security</h3>
              <p className="text-sm">
                We implement appropriate security measures to protect your personal data from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
              </p>
            </section>
            
            <section className="space-y-2">
              <h3 className="font-semibold text-lg">6. Your Rights</h3>
              <p className="text-sm">
                Depending on your location, you may have certain rights regarding your personal data, including:
              </p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>The right to access and receive a copy of your data</li>
                <li>The right to rectify inaccurate data</li>
                <li>The right to request deletion of your data</li>
                <li>The right to restrict or object to our processing of your data</li>
                <li>The right to data portability</li>
              </ul>
            </section>
            
            <section className="space-y-2">
              <h3 className="font-semibold text-lg">7. Changes to This Privacy Policy</h3>
              <p className="text-sm">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>
            
            <section className="space-y-2">
              <h3 className="font-semibold text-lg">8. Contact Us</h3>
              <p className="text-sm">
                If you have any questions about this Privacy Policy, please contact us at privacy@nexbit.com.
              </p>
            </section>
          </div>
        </div>
      </ScrollArea>
    </MobileLayout>
  );
};

export default PrivacyPage;
