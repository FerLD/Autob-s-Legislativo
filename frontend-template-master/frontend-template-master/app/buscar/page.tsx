'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Folder, FileText, Calendar, User, ArrowRight } from 'lucide-react';


{/* Datos de ejemplo para expedientes */}
const EXPEDIENTES_DATA = [

    {
        id: 1,
        numero: 'EXP-2024-0001',
        titulo: 'Proyecto de Ley de Protección Ambiental',
        descripcion: 'Iniciativa para fortalecer la protección del medio ambiente en la entidad',
        autor: 'Diputado Juan Pérez',
        fecha: '2024-01-15',
        estado: 'En Comisión',
        tipo_expediente: 'Iniciativa',
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
        tipo_expediente: 'Minuta de Decreto Congreso de la Union',
        tiene_metodologia: true,
        tiene_dictamen_comision: false,
        tiene_dictamen: true,
        tags: ['educación', 'reforma', 'sistema']
    },

    {
        id: 3,
        numero: 'EXP-2024-0003',
        titulo: 'Ley de Fomento al Empleo',
        descripcion: 'Iniciativa para incrementar oportunidades laborales y desarrollo económico',
        autor: 'Diputado Carlos López',
        fecha: '2024-03-10',
        estado: 'En Revisión',
        tipo_expediente: 'Informe de Resultados ASEG',
        tiene_metodologia: false,
        tiene_dictamen_comision: true,
        tiene_dictamen: false,
        tags: ['empleo', 'economía', 'trabajo']
    },

    {
        id: 4,
        numero: 'EXP-2024-0004',
        titulo: 'Modernización de Servicios de Salud',
        descripcion: 'Programa para mejorar la cobertura y calidad de servicios sanitarios',
        autor: 'Diputada Rosa Martínez',
        fecha: '2024-03-25',
        estado: 'Con Dictamen',
        tipo_expediente: 'Proposiciones de Punto de Acuerdo',
        tiene_metodologia: true,
        tiene_dictamen_comision: true,
        tiene_dictamen: true,
        tags: ['salud', 'servicios', 'hospitales']
    },

    {
        id: 5,
        numero: 'EXP-2024-0005',
        titulo: 'Seguridad Pública y Prevención del Delito',
        descripcion: 'Estrategia integral para mejorar la seguridad en municipios',
        autor: 'Diputado Roberto Sánchez',
        fecha: '2024-04-05',
        estado: 'En Comisión',
        tipo_expediente: 'Comunicaciones',
        tiene_metodologia: false,
        tiene_dictamen_comision: false,
        tiene_dictamen: false,
        tags: ['seguridad', 'delito', 'prevención']
    },

    {
        id: 6,
        numero: 'INIT-2026-0001',
        titulo: 'Nueva Ley de Economía Circular',
        descripcion: 'Iniciativa para promover modelos sustentables de producción',
        autor: 'Grupo Parlamentario',
        fecha: '2026-01-01',
        estado: 'En Comisión',
        tipo_expediente: 'Iniciativa',
        tiene_metodologia: true,
        tiene_dictamen_comision: true,
        tiene_dictamen: false,
        tags: ['economía', 'circular', 'sustentabilidad']
    },

    {
        id: 7,
        numero: 'EXP-2025-0012',
        titulo: 'Ley de Movilidad Urbana Sustentable',
        descripcion: 'Regulación para mejorar transporte público y movilidad ciudadana',
        autor: 'Diputada Laura Hernández',
        fecha: '2025-05-18',
        estado: 'En Revisión',
        tipo_expediente: 'Iniciativa',
        tiene_metodologia: true,
        tiene_dictamen_comision: false,
        tiene_dictamen: false,
        tags: ['movilidad', 'transporte', 'ciudad']
    },

    {
        id: 8,
        numero: 'EXP-2025-0018',
        titulo: 'Reforma de Transparencia Estatal',
        descripcion: 'Modificación de normas relacionadas con acceso a información pública',
        autor: 'Diputado Miguel Torres',
        fecha: '2025-06-22',
        estado: 'Con Dictamen',
        tipo_expediente: 'Proposiciones de Punto de Acuerdo',
        tiene_metodologia: false,
        tiene_dictamen_comision: true,
        tiene_dictamen: true,
        tags: ['transparencia', 'datos', 'gobierno']
    },

    {
        id: 9,
        numero: 'EXP-2025-0021',
        titulo: 'Programa de Protección Civil',
        descripcion: 'Medidas para fortalecer prevención y respuesta ante emergencias',
        autor: 'Diputada Ana Ruiz',
        fecha: '2025-07-11',
        estado: 'En Comisión',
        tipo_expediente: 'Comunicaciones',
        tiene_metodologia: true,
        tiene_dictamen_comision: false,
        tiene_dictamen: false,
        tags: ['protección civil', 'emergencias', 'seguridad']
    },

    {
        id: 10,
        numero: 'EXP-2026-0007',
        titulo: 'Ley de Innovación Tecnológica',
        descripcion: 'Impulso al desarrollo digital y nuevas tecnologías en instituciones',
        autor: 'Diputado Fernando Castillo',
        fecha: '2026-02-14',
        estado: 'Con Dictamen',
        tipo_expediente: 'Iniciativa',
        tiene_metodologia: true,
        tiene_dictamen_comision: true,
        tiene_dictamen: true,
        tags: ['tecnología', 'innovación', 'digital']
    },

    {
        id: 11,
        numero: 'EXP-2026-0010',
        titulo: 'Reforma al Código Administrativo',
        descripcion: 'Actualización de procesos y procedimientos administrativos',
        autor: 'Diputada Elena Vargas',
        fecha: '2026-03-02',
        estado: 'En Revisión',
        tipo_expediente: 'Minuta de Decreto Congreso de la Union',
        tiene_metodologia: false,
        tiene_dictamen_comision: true,
        tiene_dictamen: false,
        tags: ['administración', 'reforma', 'normativa']
    },

    {
        id: 12,
        numero: 'EXP-2026-0015',
        titulo: 'Ley de Desarrollo Rural',
        descripcion: 'Apoyo al sector agrícola y comunidades rurales del estado',
        autor: 'Grupo Parlamentario',
        fecha: '2026-04-20',
        estado: 'En Comisión',
        tipo_expediente: 'Iniciativa',
        tiene_metodologia: true,
        tiene_dictamen_comision: false,
        tiene_dictamen: false,
        tags: ['campo', 'agricultura', 'rural']
    }

];


export default function BuscarPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const queryParam = searchParams.get('q') || '';
    const filtersParam = searchParams.get('filters') || '';

    const [searchQuery, setSearchQuery] = useState(queryParam);
    const [keywordQuery, setKeywordQuery] = useState('');
    const [results, setResults] = useState<typeof EXPEDIENTES_DATA>([]);
    const [loading, setLoading] = useState(true);
    const [typeOpen, setTypeOpen] = useState(false);
    const [selectedType, setSelectedType] = useState("");

    // Opciones extraídas exactamente de la imagen
    const OPCIONES_TIPO = [
        "Iniciativa",
        "Minuta de Decreto Congreso de la Unión",
        "Informe de Resultados ASEG",
        "Proposiciones de Punto de Acuerdo",
        "Comunicaciones"
    ];

    // Sincronizar el input con la URL si esta cambia externamente
    useEffect(() => { setSearchQuery(queryParam); }, [queryParam]);

    // Cerrar dropdown al hacer click afuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setTypeOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filtrado de datos en el cliente
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            const filters = filtersParam ? filtersParam.split(',') : [];
            
            let filtered = EXPEDIENTES_DATA.filter(exp => {
                const qLower = searchQuery.toLowerCase();
                const kLower = keywordQuery.toLowerCase();

                const matchesQuery = !searchQuery || 
                    exp.numero.toLowerCase().includes(qLower) ||
                    exp.titulo.toLowerCase().includes(qLower) ||
                    exp.descripcion.toLowerCase().includes(qLower) ||
                    exp.autor.toLowerCase().includes(qLower) ||
                    exp.tags.some(tag => tag.toLowerCase().includes(qLower));

                const matchesKeyword = !keywordQuery || 
                    exp.tags.some(tag => tag.toLowerCase().includes(kLower)) ||
                    exp.titulo.toLowerCase().includes(kLower);

                // Modificado para validar contra la nueva propiedad real 'tipo_expediente' o fallback amigable
                const matchesType = !selectedType || 
                    (exp.tipo_expediente && exp.tipo_expediente.toLowerCase() === selectedType.toLowerCase()) ||
                    (selectedType === "Iniciativa" && exp.estado === "En Comisión"); // Mantiene fallback original por si acaso

                if (!matchesQuery || !matchesKeyword || !matchesType) return false;
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
    }, [searchQuery, keywordQuery, selectedType, filtersParam]);

    const handleSearchSubmit = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (searchQuery) params.set('q', searchQuery); else params.delete('q');
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#111827] pt-24 pb-12 transition-colors duration-500">            
            <div className="container mx-auto px-4 flex flex-col items-center">
                
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mb-12 w-full max-w-4xl">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-blue-100 mb-2 text-center">Búsqueda de Expedientes</h1>
                    <p className="text-gray-600 dark:text-blue-200/70 text-center">{searchQuery ? `Resultados para: "${searchQuery}"` : 'Explora todos los expedientes'}</p>

                    {/* Contenedor del Buscador */}
                    <div className="w-full mt-8 bg-white dark:bg-slate-900/50 rounded-2xl border border-gray-200 dark:border-[#1e3a5f] shadow-sm p-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-3">
                                <label className="text-sm text-gray-600 dark:text-slate-300">Descripción</label>
                                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()} className="w-full mt-1 h-10 px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-950 text-gray-800 dark:text-blue-100 outline-none focus:ring-2 focus:ring-primary/40" placeholder="Buscar por número, título o autor..."/>
                            </div>

                            <div ref={dropdownRef} className="relative">
                                <label className="text-sm text-gray-600 dark:text-slate-300">Tipo de expediente</label>
                                <button type="button" onClick={() => setTypeOpen(!typeOpen)} className="w-full mt-1 h-10 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary hover:text-white transition flex items-center justify-between shadow-sm">
                                    <span className="truncate mr-2">{selectedType || "Todos"}</span>
                                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" /></svg>
                                </button>
                                {typeOpen && (
                                    <motion.div initial={{ opacity: 0, scale: 0.95, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.2 }} className="absolute top-20 left-0 w-full rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-gray-200 dark:border-gray-700 backdrop-blur-xl shadow-xl p-2 z-50 max-h-650 overflow-y-auto">
                                        <button onClick={() => { setSelectedType(""); setTypeOpen(false); }} className={`w-full px-4 py-2 rounded-xl text-left text-sm transition ${!selectedType ? "bg-primary text-white" : "text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white"}`}>Todos</button>
                                        {OPCIONES_TIPO.map(type => (
                                            <button key={type} onClick={() => { setSelectedType(type); setTypeOpen(false); }} className={`w-full px-4 py-2 rounded-xl text-left text-sm transition ${selectedType === type ? "bg-primary text-white" : "text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white"}`}>{type}</button>
                                        ))}
                                    </motion.div>
                                )}
                            </div>      

                            <div>
                                <label className="text-sm text-gray-600 dark:text-slate-300">Palabras clave</label>
                                <input value={keywordQuery} onChange={(e) => setKeywordQuery(e.target.value)} placeholder="Palabra clave" className="w-full mt-1 h-10 px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-950 text-gray-800 dark:text-blue-100 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-primary/40"/>
                            </div>

                            <div className="flex items-end justify-end">
                                <button onClick={handleSearchSubmit} className="h-10 px-5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition flex items-center gap-2 shadow-sm">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                                    Buscar
                                </button>
                            </div>
                        </div>
                    </div>
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
                                <motion.div key={exp.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: idx * 0.05 }}>
                                    <Link href="/prueba" className="block">
                                        <div className="group bg-white dark:bg-slate-900/40 rounded-xl border border-gray-200 dark:border-[#1e3a5f] p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-300 cursor-pointer">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Folder className="w-4 h-4 text-primary opacity-80" />
                                                        <span className="text-sm font-mono text-gray-500 dark:text-slate-400">{exp.numero}</span>
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-blue-100 group-hover:text-primary transition-colors">{exp.titulo}</h3>
                                                    <p className="text-sm text-gray-600 dark:text-blue-200/70 mt-2 line-clamp-2">{exp.descripcion}</p>
                                                    <div className="flex flex-wrap gap-4 mt-4">
                                                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400"><User className="w-4 h-4 text-gray-400 dark:text-slate-500" />{exp.autor}</div>
                                                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400"><Calendar className="w-4 h-4 text-gray-400 dark:text-slate-500" />{new Date(exp.fecha).toLocaleDateString('es-MX')}</div>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-4 flex-wrap">
                                                        <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${exp.estado === 'Con Dictamen' ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400 border dark:border-green-500/20' : exp.estado === 'En Comisión' ? 'bg-blue-50 text-blue-700 dark:bg-[#12345a] dark:text-blue-200 border dark:border-slate-700' : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400 border dark:border-yellow-500/20'}`}>{exp.estado}</span>
                                                        {exp.tiene_metodologia && <span className="px-2 py-0.5 text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 rounded border dark:border-purple-500/20">Con Metodología</span>}
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
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="text-center py-12">
                            <FileText className="w-16 h-16 text-gray-300 dark:text-slate-700 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-blue-100 mb-2">No se encontraron resultados</h2>
                            <p className="text-gray-600 dark:text-blue-200/70 mb-6">{searchQuery ? `No hay expedientes que coincidan con "${searchQuery}"` : 'Intenta con otros términos de búsqueda'}</p>
                            <Link href="/" className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium">Volver al Inicio</Link>
                        </motion.div>
                    )}

                    {results.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }} className="mt-8 p-4 bg-gray-100 dark:bg-slate-900/30 rounded-lg border border-gray-200 dark:border-[#1e3a5f]">
                            <p className="text-sm text-gray-700 dark:text-slate-300">Se encontraron <span className="font-semibold">{results.length}</span> resultado{results.length !== 1 ? 's' : ''}</p>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}