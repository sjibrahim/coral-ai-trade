import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const TermsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, #3b82f6 2px, transparent 2px),
                             radial-gradient(circle at 80% 80%, #8b5cf6 2px, transparent 2px)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        <div className="absolute top-10 right-5 w-20 h-20 bg-blue-500/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 left-5 w-24 h-24 bg-purple-500/5 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center p-4 border-b border-white/10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mr-3 text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold text-white">Terms of Service</h1>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="relative z-10 p-4 space-y-6 pb-20">
          <div className="bg-white/[0.02] backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-white mb-2">Zygo AI Terms of Service</h2>
                <p className="text-sm text-slate-400">Last updated: December 2024</p>
              </div>
              
              <section className="space-y-3">
                <h3 className="font-semibold text-lg text-white">1. Acceptance of Terms</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  By accessing or using Zygo AI's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                </p>
              </section>
              
              <section className="space-y-3">
                <h3 className="font-semibold text-lg text-white">2. Description of Services</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Zygo AI provides a platform for AI-powered cryptocurrency trading and related services. We reserve the right to modify, suspend, or discontinue any part of our services at any time without prior notice.
                </p>
              </section>
              
              <section className="space-y-3">
                <h3 className="font-semibold text-lg text-white">3. User Accounts</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  To use certain features of our services, you may need to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
                </p>
              </section>
              
              <section className="space-y-3">
                <h3 className="font-semibold text-lg text-white">4. User Conduct</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  You agree not to use our services for any illegal purpose or in violation of any local, state, national, or international law. You also agree not to:
                </p>
                <ul className="list-disc pl-5 text-sm text-slate-300 space-y-1">
                  <li>Manipulate or interfere with our services</li>
                  <li>Use automated means to access our services</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Engage in any activity that disrupts or interferes with our services</li>
                </ul>
              </section>
              
              <section className="space-y-3">
                <h3 className="font-semibold text-lg text-white">5. Risk Disclosure</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Cryptocurrency trading involves significant risk. The value of cryptocurrencies can be highly volatile, and you may lose some or all of your investment. You should only invest what you can afford to lose.
                </p>
              </section>
              
              <section className="space-y-3">
                <h3 className="font-semibold text-lg text-white">6. Limitation of Liability</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  In no event shall Zygo AI, its affiliates, or their respective officers, directors, employees, or agents be liable for any damages whatsoever, including direct, indirect, incidental, special, consequential, or punitive damages.
                </p>
              </section>
              
              <section className="space-y-3">
                <h3 className="font-semibold text-lg text-white">7. Changes to Terms</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  We reserve the right to update or modify these Terms of Service at any time without prior notice. Your continued use of our services after any changes indicates your acceptance of the new terms.
                </p>
              </section>
              
              <section className="space-y-3">
                <h3 className="font-semibold text-lg text-white">8. Governing Law</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction in which Zygo AI is established, without regard to its conflict of law provisions.
                </p>
              </section>
              
              <section className="space-y-3">
                <h3 className="font-semibold text-lg text-white">9. Contact Information</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us at support@zygoai.com.
                </p>
              </section>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default TermsPage;