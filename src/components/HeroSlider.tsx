import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';

interface Slide {
    image: string;
    alt: string;
}

interface HeroSliderProps {
    slides: Slide[];
}

export default function HeroSlider({ slides }: HeroSliderProps) {
    return (
        <div className="h-screen w-full relative">
            <Swiper
                modules={[Autoplay, EffectFade, Navigation]}
                effect="fade"
                speed={1500}
                navigation
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                loop={true}
                className="h-full w-full"
            >
                {slides.map((slide, idx) => (
                    <SwiperSlide key={idx} className="relative">
                        <div className="absolute inset-0 bg-black/20 z-10" /> {/* Overlay for text contrast if needed */}
                        <img
                            src={slide.image}
                            alt={slide.alt}
                            className="w-full h-full object-cover"
                        />
                        {/* Optional Caption could go here */}
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                <h1 className="text-4xl md:text-6xl text-white font-serif font-bold tracking-widest drop-shadow-lg text-center px-4 animate-fade-in">
                    ALTOS DE SOBERANA
                    <span className="block text-lg md:text-xl font-sans font-light mt-4 tracking-[0.2em] uppercase">
                        El Calafate • Patagonia
                    </span>
                </h1>
            </div>
        </div>
    );
}
