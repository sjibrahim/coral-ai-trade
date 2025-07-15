
import MobileLayout from "@/components/layout/MobileLayout";
import { ScrollArea } from "@/components/ui/scroll-area";

const TermsPage = () => {
  return (
    <MobileLayout showBackButton title="Terms of Service">
      <ScrollArea className="h-[calc(100vh-60px)]">
        <div className="p-4 space-y-6 pb-20">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Nexbit Terms of Service</h2>
            <p className="text-sm text-muted-foreground">Last updated: May 10, 2025</p>
            
            <section className="space-y-2">
              <h3 className="font-semibold text-lg">1. Acceptance of Terms</h3>
              <p className="text-sm">
                By accessing or using Nexbit's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>
            
            <section className="space-y-2">
              <h3 className="font-semibold text-lg">2. Description of Services</h3>
              <p className="text-sm">
                Nexbit provides a platform for cryptocurrency trading and related services. We reserve the right to modify, suspend, or discontinue any part of our services at any time without prior notice.
              </p>
            </section>
            
            <section className="space-y-2">
              <h3 className="font-semibold text-lg">3. User Accounts</h3>
              <p className="text-sm">
                To use certain features of our services, you may need to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
              </p>
            </section>
            
            <section className="space-y-2">
              <h3 className="font-semibold text-lg">4. User Conduct</h3>
              <p className="text-sm">
                You agree not to use our services for any illegal purpose or in violation of any local, state, national, or international law. You also agree not to:
              </p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Manipulate or interfere with our services</li>
                <li>Use automated means to access our services</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Engage in any activity that disrupts or interferes with our services</li>
              </ul>
            </section>
            
            <section className="space-y-2">
              <h3 className="font-semibold text-lg">5. Risk Disclosure</h3>
              <p className="text-sm">
                Cryptocurrency trading involves significant risk. The value of cryptocurrencies can be highly volatile, and you may lose some or all of your investment. You should only invest what you can afford to lose.
              </p>
            </section>
            
            <section className="space-y-2">
              <h3 className="font-semibold text-lg">6. Limitation of Liability</h3>
              <p className="text-sm">
                In no event shall Nexbit, its affiliates, or their respective officers, directors, employees, or agents be liable for any damages whatsoever, including direct, indirect, incidental, special, consequential, or punitive damages.
              </p>
            </section>
            
            <section className="space-y-2">
              <h3 className="font-semibold text-lg">7. Changes to Terms</h3>
              <p className="text-sm">
                We reserve the right to update or modify these Terms of Service at any time without prior notice. Your continued use of our services after any changes indicates your acceptance of the new terms.
              </p>
            </section>
            
            <section className="space-y-2">
              <h3 className="font-semibold text-lg">8. Governing Law</h3>
              <p className="text-sm">
                These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction in which Nexbit is established, without regard to its conflict of law provisions.
              </p>
            </section>
            
            <section className="space-y-2">
              <h3 className="font-semibold text-lg">9. Contact Information</h3>
              <p className="text-sm">
                If you have any questions about these Terms of Service, please contact us at support@nexbit.com.
              </p>
            </section>
          </div>
        </div>
      </ScrollArea>
    </MobileLayout>
  );
};

export default TermsPage;
