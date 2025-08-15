
import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const ImageSlider = () => {
  const slides = [
    {
      id: 1,
      image: "https://tnl-icons.duckdns.org/green/dash/upload/20250507/d57abc557698041f15b0da24a0138384.png",
      alt: "Slide 1"
    },
    {
      id: 2,
      image: "https://tnl-icons.duckdns.org/green/dash/upload/20250507/d06cb800f742a61d7dc708e413268d77.png",
      alt: "Slide 2"
    }
  ];

  return (
    <div className="px-4 mb-6">
      <Carousel className="w-full">
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="relative overflow-hidden rounded-2xl">
                <img 
                  src={slide.image} 
                  alt={slide.alt}
                  className="w-full h-48 object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default ImageSlider;
