"use client";

/* Package System */
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from 'next/link';

/* Package Applicatio */
import { ImageSliderProps } from 'types/models/dashboard/dashboard.interface';
import '../../../../styles/global.css';
// import 'tailwindcss/tailwind.css';

const ImageSlider = ({ events }: ImageSliderProps) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  useEffect(() => {
    if (events.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % events.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [events]);

  if (!events || events.length === 0) return <div>No events available.</div>;

  return (
    <div className="relative rounded-lg overflow-hidden">
      {/* Image Slides */}
      <div
        className="flex transition-transform duration-500 ease-in-out h-[500px]"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {events.map((event) => (
           <Link key={event.id} href={`/event/${event.id}`} className="w-full h-full flex-shrink-0 relative group">
           <div className="w-full h-full">
             <Image
               src={event.imgLogoUrl ||  '/images/dashboard/card_pic.png'}
               alt={event.title}
               className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
               layout="fill"

             />
             {/* Overlay with Title */}
             <div className="absolute inset-0 bg-opacity-40 flex flex-col items-center justify-center text-white transition-opacity duration-300 group-hover:bg-opacity-60">
               <h2 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4 text-center">
                 {event.title}
               </h2>
             </div>
           </div>
         </Link>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev - 1 + events.length) % events.length)}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-opacity-30 p-2 md:p-3 rounded-full hover:bg-opacity-50 transition-all"
      >
        <ChevronLeft size={28} className="text-white" />
      </button>

      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % events.length)}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-opacity-30 p-2 md:p-3 rounded-full hover:bg-opacity-50 transition-all"
      >
        <ChevronRight size={28} className="text-white" />
      </button>
    </div>
  );
};

export default ImageSlider;