import React from 'react';

interface PageHeroProps {
    title: string;
    subtitle?: string; // This will be the paragraph below title
    image?: string;
    className?: string; // Allow extra styling
}

export default function PageHero({ title, subtitle, image, className = '' }: PageHeroProps) {
    // Default to a dark gradient if no image is provided
    const bgStyle = image
        ? { backgroundImage: `url(${image})` }
        : { backgroundColor: '#1E293B' }; // patagonia-deep default

    return (
        <div
            className={`relative w-full h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden ${className}`}
        >
            {/* Background Layer */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={bgStyle}
            >
                {/* Overlay for contrast */}
                <div className={`absolute inset-0 bg-black/40 ${!image ? 'opacity-0' : ''}`} />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in mt-10">
                <h1 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-wide shadow-black/10 drop-shadow-md mb-6">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-lg md:text-xl text-patagonia-snow font-light leading-relaxed drop-shadow-sm">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}
