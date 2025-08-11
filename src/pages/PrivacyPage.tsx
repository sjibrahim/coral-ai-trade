import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const PrivacyPage = () => {
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
        <h1 className="text-lg font-semibold text-white">Privacy Policy</h1>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="relative z-10 p-4 space-y-6 pb-20">
          <div className="bg-white/[0.02] backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-white mb-2">Zygo AI Privacy Policy</h2>
                <p className="text-sm text-slate-400">Last updated: December 2024</p>
              </div>
              
              <section className="space-y-3">
                <h3 className="font-semibold text-lg text-white">1. Introduction</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  At Zygo AI, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our services.
                </p>
              </section>
              
              <section className="space-y-3">
                <h3 className="font-semibold text-lg text-white">2. Information We Collect</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  We collect information that you provide directly to us, such as when you create an account, complete a transaction, or contact customer support. This may include:
                </p>
                <ul className="list-disc pl-5 text-sm text-slate-300 space-y-1">
                  <li>Personal identifiers (name, email address, phone number)</li>
                  <li>Financial information for transactions</li>
                  <li>Identification documents for verification purposes</li>
                  <li>Communication records between you and our support team</li>
                </ul>
                <p className="text-sm text-slate-300 leading-relaxed mt-3">
                  We also collect information automatically when you use our services, including:
                </p>
                <ul className="list-disc pl-5 text-sm text-slate-300 space-y-1">
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage data (pages visited, time spent, actions taken)</li>
                  <li>Location information</li>
                </ul>
              </section>
              
              <section className="space-y-3">
                <h3 className="font-semibold text-lg text-white">3. How We Use Your Information</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  We use your information for the following purposes:
                </p>
                <ul className="list-disc pl-5 text-sm text-slate-300 space-y-1">
                  <li>To provide and maintain our services</li>
                  <li>To process transactions and manage your account</li>
                  <li>To comply with legal obligations and regulatory requirements</li>
                  <li>To detect and prevent fraud and security breaches</li>
                  <li>To improve our services and develop new features</li>
                  <li>To communicate with you about our services</li>
                </ul>
              </section>
              
              <section className="space-y-3">
                <h3 className="font-semibold text-lg text-white">4. Data Sharing and Disclosure</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  We may share your information with:
                </p>
                <ul className="list-disc pl-5 text-sm text-slate-300 space-y-1">
                  <li>Service providers who help us operate our business</li>
                  <li>Financial institutions to process transactions</li>
                  <li>Regulatory authorities and law enforcement when required</li>
                  <li>Professional advisors (e.g., lawyers, auditors)</li>
                </ul>
              </section>
              
              <section className="space-y-3">
                <h3 className="font-semibold text-lg text-white">5. Data Security</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  We implement appropriate security measures to protect your personal data from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
                </p>
              </section>
              
              <section className="space-y-3">
                <h3 className="font-semibold text-lg text-white">6. Your Rights</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Depending on your location, you may have certain rights regarding your personal data, including:
                </p>
                <ul className="list-disc pl-5 text-sm text-slate-300 space-y-1">
                  <li>The right to access and receive a copy of your data</li>
                  <li>The right to rectify inaccurate data</li>
                  <li>The right to request deletion of your data</li>
                  <li>The right to restrict or object to our processing of your data</li>
                  <li>The right to data portability</li>
                </ul>
              </section>
              
              <section className="space-y-3">
                <h3 className="font-semibold text-lg text-white">7. Changes to This Privacy Policy</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </section>
              
              <section className="space-y-3">
                <h3 className="font-semibold text-lg text-white">8. Contact Us</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at privacy@zygoai.com.
                </p>
              </section>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default PrivacyPage;