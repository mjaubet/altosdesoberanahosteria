import React, { useEffect, useState } from 'react';

interface FooterLogoProps {
    src: string;
    alt: string;
    className?: string;
}

export default function FooterLogo({ src, alt, className = '' }: FooterLogoProps) {
    const [svgContent, setSvgContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadSVG = async () => {
            try {
                const svgPath = src.startsWith('/') ? src : `/${src}`;
                const response = await fetch(svgPath);

                if (!response.ok) {
                    throw new Error(`Failed to load SVG: ${response.status} ${response.statusText}`);
                }

                const text = await response.text();
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(text, 'image/svg+xml');
                const svgElement = svgDoc.querySelector('svg');

                if (svgElement) {
                    svgElement.removeAttribute('width');
                    svgElement.removeAttribute('height');

                    const currentViewBox = svgElement.getAttribute('viewBox');
                    if (currentViewBox === '0 0 764.28 355.89') {
                        svgElement.setAttribute('viewBox', '20 60 730 250');
                    }

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
            className={`text-white ${className}`}
            dangerouslySetInnerHTML={{ __html: svgContent }}
            aria-label={alt}
        />
    );
}
