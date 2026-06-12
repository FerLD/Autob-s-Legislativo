'use client';

import { motion } from 'framer-motion';
import { Folder, Search, Plus, Scale, BookOpen, Inbox, NotebookPen, ScrollText, Landmark  } from 'lucide-react';
import { useState } from 'react';

export default function ExpedientePage() {
    const [seccionesActivas, setSeccionesActivas] = useState([
        "generales"
    ]);

    const secciones = [
    {
        id: "generales",
        titulo: "Datos Generales",
        icono: Folder
    },
    {
        id: "presentacion",
        titulo: "Presentación",
        icono: Scale
    },
    {
        id: "recepcion",
        titulo: "Comisión",
        icono: Inbox
    },
    {
        id: "metodologias",
        titulo: "Metodologías",
        icono: BookOpen
    },
    {
        id: "actas",
        titulo: "Actas",
        icono: NotebookPen
    },
    {
        id: "dictamenes",
        titulo: "Dictámenes",
        icono: ScrollText
    },
    {
        id: "decretos",
        titulo: "Decretos",
        icono: Landmark
    }
];

return (
    <div className="min-h-screen bg-gray-50 dark:bg-transparent transition-colors duration-500">
        <section className="container mx-auto px-4 py-16 max-w-6xl">
            {/* TITULO */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-blue-100">
                    Expediente Legislativo Digital
                </h1>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                    Consulta y administración de expedientes legislativos.
                </p>
            </motion.div>


            <div className="sticky top-20 z-20 rounded-2xl border border-gray-200 bg-white/80 p-4 mb-8 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
                <div className="flex flex-wrap gap-3">
                    {secciones.map((sec) => {
                        const Icono = sec.icono;
                        const activa = seccionesActivas.includes(sec.id);

                        return (
                            <button
                                key={sec.id}
                                onClick={() => {
                                    setSeccionesActivas(prev =>
                                        activa 
                                            ? prev.filter(s => s !== sec.id) 
                                            : [...prev, sec.id]
                                    );
                                }}
                                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                                    activa
                                        ? "bg-primary text-white"
                                        : "bg-gray-100 dark:bg-gray-800"
                                }`}
                            >
                                <Icono size={18} />
                                {sec.titulo}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* BUSQUEDA 
            <div className="bg-primary/5 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm mb-12">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                    <Search className="absolute left-4 top-3.5 text-gray-400" />
                    <input
                        placeholder="Buscar expediente..."
                        className="w-full pl-12 py-3 rounded-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary"/>
                    </div>
                    <button className="bg-primary text-white px-6 rounded-lg font-bold hover:bg-primary-dark transition">
                        Buscar
                    </button>
                    <button className="bg-secondary text-white px-6 rounded-lg font-bold flex gap-2 items-center justify-center">

                    <Plus size={18} />
                        Nuevo
                    </button>
                </div>
            </div>*/}

            { seccionesActivas.includes("generales") && (
                <div className="flex justify-center mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="w-full max-w-9xl min-h-[12rem] bg-primary/5 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all p-8" >
                        {/* ICONO */}
                        <div className="w-20 h-20 bg-primary rounded-xl flex items-center justify-center mb-6">
                            <Folder className="text-white" size={35} />
                        </div>

                        {/* TITULO */}
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-blue-100">
                            Datos del Expediente: 607/LXVI-I
                        </h3>

                        {/* DESCRIPCION */}
                        <p className="mt-3 text-gray-600 dark:text-gray-400">
                            Información del expediente legislativo.
                        </p>

                        {/* ESTATUS */}
                        <div className="flex gap-3 mt-6">
                            <span className="px-4 py-2 rounded-full bg-primary/20 text-primary text-sm">
                                Activo
                            </span>
                            <span className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm">
                                LXVI
                            </span>
                        </div>

                        {/* DATOS PRINCIPALES */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                            <div>
                                <p className="text-sm text-gray-500">Tipo de expediente</p>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">Iniciativa</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Fecha de recepción</p>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">04/06/2026 03:34:12 p.m.</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Fecha límite para dictaminar</p>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">07/02/2027</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Iniciante</p>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">Ayuntamiento</p>
                            </div>
                        </div>

                        {/* ARCHIVO */}
                        <div className="mt-8 p-5 rounded-xl dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                            <p className="text-gray-500 mb-3">Archivo</p>
                            <button className="px-5 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition">
                                Descargar
                            </button>
                        </div>

                        {/* SUSCRIPCIÓN */}
                        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                            <h4 className="text-2xl font-bold text-gray-900 dark:text-blue-100 mb-5">
                                Suscripción
                            </h4>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Objeto</p>
                                    <p className="text-gray-700 dark:text-gray-300">Adición</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Ayuntamiento</p>
                                    <p className="text-gray-700 dark:text-gray-300">Ayuntamiento del Mpio. de Salvatierra</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Descripción</p>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                        Iniciativa formulada por las personas integrantes del ayuntamiento de Salvatierra, Gto., por la que se adiciona un artículo a la Ley de Ingresos para el Municipio de Salvatierra, Guanajuato.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* BOTÓN 
                        <button className="mt-8 w-full py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition">
                            Volver a expedientes
                        </button>*/}
                    </motion.div>
                </div>
            )}

            {seccionesActivas.includes("presentacion") && (
                <div className="flex justify-center mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="w-full max-w-9xl min-h-[12rem] bg-primary/5 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all p-8"
                        >
                        <div className="w-20 h-20 bg-primary rounded-xl flex items-center justify-center mb-6">
                            <Scale  className="text-white" size={32} />
                        </div>

                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-blue-100">Presentación a Pleno</h3>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Información del expediente legislativo.</p>
                        <div className="flex gap-3 mt-6">
                            <span className="px-4 py-2 rounded-full bg-primary/20 text-primary text-sm">Activo</span>
                            <span className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm">
                            2026
                            </span>
                        </div>
                        <button className="mt-8 w-full py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition">
                            Descargar expediente
                        </button>
                    </motion.div>
                </div>
            )}

            {seccionesActivas.includes("recepcion") && (
                <div className="flex justify-center mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="w-full max-w-9xl min-h-[12rem] bg-primary/5 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all p-8"
                        >
                        <div className="w-20 h-20 bg-primary rounded-xl flex items-center justify-center mb-6">
                            <Inbox className="text-white" size={32} />
                        </div>

                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-blue-100">Recepción en Comisión</h3>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Información del expediente legislativo.</p>
                        <div className="flex gap-3 mt-6">
                            <span className="px-4 py-2 rounded-full bg-primary/20 text-primary text-sm">Activo</span>
                            <span className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm">
                            2026
                            </span>
                        </div>
                    </motion.div>
                </div>
            )}  

            {seccionesActivas.includes("metodologias") && (
                <div className="flex justify-center mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="w-full max-w-9xl min-h-[12rem] bg-primary/5 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all p-8"
                        >
                        <div className="w-20 h-20 bg-primary rounded-xl flex items-center justify-center mb-6">
                            <BookOpen   className="text-white" size={32} />
                        </div>

                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-blue-100">Metodologías</h3>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Información del expediente legislativo.</p>
                        <div className="flex gap-3 mt-6">
                            <span className="px-4 py-2 rounded-full bg-primary/20 text-primary text-sm">Activo</span>
                            <span className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm">
                            2026
                            </span>
                        </div>
                    </motion.div>
                </div>
            )}  

            {seccionesActivas.includes("actas") && (
                <div className="flex justify-center mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="w-full max-w-9xl min-h-[12rem] bg-primary/5 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all p-8"
                        >
                        <div className="w-20 h-20 bg-primary rounded-xl flex items-center justify-center mb-6">
                            <NotebookPen className="text-white" size={32} />
                        </div>

                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-blue-100">Correspondencias, Minutas, Actas</h3>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Información del expediente legislativo.</p>
                        <div className="flex gap-3 mt-6">
                            <span className="px-4 py-2 rounded-full bg-primary/20 text-primary text-sm">Activo</span>
                            <span className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm">
                            2026
                            </span>
                        </div>
                    </motion.div>
                </div>
            )}  

            {seccionesActivas.includes("dictamenes") && (
                <div className="flex justify-center mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="w-full max-w-9xl min-h-[12rem] bg-primary/5 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all p-8"
                        >
                        <div className="w-20 h-20 bg-primary rounded-xl flex items-center justify-center mb-6">
                            <ScrollText className="text-white" size={32} />
                        </div>

                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-blue-100">Dictámenes en Comisión</h3>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Información del expediente legislativo.</p>
                        <div className="flex gap-3 mt-6">
                            <span className="px-4 py-2 rounded-full bg-primary/20 text-primary text-sm">Activo</span>
                            <span className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm">
                            2026
                            </span>
                        </div>
                    </motion.div>
                </div>
            )}  

            {seccionesActivas.includes("decretos") && (
                <div className="flex justify-center mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="w-full max-w-9xl min-h-[12rem] bg-primary/5 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all p-8"
                        >
                        <div className="w-20 h-20 bg-primary rounded-xl flex items-center justify-center mb-6">
                            <Landmark   className="text-white" size={32} />
                        </div>

                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-blue-100">Dictamenes / Decretos</h3>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Información del expediente legislativo.</p>
                        <div className="flex gap-3 mt-6">
                            <span className="px-4 py-2 rounded-full bg-primary/20 text-primary text-sm">Activo</span>
                            <span className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm">
                            2026
                            </span>
                        </div>
                    </motion.div>
                </div>
            )}  
        </section>
    </div>
);
}