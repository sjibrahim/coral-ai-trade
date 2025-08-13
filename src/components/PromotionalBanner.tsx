
import { useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const PromotionalBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "New users receive a",
      amount: "$6",
      subtitle: "bonus upon registration",
      bg: "from-teal-500 to-emerald-600"
    },
    {
      title: "Start trading with",
      amount: "$10",
      subtitle: "minimum deposit",
      bg: "from-blue-500 to-cyan-600"
    },
    {
      title: "Earn up to",
      amount: "85%",
      subtitle: "profit on trades",
      bg: "from-purple-500 to-indigo-600"
    }
  ];

  return (
    <div className="px-4 mb-6">
      <Carousel className="w-full">
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${slide.bg} p-6 text-white shadow-xl`}>
                <div className="absolute right-4 top-4 opacity-20">
                  <div className="flex space-x-2">
                    <div className="h-16 w-16 rounded-full bg-white/20"></div>
                    <div className="h-12 w-12 rounded-full bg-white/15 mt-4"></div>
                  </div>
                </div>
                <div className="relative z-10">
                  <div className="mb-2 flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                      <span className="text-sm font-bold">TC</span>
                    </div>
                    <span className="text-sm font-medium opacity-90">TCPatel</span>
                  </div>
                  <h3 className="mb-1 text-lg font-medium">{slide.title}</h3>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-bold text-yellow-300">{slide.amount}</span>
                    <span className="text-base">{slide.subtitle}</span>
                  </div>
                </div>
                {/* Phone mockup illustration */}
                <div className="absolute bottom-0 right-0 opacity-30">
                  <div className="h-20 w-12 rounded-t-lg bg-white/20 border-2 border-white/30">
                    <div className="h-2 w-6 mx-auto mt-1 rounded-full bg-white/40"></div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default PromotionalBanner;
