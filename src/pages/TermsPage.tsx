
import MobileLayout from "@/components/layout/MobileLayout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Shield } from "lucide-react";

const TermsPage = () => {
  return (
    <MobileLayout showBackButton hideNavbar>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/40">
        <div className="px-3 py-4">
          {/* Hero Header */}
          <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-600 via-gray-600 to-zinc-600 p-6 shadow-xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-white/10 transform translate-x-8 -translate-y-8"></div>
            <div className="absolute bottom-0 left-0 h-16 w-16 rounded-full bg-white/10 transform -translate-x-4 translate-y-4"></div>
            
            <div className="relative z-10 text-center text-white">
              <div className="flex items-center justify-center mb-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <FileText className="h-5 w-5" />
                </div>
                <h1 className="text-xl font-bold">Terms of Service</h1>
              </div>
              <p className="text-slate-100 text-sm">Please read our terms and conditions</p>
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-0 shadow-lg space-y-6 pb-20">
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800">Nexbit Terms of Service</h2>
                <p className="text-sm text-gray-600">Last updated: May 10, 2025</p>
                
                <section className="space-y-2">
                  <h3 className="font-semibold text-lg text-gray-800">1. Acceptance of Terms</h3>
                  <p className="text-sm text-gray-600">
                    By accessing or using Nexbit's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                  </p>
                </section>
                
                <section className="space-y-2">
                  <h3 className="font-semibold text-lg text-gray-800">2. Description of Services</h3>
                  <p className="text-sm text-gray-600">
                    Nexbit provides a platform for cryptocurrency trading and related services. We reserve the right to modify, suspend, or discontinue any part of our services at any time without prior notice.
                  </p>
                </section>
                
                <section className="space-y-2">
                  <h3 className="font-semibold text-lg text-gray-800">3. User Accounts</h3>
                  <p className="text-sm text-gray-600">
                    To use certain features of our services, you may need to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
                  </p>
                </section>
                
                <section className="space-y-2">
                  <h3 className="font-semibold text-lg text-gray-800">4. User Conduct</h3>
                  <p className="text-sm text-gray-600">
                    You agree not to use our services for any illegal purpose or in violation of any local, state, national, or international law. You also agree not to:
                  </p>
                  <ul className="list-disc pl-5 text-sm space-y-1 text-gray-600">
                    <li>Manipulate or interfere with our services</li>
                    <li>Use automated means to access our services</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Engage in any activity that disrupts or interferes with our services</li>
                  </ul>
                </section>
                
                <section className="space-y-2">
                  <h3 className="font-semibold text-lg text-gray-800">5. Risk Disclosure</h3>
                  <p className="text-sm text-gray-600">
                    Cryptocurrency trading involves significant risk. The value of cryptocurrencies can be highly volatile, and you may lose some or all of your investment. You should only invest what you can afford to lose.
                  </p>
                </section>
                
                <section className="space-y-2">
                  <h3 className="font-semibold text-lg text-gray-800">6. Limitation of Liability</h3>
                  <p className="text-sm text-gray-600">
                    In no event shall Nexbit, its affiliates, or their respective officers, directors, employees, or agents be liable for any damages whatsoever, including direct, indirect, incidental, special, consequential, or punitive damages.
                  </p>
                </section>
                
                <section className="space-y-2">
                  <h3 className="font-semibold text-lg text-gray-800">7. Changes to Terms</h3>
                  <p className="text-sm text-gray-600">
                    We reserve the right to update or modify these Terms of Service at any time without prior notice. Your continued use of our services after any changes indicates your acceptance of the new terms.
                  </p>
                </section>
                
                <section className="space-y-2">
                  <h3 className="font-semibold text-lg text-gray-800">8. Governing Law</h3>
                  <p className="text-sm text-gray-600">
                    These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction in which Nexbit is established, without regard to its conflict of law provisions.
                  </p>
                </section>
                
                <section className="space-y-2">
                  <h3 className="font-semibold text-lg text-gray-800">9. Contact Information</h3>
                  <p className="text-sm text-gray-600">
                    If you have any questions about these Terms of Service, please contact us at support@nexbit.com.
                  </p>
                </section>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </MobileLayout>
  );
};

export default TermsPage;
