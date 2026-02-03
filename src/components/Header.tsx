import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const LINKS = [
    { name: 'Inicio', href: '/' },
    { name: 'Hostería', href: '/hosteria' },
    { name: 'Habitaciones', href: '/habitaciones' },
    { name: 'Servicios', href: '/servicios' },
    { name: 'Galería', href: '/galeria' },
    { name: 'Contacto', href: '/contacto' },
];

interface HeaderProps {
    logo?: string;
}

export default function Header({ logo }: HeaderProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <a href="/" className="flex items-center gap-2">
                    {logo ? (
                        <img
                            src={logo}
                            alt="Altos de Soberana"
                            className="h-12 w-auto object-contain transition-all"
                        />
                    ) : (
                        <span className={`text-2xl font-serif font-bold tracking-tighter transition-colors ${scrolled ? 'text-patagonia-deep' : 'text-white drop-shadow-md'
                            }`}>
                            Altos de Soberana
                        </span>
                    )}
                </a>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-8 items-center">
                    {LINKS.map(link => (
                        <a
                            key={link.name}
                            href={link.href}
                            className={`text-sm font-medium tracking-wide uppercase hover:text-patagonia-lake transition-colors ${scrolled ? 'text-stone-600' : 'text-white/90 hover:text-white drop-shadow-sm'
                                }`}
                        >
                            {link.name}
                        </a>
                    ))}
                </nav>

                {/* Mobile Toggle */}
                <button
                    className={`md:hidden z-50 focus:outline-none transition-colors ${isOpen ? 'text-patagonia-deep' : (scrolled ? 'text-patagonia-deep' : 'text-white')
                        }`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="w-8 h-8 relative flex items-center justify-center">
                        <motion.span
                            animate={isOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -8 }}
                            className="absolute w-6 h-0.5 bg-current block transition-transform"
                        />
                        <motion.span
                            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                            className="absolute w-6 h-0.5 bg-current block transition-opacity"
                        />
                        <motion.span
                            animate={isOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 8 }}
                            className="absolute w-6 h-0.5 bg-current block transition-transform"
                        />
                    </div>
                </button>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: '100%' }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: '100%' }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed inset-0 bg-white z-40 flex flex-col items-center justify-center gap-8"
                        >
                            {LINKS.map(link => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-2xl font-serif text-patagonia-deep hover:text-patagonia-lake transition-colors"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}
