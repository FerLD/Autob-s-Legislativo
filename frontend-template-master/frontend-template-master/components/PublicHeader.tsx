'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Moon, Sun, Search, Filter  } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

export function PublicHeader() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [filterOpen, setFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => setMounted(true), []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            const params = new URLSearchParams();
            params.set('q', searchQuery);
            if (selectedFilters.length > 0) {
                params.set('filters', selectedFilters.join(','));
            }
            router.push(`/buscar?${params.toString()}`);
        }
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch(e as any);
        }
    };

    const toggleFilter = (filterId: string) => {
        setSelectedFilters(prev => 
            prev.includes(filterId) 
                ? prev.filter(f => f !== filterId)
                : [...prev, filterId]
        );
    };

    if (pathname?.startsWith('/admin')) return null;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-colors duration-300">
            <div className="container mx-auto px-4 h-16 flex items-center gap-4">
                {/* Left: Logo */}
                    <div className="flex items-center flex-shrink-0">
                    <Link href="/" className="flex items-center gap-3 group">
                        <img
                            src={mounted && theme === 'dark' ? '/logoLegislaturaBlancoH.png' : '/logoLegislatura.png'}
                            alt="Congreso del Estado de Guanajuato"
                            className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                    </Link>
                </div>

                {/* Center: Navigation (hidden on small) */}
                <nav className="hidden md:flex flex-1 items-center justify-center gap-6">
                    <Link href="/" className="text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary py-2">
                        Inicio
                    </Link>
                    <Link href="/sharepoint" className="text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary py-2">
                        CEP
                    </Link>
                    
                {/* 
                    <Link href="/docs" className="text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary py-2">
                        Guía de Estilo
                    </Link>
                    <Link href="/ejemplo" className="text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary py-2">
                        Ejemplo
                    </Link> */}
                </nav>

                {/* Buscador & Filtros */}
                <div className="flex items-center gap-3 ml-auto">
                    <form onSubmit={handleSearch} className="relative hidden md:block w-56">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            className="w-full pl-9 pr-3 h-10 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm cursor-text"
                        />
                    </form>
{/*
                    <div className="hidden md:flex items-center gap-2 relative">
                        <button
                            onClick={() => setFilterOpen(!filterOpen)}
                            className="h-10 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary hover:text-white transition flex items-center gap-2 shadow-sm">
                            <Filter className="w-4 h-4" />
                            <span>Filtros</span>
                        </button>

                        {filterOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.85, y: -24 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -12 }}
                                transition={{ duration: 0.28, ease: 'easeOut' }}
                                className="absolute top-14 right-0 md:right-6 w-80 md:w-96 rounded-[28px] bg-white/90 dark:bg-slate-900/90 border border-white/40 dark:border-white/10 backdrop-blur-xl shadow-[0_30px_80px_-30px_rgba(59,130,246,0.35)] p-4 z-50 origin-top-right"
                            >
                                <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
                                    Filtrar búsqueda
                                </h3>

                                <div className="flex flex-col gap-2">

                                    <button
                                        type="button"
                                        onClick={() => toggleFilter('metodologia')}
                                        className={`px-4 py-2 rounded-2xl transition text-left shadow-sm ${
                                            selectedFilters.includes('metodologia')
                                                ? 'bg-primary text-white border border-primary'
                                                : 'bg-white/90 dark:bg-slate-900/90 border border-gray-200/80 dark:border-gray-700/70 hover:bg-primary hover:text-white'
                                        }`}
                                    >
                                        Con Metodología
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => toggleFilter('dictamen-comision')}
                                        className={`px-4 py-2 rounded-2xl transition text-left shadow-sm ${
                                            selectedFilters.includes('dictamen-comision')
                                                ? 'bg-primary text-white border border-primary'
                                                : 'bg-white/90 dark:bg-slate-900/90 border border-gray-200/80 dark:border-gray-700/70 hover:bg-primary hover:text-white'
                                        }`}
                                    >
                                        Con Dictamen en Comisión
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => toggleFilter('dictamen')}
                                        className={`px-4 py-2 rounded-2xl transition text-left shadow-sm ${
                                            selectedFilters.includes('dictamen')
                                                ? 'bg-primary text-white border border-primary'
                                                : 'bg-white/90 dark:bg-slate-900/90 border border-gray-200/80 dark:border-gray-700/70 hover:bg-primary hover:text-white'
                                        }`}
                                    >
                                        Con Dictamen
                                    </button>

                                </div>
                            </motion.div>
                        )}
                    </div>

*/}
                    {mounted && (
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    )}


                    <button
                        className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-primary/5 dark:bg-gray-900 overflow-hidden"
                    >
                        <nav className="flex flex-col p-3">
                            <Link href="/" className="text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary px-3 py-2 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                                Inicio
                            </Link>
                            <Link href="/docs" className="text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary px-3 py-2 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                                Guía de Estilo
                            </Link>
                            <Link href="/ejemplo" className="text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary px-3 py-2 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                                Ejemplo
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}