import React, { useEffect, useState } from 'react';

interface LogoSVGProps {
    src: string;
    alt: string;
    className?: string;
    isScrolled: boolean;
}

export default function LogoSVG({ src, alt, className = '', isScrolled }: LogoSVGProps) {
    const [svgContent, setSvgContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadSVG = async () => {
            try {
                // Ensure the path is correct - if it starts with /, it's relative to public folder
                const svgPath = src.startsWith('/') ? src : `/${src}`;

                const response = await fetch(svgPath);

                if (!response.ok) {
                    throw new Error(`Failed to load SVG: ${response.status} ${response.statusText}`);
                }

                const text = await response.text();

                // Parse SVG and optimize viewBox
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(text, 'image/svg+xml');
                const svgElement = svgDoc.querySelector('svg');

                if (svgElement) {
                    // Remove any existing width/height attributes to make it responsive
                    svgElement.removeAttribute('width');
                    svgElement.removeAttribute('height');

                    // Optimize viewBox for "Altos de Soberana" logo
                    // Original viewBox has too much padding, we'll tighten it
                    const currentViewBox = svgElement.getAttribute('viewBox');
                    if (currentViewBox === '0 0 764.28 355.89') {
                        // Adjusted viewBox to remove padding and center the content better
                        svgElement.setAttribute('viewBox', '20 60 730 250');
                    }

                    // Add currentColor to all paths so they inherit the text color
                    const paths = svgElement.querySelectorAll('path');
                    paths.forEach(path => {
                        if (!path.hasAttribute('fill') || path.getAttribute('fill') === 'black' || path.getAttribute('fill') === '#000000') {
                            path.setAttribute('fill', 'currentColor');
                        }
                    });

                    setSvgContent(svgElement.outerHTML);
                } else {
                    throw new Error('No SVG element found in the file');
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Error loading SVG:', error, 'Path:', src);
                setIsLoading(false);
                // Set empty content so it falls back to nothing
                setSvgContent('');
            }
        };

        if (src) {
            loadSVG();
        } else {
            setIsLoading(false);
        }
    }, [src]);

    if (isLoading) {
        return <div className={className} />;
    }

    return (
        <div
            className={`transition-colors duration-500 ${className} ${isScrolled ? 'text-patagonia-deep' : 'text-white'
                }`}
            dangerouslySetInnerHTML={{ __html: svgContent }}
            aria-label={alt}
        />
    );
}
