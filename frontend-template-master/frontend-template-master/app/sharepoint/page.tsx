'use client';

import { useState } from 'react';
import { Upload, Download, FileText, Users, Globe, ChevronRight, MoreVertical, SortAsc, Plus, X, ExternalLink } from 'lucide-react';

const documentos = [
    { nombre: "Violencia de género y medidas de atención.pdf", 
        fecha: "July 4, 2024", 
        autor: "Fer", 
        tamaño: "405 KB",
        url: "/violencia.pdf"
    },
    { nombre: "La dimensión cultural y el desarrollo de la comunidad.pdf", 
        fecha: "July 4, 2024", 
        autor: "Fer", 
        tamaño: "222 KB" },
    { nombre: "Determinación de la vocación turística.pdf", 
        fecha: "July 4, 2024", 
        autor: "Fer", 
        tamaño: "6.27 MB" },
    { nombre: "La evaluación a los programas de prevención.pdf", 
        fecha: "July 4, 2024", 
        autor: "Fer", 
        tamaño: "411 KB" },
    { nombre: "Envejecimiento saludable. Una política pública.pdf", 
        fecha: "July 4, 2024", 
        autor: "Fer", 
        tamaño: "374 KB" },
    { nombre: "El juicio político en México como herramienta.pdf", 
        fecha: "July 4, 2024", 
        autor: "Fer", 
        tamaño: "488 KB" }
];

export default function SharePointPage() {
    const [selectedDoc, setSelectedDoc] = useState<typeof documentos[0] | null>(null);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-transparent transition-colors duration-500">               
            <div className="container mx-auto px-4 py-16 max-w-6xl">

                {/* TITULO */}
                <div className="mb-12 relative">
                    <div className="absolute -top-10 -left-6 w-32 h-32 bg-primary/5 dark:bg-[#C5AB81]/5 rounded-full blur-3xl pointer-events-none" />
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-[#C5AB81]">Repositorio Documental CEP</h1>
                    <p className="mt-3 text-gray-600 dark:text-gray-400 text-lg max-w-2xl">Consulta documentos institucionales y capítulos legislativos del Centro de Estudios Parlamentarios.</p>
                </div>

                {/* ACCIONES */}
                <div className="sticky top-6 z-20 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md p-3 mb-8 shadow-sm dark:shadow-black/20">
                    <div className="flex flex-wrap items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium bg-white dark:bg-gray-800/50 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary active:scale-98 transition-all duration-200 cursor-pointer">+ Nuevo</button>
                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium bg-white dark:bg-gray-800/50 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary active:scale-98 transition-all duration-200 cursor-pointer"><Upload size={18} />Subir</button>
                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium bg-white dark:bg-gray-800/50 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary active:scale-98 transition-all duration-200 cursor-pointer"><Download size={18} />Descargar</button>
                        <div className="ml-auto flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 border border-transparent dark:border-gray-700/30"><SortAsc size={18} className="cursor-pointer hover:text-primary transition" />Ordenar<MoreVertical size={18} className="cursor-pointer hover:text-primary transition" /></div>
                    </div>
                </div>

                {/* BREADCRUMB */}
                <div className="flex flex-wrap items-center gap-2 mb-8 px-2 text-sm font-medium">
                    <div className="w-8 h-8 rounded-xl bg-white dark:bg-gray-900 border border-[#C5AB81]/30 flex items-center justify-center shadow-sm text-xs">👤</div>
                    <span className="px-2.5 py-1 rounded-xl bg-[#C5AB81]/5 border border-[#C5AB81]/30 text-[#C5AB81] hover:bg-[#C5AB81]/15 cursor-pointer transition-all duration-200">Evaluacion</span>
                    <ChevronRight size={14} className="text-[#C5AB81]/60 shrink-0" />
                    <span className="px-2.5 py-1 rounded-xl bg-[#C5AB81]/5 border border-[#C5AB81]/30 text-[#C5AB81] hover:bg-[#C5AB81]/15 cursor-pointer transition-all duration-200">LXVI Legislatura</span>
                    <ChevronRight size={14} className="text-[#C5AB81]/60 shrink-0" />
                    <span className="px-2.5 py-1 rounded-xl bg-[#C5AB81]/5 border border-[#C5AB81]/30 text-[#C5AB81] hover:bg-[#C5AB81]/15 cursor-pointer transition-all duration-200">2024</span>
                    <ChevronRight size={14} className="text-[#C5AB81]/60 shrink-0" />
                    <span className="px-2.5 py-1 rounded-xl bg-[#C5AB81]/5 border border-[#C5AB81]/30 text-[#C5AB81] hover:bg-[#C5AB81]/15 cursor-pointer transition-all duration-200">CEP</span>
                    <ChevronRight size={14} className="text-[#C5AB81]/60 shrink-0" />
                    <span className="px-2.5 py-1 rounded-xl bg-[#C5AB81]/5 border border-[#C5AB81]/30 text-[#C5AB81] hover:bg-[#C5AB81]/15 cursor-pointer transition-all duration-200">Capitulos</span>
                    <div className="flex items-center gap-2 ml-2 border-l border-[#C5AB81]/30 pl-3 text-[#C5AB81]/70"><Users size={16} /><Globe size={16} /></div>
                </div>

                {/* DOCUMENTOS */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 overflow-hidden shadow-sm dark:shadow-black/10">
                    {/* HEADER */}
                    <div className="grid grid-cols-12 p-5 border-b border-gray-200 dark:border-gray-800/80 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 bg-gray-50/50 dark:bg-gray-900/50">
                        <div className="col-span-5">Nombre</div>
                        <div className="col-span-2">Modificado</div>
                        <div className="col-span-2">Autor</div>
                        <div className="col-span-2">Tamaño</div>
                        <div className="col-span-1 text-right"></div>
                    </div>

                    {/* CUERPO */}
                    {documentos.map((doc, i) => (
                        <div key={i} onClick={() => setSelectedDoc(doc)} className={`grid grid-cols-12 items-center p-5 border-b border-gray-100 dark:border-gray-800/40 last:border-0 transition-all duration-200 hover:bg-primary/5 dark:hover:bg-[#C5AB81]/5 cursor-pointer group ${selectedDoc?.nombre === doc.nombre ? 'bg-primary/5 dark:bg-[#C5AB81]/10' : ''}`}>
                            <div className="col-span-5 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-200"><FileText size={20} className="text-red-500 dark:text-red-400" /></div>
                                <span className="font-semibold text-gray-700 dark:text-gray-200 group-hover:text-primary dark:group-hover:text-[#C5AB81] transition-colors duration-200 truncate">{doc.nombre}</span>
                            </div>
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 col-span-2">{doc.fecha}</div>
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 col-span-2">{doc.autor}</div>
                            <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 col-span-2">{doc.tamaño}</div>
                            <div className="text-right text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-[#C5AB81] col-span-1 font-bold text-lg transition duration-200">...</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* BACKDROP DEL PANEL DE VISTA PREVIA */}
            {selectedDoc && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300" onClick={() => setSelectedDoc(null)} />}

            {/* PANEL DE VISTA PREVIA LATERAL */}
            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800/80 shadow-2xl z-50 transition-transform duration-300 transform flex flex-col ${selectedDoc ? 'translate-x-0' : 'translate-x-full'}`}>
                {/* HEAD DEL PANEL */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800/60 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/20">
                    <div className="flex items-center gap-3">
                        <FileText className="text-red-500 dark:text-red-400" size={22} />
                        <span className="font-bold text-gray-900 dark:text-[#C5AB81] text-lg">Vista Previa</span>
                    </div>
                    <button onClick={() => setSelectedDoc(null)} className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"><X size={20} /></button>
                </div>

                {/* CONTENIDO / RENDER REAL DEL PDF */}
                <div className="p-6 flex-1 overflow-y-auto space-y-6">
                    <div className="aspect-[3/4] w-full rounded-2xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden shadow-inner">
                        {selectedDoc?.url ? (
                            <iframe 
                                src={`${selectedDoc.url}#toolbar=0&navpanes=0`} 
                                className="w-full h-full border-0 select-none"
                                title="Previsualización de PDF"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                                <FileText size={48} className="text-gray-300 dark:text-gray-700 mb-3" />
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Selecciona un archivo</p>
                            </div>
                        )}
                    </div>

                    {/* METADATOS DEL ARCHIVO */}
                    <div className="rounded-2xl border border-gray-100 dark:border-gray-800/60 p-4 space-y-3.5 bg-gray-50/30 dark:bg-gray-900/10"> 
                        <div><label className="text-xs font-bold uppercase tracking-wider text-gray-400">Nombre</label><p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-0.5 break-words">{selectedDoc?.nombre}</p></div>
                        <div><label className="text-xs font-bold uppercase tracking-wider text-gray-400">Creado por</label><p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-0.5">{selectedDoc?.autor}</p></div>
                        <div><label className="text-xs font-bold uppercase tracking-wider text-gray-400">Última modificación</label><p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-0.5">{selectedDoc?.fecha}</p></div>
                    </div>
                </div>

                {/* ACCIONES DEL PANEL */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-800/60 bg-gray-50/50 dark:bg-gray-900/20 grid grid-cols-2 gap-3">
                    <a href={selectedDoc?.url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer text-center text-sm"><ExternalLink size={16} />Abrir</a>
                    <a href={selectedDoc?.url} download className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold bg-primary dark:bg-[#C5AB81] text-white dark:text-gray-950 hover:bg-primary/90 dark:hover:bg-[#C5AB81]/90 transition-colors cursor-pointer text-center text-sm"><Download size={16} />Descargar</a>
                </div>
            </div>
        </div>
    );
}