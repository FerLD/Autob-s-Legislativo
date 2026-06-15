'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Folder, FileText, Calendar, User, ArrowRight } from 'lucide-react';

// Datos de ejemplo - en producción esto vendría de una API
const EXPEDIENTES_DATA = [
    {
        id: 1,
        numero: 'EXP-2024-0001',
        titulo: 'Proyecto de Ley de Protección Ambiental',
        descripcion: 'Iniciativa para fortalecer la protección del medio ambiente en la entidad',
        autor: 'Diputado Juan Pérez',
        fecha: '2024-01-15',
        estado: 'En Comisión',
        tiene_metodologia: true,
        tiene_dictamen_comision: true,
        tiene_dictamen: false,
        tags: ['ambiente', 'protección', 'ley']
    },
    {
        id: 2,
        numero: 'EXP-2024-0002',
        titulo: 'Reforma Educativa Integral',
        descripcion: 'Propuesta para modernizar el sistema educativo estatal',
        autor: 'Diputada María García',
        fecha: '2024-02-20',
        estado: 'Con Dictamen',
        tiene_metodologia: true,
        tiene_dictamen_comision: false,
        tiene_dictamen: true,
        tags: ['educación', 'reforma', 'sistema']
    },
    {
        id: 3,
        numero: 'EXP-2024-0003',
        titulo: 'Ley de Fomento al Empleo',
        descripcion: 'Iniciativa para incrementar oportunidades de empleo en la región',
        autor: 'Diputado Carlos López',
        fecha: '2024-03-10',
        estado: 'En Revisión',
        tiene_metodologia: false,
        tiene_dictamen_comision: true,
        tiene_dictamen: false,
        tags: ['empleo', 'economía', 'fomento']
    },
    {
        id: 4,
        numero: 'EXP-2024-0004',
        titulo: 'Modernización de Servicios de Salud',
        descripcion: 'Programa para mejorar la cobertura y calidad de servicios sanitarios',
        autor: 'Diputada Rosa Martínez',
        fecha: '2024-03-25',
        estado: 'Con Dictamen',
        tiene_metodologia: true,
        tiene_dictamen_comision: true,
        tiene_dictamen: true,
        tags: ['salud', 'servicios', 'cobertura']
    },
    {
        id: 5,
        numero: 'EXP-2024-0005',
        titulo: 'Seguridad Pública y Prevención del Delito',
        descripcion: 'Estrategia integral para mejorar la seguridad en municipios',
        autor: 'Diputado Roberto Sánchez',
        fecha: '2024-04-05',
        estado: 'En Comisión',
        tiene_metodologia: false,
        tiene_dictamen_comision: false,
        tiene_dictamen: false,
        tags: ['seguridad', 'delito', 'prevención']
    },
    {
        id: 6,
        numero: 'INIT-2026-0001',
        titulo: 'Nueva Ley de Economía Circular',
        descripcion: 'Iniciativa para promover modelos de economía circular en el estado',
        autor: 'Grupo Parlamentario',
        fecha: '2026-01-01',
        estado: 'En Comisión',
        tiene_metodologia: true,
        tiene_dictamen_comision: false,
        tiene_dictamen: false,
        tags: ['economía', 'circular', 'sustentabilidad']
    },
];

export default function BuscarPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const filtersParam = searchParams.get('filters') || '';
    const [results, setResults] = useState<typeof EXPEDIENTES_DATA>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simular búsqueda
        setLoading(true);
        const timer = setTimeout(() => {
            const filters = filtersParam ? filtersParam.split(',') : [];
            
            let filtered = EXPEDIENTES_DATA.filter(exp => {
                const queryLower = query.toLowerCase();
                const matchesQuery = !query || 
                    exp.numero.toLowerCase().includes(queryLower) ||
                    exp.titulo.toLowerCase().includes(queryLower) ||
                    exp.descripcion.toLowerCase().includes(queryLower) ||
                    exp.autor.toLowerCase().includes(queryLower) ||
                    exp.tags.some(tag => tag.toLowerCase().includes(queryLower));

                if (!matchesQuery) return false;

                if (filters.length === 0) return true;

                return filters.every(filter => {
                    if (filter === 'metodologia') return exp.tiene_metodologia;
                    if (filter === 'dictamen-comision') return exp.tiene_dictamen_comision;
                    if (filter === 'dictamen') return exp.tiene_dictamen;
                    return true;
                });
            });

            setResults(filtered);
            setLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [query, filtersParam]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12">
            <div className="container mx-auto px-4 flex flex-col items-center">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-12 w-full max-w-4xl"
                >
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                        Búsqueda de Expedientes
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-center">
                        {query ? `Resultados para: "${query}"` : 'Explora todos los expedientes'}
                    </p>
                </motion.div>

                {/* Results */}
                <div className="max-w-4xl w-full">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="space-y-4">
                            {results.map((exp, idx) => (
                                <motion.div
                                    key={exp.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                                >
                                    <Link href={`/expediente/${exp.id}`}>
                                        <div className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-lg dark:hover:shadow-primary/20 transition-all duration-300 cursor-pointer">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Folder className="w-4 h-4 text-primary" />
                                                        <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                                                            {exp.numero}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                                        {exp.titulo}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                                                        {exp.descripcion}
                                                    </p>
                                                    <div className="flex flex-wrap gap-2 mt-4">
                                                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                                            <User className="w-4 h-4" />
                                                            {exp.autor}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                                            <Calendar className="w-4 h-4" />
                                                            {new Date(exp.fecha).toLocaleDateString('es-MX')}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                            exp.estado === 'Con Dictamen' 
                                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                                : exp.estado === 'En Comisión'
                                                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                        }`}>
                                                            {exp.estado}
                                                        </span>
                                                        {exp.tiene_metodologia && (
                                                            <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded">
                                                                Con Metodología
                                                            </span>
                                                        )}
                                                        {exp.tiene_dictamen && (
                                                            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded">
                                                                Con Dictamen
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all mt-1 flex-shrink-0" />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="text-center py-12">
                            <FileText className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                No se encontraron resultados
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                {query 
                                    ? `No hay expedientes que coincidan con "${query}"`
                                    : 'Intenta con otros términos de búsqueda'}
                            </p>
                            <Link href="/" className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                                Volver al Inicio
                            </Link>
                        </motion.div>
                    )}

                    {/* Stats */}
                    {results.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                        >
                            <p className="text-sm text-blue-900 dark:text-blue-200">
                                Se encontraron <span className="font-semibold">{results.length}</span> resultado{results.length !== 1 ? 's' : ''}
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
