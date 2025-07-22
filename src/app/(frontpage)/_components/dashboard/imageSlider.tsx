"use client";

/* Package System */
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from "next/image";
import Link from 'next/link';
import { useState, useEffect } from 'react';

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
               src={event.imgPosterUrl ||  '/images/dashboard/card_pic.png'}
               alt={event.title}
               className="w-full h-full object-cover"
               layout="fill"

             />
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