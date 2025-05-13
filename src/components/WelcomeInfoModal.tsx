
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Rocket, Check, Zap } from "lucide-react";
import { useGeneralSettings } from "@/hooks/use-general-settings";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export function WelcomeInfoModal() {
  const [open, setOpen] = useState(false);
  const { settings, loading } = useGeneralSettings();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  useEffect(() => {
    const hasSeenModal = localStorage.getItem("nexbit_welcome_seen");
    
    if (!hasSeenModal) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("nexbit_welcome_seen", "true");
    setOpen(false);
    setCurrentStep(1);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(curr => curr + 1);
    } else {
      handleClose();
    }
  };

  const openTelegramChannel = () => {
    window.open(settings.telegram_channel || "https://t.me/nexbit_official", "_blank");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md border-none bg-gradient-to-br from-[#141824] to-[#0f1219] p-0 overflow-hidden shadow-xl">
        <div className="p-0">
          {/* Progress indicators */}
          <div className="flex justify-center space-x-2 py-4">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <motion.div
                key={i}
                className={`h-1 rounded-full ${i < currentStep ? "bg-blue-500" : "bg-gray-700"}`}
                style={{ width: `${100 / totalSteps - 2}%` }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: i < currentStep ? 1 : 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              />
            ))}
          </div>

          {/* Step 1: Welcome */}
          {currentStep === 1 && (
            <motion.div
              className="px-6 py-4 space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="flex justify-center">
                <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-10 w-10 text-blue-400" />
                  </motion.div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="text-center space-y-2">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Welcome to Nexbit
                </h2>
                <p className="text-gray-300">Your Premier Crypto Trading Platform</p>
              </motion.div>

              <motion.div 
                variants={itemVariants} 
                className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-5 rounded-xl border border-blue-500/20"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-blue-400" />
                      <p className="text-xs text-gray-400">Daily Profit</p>
                    </div>
                    <p className="font-bold text-green-400">
                      {settings.daily_profit || "1.5"}%
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-blue-400" />
                      <p className="text-xs text-gray-400">USDT Price</p>
                    </div>
                    <p className="font-bold text-white">₹{settings.usdt_price || "85"}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-blue-400" />
                      <p className="text-xs text-gray-400">Min Deposit</p>
                    </div>
                    <p className="font-bold text-white">₹{settings.min_deposit || "300"}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-blue-400" />
                      <p className="text-xs text-gray-400">Min Withdraw</p>
                    </div>
                    <p className="font-bold text-white">₹{settings.min_withdrawal || "300"}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button 
                  onClick={nextStep} 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Step 2: Features */}
          {currentStep === 2 && (
            <motion.div
              className="px-6 py-4 space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white">Platform Features</h2>
                <p className="text-gray-400">Everything you need to succeed</p>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-blue-500/10 rounded-lg">
                  <div className="bg-blue-500/20 p-2 rounded-full">
                    <Zap className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Real-time Trading</h3>
                    <p className="text-sm text-gray-400">Trade with live prices from global markets</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-purple-500/10 rounded-lg">
                  <div className="bg-purple-500/20 p-2 rounded-full">
                    <Rocket className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Daily Signals</h3>
                    <p className="text-sm text-gray-400">Get professional trading signals daily</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-amber-500/10 rounded-lg">
                  <div className="bg-amber-500/20 p-2 rounded-full">
                    <Sparkles className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">USDT Withdrawal</h3>
                    <p className="text-sm text-gray-400">Convert & withdraw profits to USDT</p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button 
                  onClick={nextStep} 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Step 3: Connect */}
          {currentStep === 3 && (
            <motion.div
              className="px-6 py-4 space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div 
                variants={itemVariants} 
                className="flex justify-center"
              >
                <div className="w-16 h-16 bg-[#0088cc]/20 rounded-full flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#0088cc]" fill="currentColor">
                    <path d="M12,0c-6.627,0 -12,5.373 -12,12c0,6.627 5.373,12 12,12c6.627,0 12,-5.373 12,-12c0,-6.627 -5.373,-12 -12,-12Zm0,22c-5.514,0 -10,-4.486 -10,-10c0,-5.514 4.486,-10 10,-10c5.514,0 10,4.486 10,10c0,5.514 -4.486,10 -10,10Zm2.692,-14.401c0.427,0.154 0.743,0.393 0.752,0.7c0.017,0.612 -0.994,1.094 -1.042,1.479c-0.145,1.239 2.077,1.882 1.567,3.697c-0.175,0.622 -1.071,1.128 -1.871,1.128c-0.617,0 -1.172,-0.244 -1.481,-0.582c-0.353,-0.386 -0.6,-0.992 -0.587,-1.355c0.022,-0.586 0.536,-0.882 0.536,-0.882c0,0 -0.02,0.637 0.143,0.924c0.102,0.181 0.297,0.291 0.465,0.291c0.339,0 0.747,-0.317 0.747,-0.627c0,-0.973 -1.277,-1.083 -1.277,-2.529c0,-0.897 0.812,-1.63 1.662,-1.63c0.28,0 0.57,0.058 0.819,0.175l0.031,1.162l-0.464,0.049Zm-2.956,0l-0.001,0.158l-0.003,0.369c-0.001,0.32 -0.01,3.186 -0.01,3.186l-1.838,-0.017l-0.019,0.49l2.913,0.01l0.019,-0.491l-0.565,-0.003l0.001,-3.702l-0.497,0Z"/>
                  </svg>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="text-center space-y-2">
                <h2 className="text-xl font-bold text-white">Join Our Community</h2>
                <p className="text-gray-400">Get daily signals and trading tips</p>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-[#0088cc]/10 p-4 rounded-lg border border-[#0088cc]/20">
                <div className="flex flex-col items-center space-y-3">
                  <p className="text-center text-gray-300">
                    Follow our Telegram channel to receive daily trading signals and important announcements
                  </p>
                  <div className="pulse-animation w-12 h-12 rounded-full bg-[#0088cc]/20 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#0088cc]" fill="currentColor">
                      <path d="M12,0c-6.627,0 -12,5.373 -12,12c0,6.627 5.373,12 12,12c6.627,0 12,-5.373 12,-12c0,-6.627 -5.373,-12 -12,-12Zm0,22c-5.514,0 -10,-4.486 -10,-10c0,-5.514 4.486,-10 10,-10c5.514,0 10,4.486 10,10c0,5.514 -4.486,10 -10,10Zm2.692,-14.401c0.427,0.154 0.743,0.393 0.752,0.7c0.017,0.612 -0.994,1.094 -1.042,1.479c-0.145,1.239 2.077,1.882 1.567,3.697c-0.175,0.622 -1.071,1.128 -1.871,1.128c-0.617,0 -1.172,-0.244 -1.481,-0.582c-0.353,-0.386 -0.6,-0.992 -0.587,-1.355c0.022,-0.586 0.536,-0.882 0.536,-0.882c0,0 -0.02,0.637 0.143,0.924c0.102,0.181 0.297,0.291 0.465,0.291c0.339,0 0.747,-0.317 0.747,-0.627c0,-0.973 -1.277,-1.083 -1.277,-2.529c0,-0.897 0.812,-1.63 1.662,-1.63c0.28,0 0.57,0.058 0.819,0.175l0.031,1.162l-0.464,0.049Zm-2.956,0l-0.001,0.158l-0.003,0.369c-0.001,0.32 -0.01,3.186 -0.01,3.186l-1.838,-0.017l-0.019,0.49l2.913,0.01l0.019,-0.491l-0.565,-0.003l0.001,-3.702l-0.497,0Z"/>
                    </svg>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex space-x-3">
                <Button 
                  onClick={openTelegramChannel} 
                  className="flex-1 bg-[#0088cc] hover:bg-[#0077b5] text-white"
                >
                  Join Telegram
                </Button>
                <Button 
                  onClick={handleClose} 
                  variant="outline"
                  className="flex-1 bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Maybe Later
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
