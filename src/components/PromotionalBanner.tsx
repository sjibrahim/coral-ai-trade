
import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from "@/components/ui/carousel";
import { TrendingUp, Wallet, Gift } from "lucide-react";

const PromotionalBanner = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const slides = [
    {
      title: "New users receive a",
      amount: "$6",
      subtitle: "bonus upon registration",
      bg: "from-coral-500 to-coral-600",
      image: "/lovable-uploads/878f13b5-368b-418f-aa30-037ca279396f.png",
      icon: <Gift className="w-6 h-6" />
    },
    {
      title: "Start trading with",
      amount: "$10",
      subtitle: "minimum deposit",
      bg: "from-blue-500 to-cyan-600",
      image: "/lovable-uploads/96bbf5be-34b4-46fc-b37f-6e38b84f6772.png",
      icon: <Wallet className="w-6 h-6" />
    },
    {
      title: "Earn up to",
      amount: "85%",
      subtitle: "profit on trades",
      bg: "from-purple-500 to-indigo-600",
      image: "/lovable-uploads/878f13b5-368b-418f-aa30-037ca279396f.png",
      icon: <TrendingUp className="w-6 h-6" />
    }
  ];

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="px-4 mb-6">
      <Carousel 
        className="w-full"
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${slide.bg} p-6 text-white shadow-xl`}>
                {/* Background Image */}
                <div className="absolute inset-0 opacity-20">
                  <img 
                    src={slide.image} 
                    alt="Background" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Background Blur Overlay */}
                <div className="absolute inset-0 backdrop-blur-sm bg-black/10"></div>
                
                <div className="relative z-10">
                  <div className="mb-2 flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                      {slide.icon}
                    </div>
                    <span className="text-sm font-medium opacity-90">Coral</span>
                  </div>
                  <h3 className="mb-1 text-lg font-medium">{slide.title}</h3>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-bold text-yellow-300">{slide.amount}</span>
                    <span className="text-base">{slide.subtitle}</span>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute bottom-0 right-0 opacity-30">
                  <div className="h-20 w-12 rounded-t-lg bg-white/20 border-2 border-white/30">
                    <div className="h-2 w-6 mx-auto mt-1 rounded-full bg-white/40"></div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Indicators */}
        <div className="flex justify-center mt-4 space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                current === index ? "bg-coral-400 w-6" : "bg-gray-600"
              }`}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
};

export default PromotionalBanner;
