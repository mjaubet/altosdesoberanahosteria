import React, { useState, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type GalleryImage = {
    image: string;
    alt: string;
    category: string;
};

interface GalleryProps {
    images: GalleryImage[];
}

const CATEGORIES = ['TODAS', 'Habitaciones', 'Entorno', 'Interiores'];

export default function Gallery({ images }: GalleryProps) {
    const [activeCategory, setActiveCategory] = useState('TODAS');
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const filteredImages = useMemo(() => {
        if (activeCategory === 'TODAS') return images;
        return images.filter(img => img.category === activeCategory);
    }, [activeCategory, images]);

    // Find the index in the filtered list to allow smooth navigation even when filtered
    const openLightbox = (index: number) => {
        setLightboxIndex(index);
    };

    const closeLightbox = () => {
        setLightboxIndex(null);
    };

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (lightboxIndex === null) return;
        setLightboxIndex((prev) => (prev! + 1) % filteredImages.length);
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (lightboxIndex === null) return;
        setLightboxIndex((prev) => (prev! - 1 + filteredImages.length) % filteredImages.length);
    };

    return (
        <div className="w-full">
            {/* Filters */}
            <div className="flex flex-wrap gap-3 justify-center mb-8">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${activeCategory === cat
                                ? 'bg-patagonia-lake text-white shadow-md transform scale-105'
                                : 'bg-patagonia-snow text-stone-600 border border-stone-200 hover:bg-stone-100'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            >
                <AnimatePresence>
                    {filteredImages.map((img, idx) => (
                        <motion.div
                            key={img.image + idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="aspect-[4/3] rounded-lg overflow-hidden shadow-sm hover:shadow-lg cursor-pointer group"
                            onClick={() => openLightbox(idx)}
                        >
                            <img
                                src={img.image}
                                alt={img.alt}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

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
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
                        >
                            <motion.img
                                key={lightboxIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                src={filteredImages[lightboxIndex].image}
                                alt={filteredImages[lightboxIndex].alt}
                                className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm"
                            />
                            <div className="absolute -bottom-10 left-0 right-0 text-center text-white/80 text-sm font-light tracking-wide">
                                {filteredImages[lightboxIndex].alt}
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
