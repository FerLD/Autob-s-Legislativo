'use client';

import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Layout, Palette, Shield, Zap, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from 'next-themes';

export default function Home() {
    const [showAll, setShowAll] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();
    
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative py-12 md:py-20 overflow-hidden bg-[#1a1a1a] dark:bg-inherit transition-colors duration-500">
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,_rgba(255,255,255,0.18)_1px,_transparent_1px)] bg-[length:20px_20px] dark:hidden"> 
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}>
                            <div className="relative pb-40">
                                <img
                                    src="/Camion2.png"
                                    alt="Autobús legislativo"
                                    className="absolute left-1/2 top-8 -translate-x-1/2 w-full max-w-1000 rounded-3xl object-cover opacity-95 -z-10"
                                />

                                <h1 className="relative text-4xl md:text-6xl font-extrabold text-white dark:text-blue-100 mb-6 leading-tight z-20">
                                    Autobús <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-dark via-primary to-primary-light">
                                        Legislativo
                                    </span>
                                </h1>
                            </div>

                            <p className="text-lg text-gray-300 dark:text-blue-200 mt-10 mb-8 max-w-2xl mx-auto leading-relaxed">
                                Bienvenido a la nueva etapa digital del Congreso del Estado de Guanajuato.
                                Una plataforma moderna, rápida y accesible diseñada para el ciudadano.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Iniciativas Section */}
            <section className="py-16 bg-gray-50 dark:bg-transparent transition-colors duration-500">
                <div className="container mx-auto px-4">
                    {/* Título */}
                    <div className="text-center mb-16">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-blue-100">
                            Iniciativas Legislativas
                        </h2>
                        <div className="w-20 h-1.5 bg-primary mx-auto mt-4 rounded-full"></div>
                    </div>

                    {/* Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1,2,3,4,5,6,7,8,9,10,11,12].slice(0, showAll ? 12 : 6).map((item)=>(
                            <motion.div
                                key={item}
                                initial={{opacity:0,y:10}}
                                whileInView={{opacity:1,y:0}}
                                viewport={{once:true}}
                                transition={{duration:.4}}
                                className="bg-primary/5 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden"
                            >
                                {/* Imagen con contenedor gris por si no carga la ruta */}
                                <div className="h-44 bg-gray-200 dark:bg-gray-800 overflow-hidden flex items-center justify-center text-gray-400 text-xs">
                                    <img src={ theme === 'dark'? '/logoCDGazul.png': '/LogoCDGblanco.png'}
                                        alt="Ejemplo de iniciativa"
                                        className="w-full h-full object-cover hover:scale-105 transition duration-500 fallback-img"
                                        onError={(e) => {
                                            e.currentTarget.src = '/LogoCDGblanco.png';
                                        }}
                                    />
                                    {/*<span className="absolute dark:text-gray-500">Sin imagen (Verifica /public/ejemplo.jpg)</span>*/}
                                </div>

                                <div className="p-4">
                                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-primary/10 dark:bg-primary/20 text-primary">
                                        Iniciativa
                                    </span>

                                    {/* Forzamos el texto a mantenerse visible en modo oscuro */}
                                    <h3 className="mt-3 text-xl font-bold text-gray-900 dark:text-blue-100">
                                        Nueva Ley de Economía Circular 605/LXVI-I
                                    </h3>
                                    
                                    <p className="mt-2 text-gray-600 dark:text-gray-400 line-clamp-3">
                                        Iniciativa formulada por personas diputadas integrantes del Grupo Parlamentario.
                                    </p>

                                    <div className="flex gap-2 mt-3">
                                        <span className="px-3 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                            LXVI
                                        </span>
                                        <span className="px-3 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                            2026
                                        </span>
                                    </div>

                                    <Link href="/prueba">
                                        <button className="mt-4 w-full py-2 rounded-lg bg-primary text-white hover:bg-primary-dark dark:bg-gray-800 dark:border dark:border-gray-700 dark:hover:bg-gray-700 transition font-semibold">
                                            Ver expediente
                                        </button>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>

    
                    {/* Sección de SharePoint */}
                    <section className="py-16 bg-gray-50 dark:bg-transparent transition-colors duration-500">
                        <div className="container mx-auto px-4 max-w-7xl">
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} 
                                className="relative overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl transition-all duration-500 p-8 md:p-10">
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                {/* Información */}
                                <div className="flex items-center gap-5">
                                    <div className="w-20 h-20 flex items-center justify-center">
                                        <img src={ theme === 'dark'? '/CEPoscuro.png': '/CEPblanco.png'}
                                            alt="CEP"
                                            className="w-36 h-36 object-contain"
                                        />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-blue-100">Repositorio Documental CEP</h2>
                                        <p className="mt-2 max-w-xl text-gray-600 dark:text-gray-400">Consulta documentos, capítulos legislativos y recursos institucionales desde la plataforma documental.</p>
                                        <div className="flex gap-3 mt-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 dark:bg-primary/20 text-primary">Documentos</span>
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">CEP</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Acción */}
                                <Link href="/sharepoint">
                                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-blue-100 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-blue-100">
                                        <BookOpen className="w-5 h-5" />
                                        Repositorio CEP
                                    </motion.button>
                                </Link>
                            </div>
                            </motion.div>
                        </div>
                    </section>

                </div>
            </section>
        </div>
    );
}