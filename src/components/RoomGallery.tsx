import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type RoomImage = {
    image: string;
    alt: string;
};

interface RoomGalleryProps {
    images: RoomImage[];
}

export default function RoomGallery({ images }: RoomGalleryProps) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
    };

    const closeLightbox = () => {
        setLightboxIndex(null);
    };

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (lightboxIndex === null) return;
        setLightboxIndex((prev) => (prev! + 1) % images.length);
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (lightboxIndex === null) return;
        setLightboxIndex((prev) => (prev! - 1 + images.length) % images.length);
    };

    // If no images are provided, render nothing or a fallback (though parent usually handles fallback)
    if (!images || images.length === 0) return null;

    return (
        <div className="w-full">
            {/* Main Featured Image */}
            <div
                className="rounded-sm overflow-hidden shadow-lg aspect-[4/3] bg-stone-200 mb-6 relative group cursor-pointer"
                onClick={() => openLightbox(0)}
            >
                <img
                    src={images[0].image}
                    alt={images[0].alt || 'Habitación'}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e: any) => e.target.src = 'https://placehold.co/800x600/E3DDD3/8D7F71?text=Ver+Foto'}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 text-white font-medium bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm transition-opacity">
                        Ver Galería
                    </span>
                </div>
            </div>

            {/* Gallery Thumbs */}
            {images.length > 1 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.slice(1).map((img, idx) => (
                        <div
                            key={idx + 1}
                            className="aspect-square rounded-sm overflow-hidden shadow-sm cursor-pointer hover:opacity-80 transition-opacity bg-stone-100"
                            onClick={() => openLightbox(idx + 1)}
                        >
                            <img
                                src={img.image}
                                alt={img.alt || 'Detalle'}
                                className="w-full h-full object-cover"
                                onError={(e: any) => e.target.src = 'https://placehold.co/400x400/E3DDD3/8D7F71?text=Foto'}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
                        onClick={closeLightbox}
                    >
                        <button
                            onClick={closeLightbox}
                            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
                        >
                            <X size={32} />
                        </button>

                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-2 hidden sm:block"
                        >
                            <ChevronLeft size={48} />
                        </button>

                        <div
                            className="relative max-w-5xl w-full max-h-[85vh] flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <motion.img
                                key={lightboxIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                src={images[lightboxIndex].image}
                                alt={images[lightboxIndex].alt}
                                className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm"
                            />
                            <div className="absolute -bottom-10 left-0 right-0 text-center text-white/80 text-sm font-light tracking-wide">
                                {images[lightboxIndex].alt}
                            </div>
                        </div>

                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-2 hidden sm:block"
                        >
                            <ChevronRight size={48} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
