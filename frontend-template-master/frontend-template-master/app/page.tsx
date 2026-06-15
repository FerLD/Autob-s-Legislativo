'use client';

import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Layout, Palette, Shield, Zap, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
    const [showAll, setShowAll] = useState(false);
    
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
                            <h1 className="text-4xl md:text-6xl font-extrabold text-white dark:text-blue-100 mb-6 leading-tight">
                                Autobús <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-dark via-primary to-primary-light">
                                    Legislativo
                                </span>
                            </h1>

                            <p className="text-lg text-gray-300 dark:text-blue-200 mb-8 max-w-2xl mx-auto leading-relaxed">
                                Bienvenido a la nueva etapa digital del Congreso del Estado de Guanajuato.
                                Una plataforma moderna, rápida y accesible diseñada para el ciudadano.
                            </p>
                            <img src="/Camion.png" alt="Autobús legislativo" className="w-full max-w-60 mx-auto rounded-lg shadow-lg" />
                        </motion.div>
                    {/* Botones 
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link 
                                href="/ejemplo" 
                                className="group px-6 py-3 bg-primary text-white rounded-lg font-bold text-base shadow-md shadow-primary/20 hover:bg-primary-dark hover:scale-105 transition-all duration-300 flex items-center gap-3"
                            >
                                Ver Proyectos
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link 
                                href="/docs" 
                                className="px-6 py-3 bg-primary/10 dark:bg-white/5 backdrop-blur-md text-white dark:text-blue-100 border border-primary/20 dark:border-white/10 rounded-lg font-bold text-base hover:bg-primary/20 dark:hover:bg-white/10 transition-all duration-300"
                            >
                                Guía de Estilo
                            </Link>
                        </div>*/}
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
                                    <img
                                        src="/ejemplo.jpg"
                                        alt="Ejemplo de iniciativa"
                                        className="w-full h-full object-cover hover:scale-105 transition duration-500 fallback-img"
                                        onError={(e) => {
                                            // Esto oculta la imagen rota si el archivo no existe en /public
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                    <span className="absolute dark:text-gray-500">Sin imagen (Verifica /public/ejemplo.jpg)</span>
                                </div>

                                <div className="p-4">
                                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-primary/10 dark:bg-primary/20 text-primary">
                                        Iniciativa
                                    </span>

                                    {/* Forzamos el texto a mantenerse visible en modo oscuro */}
                                    <h3 className="mt-3 text-xl font-bold text-gray-900 dark:text-blue-100">
                                        Nueva Ley de Economía Circular
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

                                    <Link href="/expediente">
                                        <button className="mt-4 w-full py-2 rounded-lg bg-primary text-white hover:bg-primary-dark dark:bg-gray-800 dark:border dark:border-gray-700 dark:hover:bg-gray-700 transition font-semibold">
                                            Ver expediente
                                        </button>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Botón para expandir/contraer */}
                    <div className="flex justify-center mt-12">
                        <motion.button
                            onClick={() => setShowAll(!showAll)}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false }}
                            transition={{ duration: 0.3 }}
                            className="group px-8 py-3 bg-primary/10 dark:bg-white/5 border border-primary/30 dark:border-white/10 rounded-lg font-bold text-primary dark:text-blue-100 hover:bg-primary/20 dark:hover:bg-white/10 transition-all duration-300 flex items-center gap-3"
                        >
                            {showAll ? 'Ver menos' : 'Ver más iniciativas'}
                            <motion.div
                                animate={{ rotate: showAll ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ChevronDown className="w-5 h-5" />
                            </motion.div>
                        </motion.button>
                    </div>
                </div>
            </section>


            {/* Call to Action 
            <section className="py-16 relative overflow-hidden bg-primary dark:bg-primary-dark">
                <div className="absolute inset-0 opacity-10 bg-[url('/logoLegislaturaBlancoH.png')] bg-no-repeat bg-right-bottom bg-[length:600px] dark:hidden"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center text-white dark:text-blue-100">
                        <h2 className="text-3xl font-bold mb-6">¿Listo para comenzar la migración?</h2>
                        <p className="text-lg text-white/80 dark:text-blue-100 mb-8">
                            Explora la documentación y comienza a construir la nueva cara del Poder Legislativo.
                        </p>
                        <Link 
                            href="/docs" 
                            className="inline-block px-8 py-3 bg-primary/20 text-white rounded-full font-black text-base shadow-md hover:bg-primary/30 dark:hover:bg-transparent hover:scale-105 transition-all duration-300"
                        >
                            Comenzar Ahora
                        </Link>
                    </div>
                </div>
            </section>*/}


        </div>
    );
}