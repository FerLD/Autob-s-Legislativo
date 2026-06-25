'use client';

import { useState, useRef } from 'react';
import { Upload, Download, FileText, Users, Globe, ChevronRight, MoreVertical, SortAsc, X, ExternalLink, Check, ChevronDown, Pencil, Save, Folder, ArrowLeft } from 'lucide-react';

interface Archivo {
  nombre: string;
  fecha: string;
  autor: string;
  tamaño: string;
  url: string;
}

interface Carpeta {
  id: string;
  nombre: string;
  fecha: string;
  autor: string;
  archivos: Archivo[];
  compartido: boolean;
}

const carpetasIniciales: Carpeta[] = [
  {
    id: "1",
    nombre: "Compilación de Estudios INILEG",
    fecha: "December 1, 2023",
    autor: "Instituto de Investigación",
    compartido: true,
    archivos: [
      {
        nombre: "Violencia de género y medidas de atención.pdf",
        fecha: "July 4, 2026",
        autor: "Agustin",
        tamaño: "405 KB",
        url: "/violencia.pdf"
      },
      {
        nombre: "La dimensión cultural y el desarrollo de la comunidad.pdf",
        fecha: "July 4, 2022",
        autor: "Dip. Cesar",
        tamaño: "222 KB",
        url: "#"
      }
    ]
  },
  {
    id: "2",
    nombre: "Ensayos Ganadores de Convocatorias a Concursos de Investigación",
    fecha: "March 6, 2023",
    autor: "Instituto de Investigación",
    compartido: true,
    archivos: [
      {
        nombre: "Determinación de la vocación turística.pdf",
        fecha: "May 4, 2024",
        autor: "Fer",
        tamaño: "6.27 MB",
        url: "#"
      }
    ]
  },
  {
    id: "3",
    nombre: "Estudios - Opiniones",
    fecha: "March 6, 2023",
    autor: "Instituto de Investigación",
    compartido: true,
    archivos: [
      {
        nombre: "La evaluación a los programas de prevención.pdf",
        fecha: "July 24, 2024",
        autor: "Dip. Camila",
        tamaño: "411 KB",
        url: "#"
      },
      {
        nombre: "Envejecimiento saludable. Una política pública.pdf",
        fecha: "July 12, 2024",
        autor: "Lic. Marco",
        tamaño: "374 KB",
        url: "#"
      }
    ]
  },
  {
    id: "4",
    nombre: "Informe de Resultados Consulta a NNA",
    fecha: "May 22, 2024",
    autor: "Guest Contributor",
    compartido: true,
    archivos: [
      {
        nombre: "El juicio político en México como herramienta.pdf",
        fecha: "July 4, 2024",
        autor: "Julia",
        tamaño: "488 KB",
        url: "#"
      }
    ]
  }
];

type TipoOrden = 'nombre-asc' | 'nombre-desc' | 'fecha-asc' | 'fecha-desc' | 'tamaño-asc' | 'tamaño-desc';
type CampoEditable = 'nombre' | 'autor';

export default function SharePointPage() {
  const [carpetas, setCarpetas] = useState<Carpeta[]>(carpetasIniciales);
  const [carpetaActual, setCarpetaActual] = useState<Carpeta | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<Archivo | null>(null);
  const [selectedDocs, setSelectedDocs] = useState<Archivo[]>([]);
  const [mostrarMenuOrden, setMostrarMenuOrden] = useState(false);
  const [tipoOrden, setTipoOrden] = useState<TipoOrden>('nombre-asc');
  const [editandoCampo, setEditandoCampo] = useState<CampoEditable | null>(null);
  const [valorTemp, setValorTemp] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const documentosActuales = carpetaActual? carpetaActual.archivos : [];

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file ||!carpetaActual) return;

    const tamañoFormateado = file.size > 1024 * 1024
     ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      : `${(file.size / 1024).toFixed(0)} KB`;

    const nuevoArchivo: Archivo = {
      nombre: file.name,
      fecha: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      autor: "Usuario Actual",
      tamaño: tamañoFormateado,
      url: URL.createObjectURL(file)
    };

    const carpetasActualizadas = carpetas.map(c =>
      c.id === carpetaActual.id
       ? {...c, archivos: [nuevoArchivo,...c.archivos] }
        : c
    );

    setCarpetas(carpetasActualizadas);
    setCarpetaActual({...carpetaActual, archivos: [nuevoArchivo,...carpetaActual.archivos] });
    setSelectedDoc(nuevoArchivo);
    event.target.value = '';
  };

  const descargarDocumento = (doc: Archivo) => {
    if (!doc.url || doc.url === "#") {
      alert(`"${doc.nombre}" no tiene URL de descarga disponible.`);
      return;
    }
    const link = document.createElement('a');
    link.href = doc.url;
    link.download = doc.nombre;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadClick = () => {
    if (selectedDocs.length > 0) {
      selectedDocs.forEach((doc, index) => {
        setTimeout(() => descargarDocumento(doc), index * 300);
      });
      return;
    }

    if (selectedDoc) {
      descargarDocumento(selectedDoc);
      return;
    }

    alert("Selecciona uno o varios documentos para descargar.");
  };

  const toggleDocSelection = (doc: Archivo) => {
    setSelectedDocs(prev => {
      const isSelected = prev.some(d => d.nombre === doc.nombre);
      if (isSelected) {
        return prev.filter(d => d.nombre!== doc.nombre);
      } else {
        return [...prev, doc];
      }
    });
  };

  const convertirTamañoABytes = (tamaño: string): number => {
    const valor = parseFloat(tamaño);
    if (tamaño.includes('MB')) return valor * 1024 * 1024;
    if (tamaño.includes('KB')) return valor * 1024;
    return valor;
  };

  const ordenarDocumentos = (tipo: TipoOrden) => {
    if (!carpetaActual) return;

    const documentosOrdenados = [...carpetaActual.archivos].sort((a, b) => {
    switch (tipo) {
        case 'nombre-asc':
        return a.nombre.localeCompare(b.nombre);
        case 'nombre-desc':
        return b.nombre.localeCompare(a.nombre);
        case 'fecha-asc':
        return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
        case 'fecha-desc':
        return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
        case 'tamaño-asc':
        return convertirTamañoABytes(a.tamaño) - convertirTamañoABytes(b.tamaño);
        case 'tamaño-desc':
        return convertirTamañoABytes(b.tamaño) - convertirTamañoABytes(a.tamaño);
        default:
        return 0;
    }
    });

    const carpetaActualizada = {...carpetaActual, archivos: documentosOrdenados };
    setCarpetaActual(carpetaActualizada);
    setCarpetas(carpetas.map(c => c.id === carpetaActual.id? carpetaActualizada : c));
    setTipoOrden(tipo);
    setMostrarMenuOrden(false);
  };

  const iniciarEdicion = (campo: CampoEditable) => {
    if (!selectedDoc) return;
    setEditandoCampo(campo);
    setValorTemp(selectedDoc[campo]);
  };

  const guardarEdicion = () => {
    if (!selectedDoc ||!editandoCampo ||!valorTemp.trim() ||!carpetaActual) return;

    const archivosActualizados = carpetaActual.archivos.map(doc =>
      doc.nombre === selectedDoc.nombre && doc.autor === selectedDoc.autor
       ? {...doc, [editandoCampo]: valorTemp.trim() }
        : doc
    );

    const carpetaActualizada = {...carpetaActual, archivos: archivosActualizados };
    setCarpetaActual(carpetaActualizada);
    setCarpetas(carpetas.map(c => c.id === carpetaActual.id? carpetaActualizada : c));
    setSelectedDoc({...selectedDoc, [editandoCampo]: valorTemp.trim() });
    setEditandoCampo(null);
    setValorTemp('');
  };

  const cancelarEdicion = () => {
    setEditandoCampo(null);
    setValorTemp('');
  };

  const opcionesOrden = [
    { valor: 'nombre-asc' as TipoOrden, label: 'Nombre A-Z' },
    { valor: 'nombre-desc' as TipoOrden, label: 'Nombre Z-A' },
    { valor: 'fecha-desc' as TipoOrden, label: 'Más recientes' },
    { valor: 'fecha-asc' as TipoOrden, label: 'Más antiguos' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-transparent transition-colors duration-500">
        <div className="container mx-auto px-4 py-16 max-w-6xl">

            {/* TITULO */}
            <div className="mb-6 relative">
            <div className="flex items-baseline gap-3">
                <h1 className="text-2xl md:text-[2.75rem] font-bold text-secondary dark:text-white leading-none tracking-tight">
                CEP
                </h1>
                <span className="text-2xl md:text-[2.75rem] font-bold text-primary leading-none tracking-tight">
                {carpetaActual? carpetaActual.archivos.length : carpetas.length}
                </span>
            </div>
            <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">
                {carpetaActual? carpetaActual.nombre : 'Repositorio del Centro de Estudios Parlamentarios'}
            </p>
            </div>

            {/* ACCIONES */}
            <div className="sticky top-6 z-20 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md p-3 mb-6 shadow-sm dark:shadow-black/20">
            <div className="flex flex-wrap items-center gap-3">
                {carpetaActual && (
                <button
                    onClick={() => {
                    setCarpetaActual(null);
                    setSelectedDoc(null);
                    setSelectedDocs([]);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium bg-white dark:bg-gray-800/50 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary active:scale-98 transition-all duration-200 cursor-pointer"
                >
                    <ArrowLeft size={18} />
                    Atrás
                </button>
                )}

                <button
                onClick={handleUploadClick}
                disabled={!carpetaActual}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium bg-white dark:bg-gray-800/50 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary active:scale-98 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                <Upload size={18} />
                Subir
                </button>

                <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf"
                className="hidden"
                />

                <button
                onClick={handleDownloadClick}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium border active:scale-98 transition-all duration-200 cursor-pointer ${
                    selectedDocs.length > 0 || selectedDoc
                    ? 'bg-primary dark:bg-[#C5AB81] text-white dark:text-gray-950 border-transparent'
                    : 'bg-white dark:bg-gray-800/50 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700/60'
                }`}
                >
                <Download size={18} />
                Descargar
                {selectedDocs.length > 0 && <span className="text-xs opacity-90">({selectedDocs.length})</span>}
                {selectedDocs.length === 0 && selectedDoc && <span className="text-xs opacity-80 max-w-[100px] truncate">({selectedDoc.nombre})</span>}
                </button>

                {selectedDocs.length > 0 && (
                <div className="px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/20 text-sm font-semibold">
                    {selectedDocs.length} seleccionados
                </div>
                )}

                {carpetaActual && (
                <div className="ml-auto relative">
                    <button
                    onClick={() => setMostrarMenuOrden(!mostrarMenuOrden)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 border border-transparent dark:border-gray-700/30 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-all duration-200 cursor-pointer"
                    >
                    <SortAsc size={18} />
                    Ordenar
                    <ChevronDown size={16} className={`transition-transform duration-200 ${mostrarMenuOrden? 'rotate-180' : ''}`} />
                    </button>

                    {mostrarMenuOrden && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setMostrarMenuOrden(false)} />
                        <div className="absolute right-0 mt-2 w-56 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/60 dark:border-gray-800/60 shadow-xl dark:shadow-black/30 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-2.5">
                            <div className="px-2 pb-2 mb-1.5">
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                Ordenar por
                            </p>
                            </div>
                            {opcionesOrden.map((opcion) => (
                            <button
                                key={opcion.valor}
                                onClick={() => ordenarDocumentos(opcion.valor)}
                                className={`w-full text-left px-3 py-2.5 text-sm rounded-xl transition-all duration-200 flex items-center gap-2.5 ${
                                tipoOrden === opcion.valor
                                ? 'bg-[#C5AB81]/10 border border-[#C5AB81]/30 text-[#C5AB81] font-semibold'
                                    : 'text-gray-600 dark:text-gray-400 border border-transparent hover:bg-[#C5AB81]/5 hover:border-[#C5AB81]/20 hover:text-[#C5AB81]'
                                }`}
                            >
                                <SortAsc size={16} className={tipoOrden === opcion.valor? 'opacity-100' : 'opacity-60'} />
                                <span className="flex-1">{opcion.label}</span>
                                {tipoOrden === opcion.valor && <Check size={16} className="stroke-[2.5]" />}
                            </button>
                            ))}
                        </div>
                        </div>
                    </>
                    )}
                </div>
                )}
            </div>
            </div>

            {/* BREADCRUMB */}
            <div className="flex flex-wrap items-center gap-2 mb-6 px-1 text-sm font-medium">
            <div className="w-8 h-8 rounded-xl bg-white dark:bg-gray-900 border border-[#C5AB81]/30 flex items-center justify-center shadow-sm text-xs">👤</div>
            <span className="px-2.5 py-1 rounded-xl bg-[#C5AB81]/5 border border-[#C5AB81]/30 text-[#C5AB81] hover:bg-[#C5AB81]/15 cursor-pointer transition-all duration-200">Evaluacion</span>
            <ChevronRight size={14} className="text-[#C5AB81]/60 shrink-0" />
            <span className="px-2.5 py-1 rounded-xl bg-[#C5AB81]/5 border border-[#C5AB81]/30 text-[#C5AB81] hover:bg-[#C5AB81]/15 cursor-pointer transition-all duration-200">LXVI Legislatura</span>
            <ChevronRight size={14} className="text-[#C5AB81]/60 shrink-0" />
            <span className="px-2.5 py-1 rounded-xl bg-[#C5AB81]/5 border border-[#C5AB81]/30 text-[#C5AB81] hover:bg-[#C5AB81]/15 cursor-pointer transition-all duration-200">2024</span>
            <ChevronRight size={14} className="text-[#C5AB81]/60 shrink-0" />
            <span className="px-2.5 py-1 rounded-xl bg-[#C5AB81]/5 border border-[#C5AB81]/30 text-[#C5AB81] hover:bg-[#C5AB81]/15 cursor-pointer transition-all duration-200">CEP</span>
            {carpetaActual && (
                <>
                <ChevronRight size={14} className="text-[#C5AB81]/60 shrink-0" />
                <span className="px-2.5 py-1 rounded-xl bg-[#C5AB81]/5 border border-[#C5AB81]/30 text-[#C5AB81] hover:bg-[#C5AB81]/15 cursor-pointer transition-all duration-200">{carpetaActual.nombre}</span>
                </>
            )}
            <div className="flex items-center gap-2 ml-2 border-l border-[#C5AB81]/30 pl-3 text-[#C5AB81]/70"><Users size={16} /><Globe size={16} /></div>
            </div>

            {/* DOCUMENTOS/CARPETAS */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 overflow-hidden shadow-sm dark:shadow-black/10">
            {/* HEADER */}
            <div className="grid grid-cols-12 p-4 border-b border-gray-200 dark:border-gray-800/80 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 bg-gray-50/50 dark:bg-gray-900/50">
                <div className="col-span-6">Nombre</div>
                <div className="col-span-2">Modificado</div>
                <div className="col-span-2">Autor</div>
                <div className="col-span-1">Tamaño</div>
                <div className="col-span-1 text-right"></div>
            </div>

            {/* VISTA DE CARPETAS */}
            {!carpetaActual && carpetas.map((carpeta, i) => (
                <div
                key={carpeta.id}
                onClick={() => setCarpetaActual(carpeta)}
                className="grid grid-cols-12 items-center p-4 border-b border-gray-100 dark:border-gray-800/40 last:border-0 transition-all duration-200 hover:bg-primary/5 dark:hover:bg-[#C5AB81]/5 cursor-pointer group"
                >
                <div className="col-span-6 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#C5AB81]/10 border border-[#C5AB81]/20 flex items-center justify-center group-hover:scale-105 transition-all duration-200 shrink-0">
                    <Folder size={20} className="text-[#C5AB81]" />
                    </div>
                    <span className="font-semibold text-gray-700 dark:text-gray-200 group-hover:text-primary dark:group-hover:text-[#C5AB81] transition-colors duration-200 truncate">
                    {carpeta.nombre}
                    </span>
                </div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 col-span-2">{carpeta.fecha}</div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 col-span-2">{carpeta.autor}</div>
                <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 col-span-1">{carpeta.archivos.length} items</div>
                <div className="text-right text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-[#C5AB81] col-span-1 font-bold text-lg transition duration-200">...</div>
                </div>
            ))}

            {/* VISTA DE ARCHIVOS DENTRO DE CARPETA */}
            {carpetaActual && documentosActuales.map((doc, i) => {
                const isSelected = selectedDocs.some(d => d.nombre === doc.nombre);

                return (
                <div
                    key={i}
                    onClick={() => setSelectedDoc(doc)}
                    className={`grid grid-cols-12 items-center p-4 border-b border-gray-100 dark:border-gray-800/40 last:border-0 transition-all duration-200 hover:bg-primary/5 dark:hover:bg-[#C5AB81]/5 cursor-pointer group ${selectedDoc?.nombre === doc.nombre? 'bg-primary/5 dark:bg-[#C5AB81]/10' : ''}`}
                >
                    <div className="col-span-6 flex items-center gap-4">
                    <div
                        onClick={(e) => {
                        e.stopPropagation();
                        toggleDocSelection(doc);
                        }}
                        className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/20 flex items-center justify-center group-hover:scale-105 transition-all duration-200 shrink-0 cursor-pointer relative"
                    >
                        {isSelected? (
                        <div className="w-5 h-5 rounded-md bg-red-500 dark:bg-red-400 flex items-center justify-center">
                            <Check size={14} className="text-white stroke-[3]" />
                        </div>
                        ) : (
                        <>
                            <FileText size={20} className="text-red-500 dark:text-red-400 group-hover:opacity-0 transition-opacity duration-200" />
                            <div className="w-5 h-5 rounded-md border-2 border-red-500 dark:border-red-400 absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </>
                        )}
                    </div>

                    <span className="font-semibold text-gray-700 dark:text-gray-200 group-hover:text-primary dark:group-hover:text-[#C5AB81] transition-colors duration-200 truncate">
                        {doc.nombre}
                    </span>
                    </div>

                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 col-span-2">{doc.fecha}</div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 col-span-2">{doc.autor}</div>
                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 col-span-1">{doc.tamaño}</div>
                    <div className="text-right text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-[#C5AB81] col-span-1 font-bold text-lg transition duration-200">...</div>
                </div>
                );
            })}
            </div>
        </div>

        {/* BACKDROP DEL PANEL DE VISTA PREVIA */}
        {selectedDoc && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300" onClick={() => {
            setSelectedDoc(null);
            setEditandoCampo(null);
        }} />}

        {/* PANEL DE VISTA PREVIA LATERAL */}
        <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800/80 shadow-2xl z-50 transition-transform duration-300 transform flex flex-col ${selectedDoc? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-6 border-b border-gray-100 dark:border-gray-800/60 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/20">
            <div className="flex items-center gap-3">
                <FileText className="text-red-500 dark:text-red-400" size={22} />
                <span className="font-bold text-gray-900 dark:text-[#C5AB81] text-lg">Vista Previa</span>
            </div>
            <button onClick={() => {
                setSelectedDoc(null);
                setEditandoCampo(null);
            }} className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"><X size={20} /></button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-6">
            <div className="aspect-[3/4] w-full rounded-2xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden shadow-inner">
                {selectedDoc?.url && selectedDoc.url!== "#"? (
                <iframe
                    src={`${selectedDoc.url}#toolbar=0&navpanes=0`}
                    className="w-full h-full border-0 select-none"
                    title="Previsualización de PDF"
                />
                ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                    <FileText size={48} className="text-gray-300 dark:text-gray-700 mb-3" />
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {selectedDoc? "Vista previa no disponible" : "Selecciona un archivo"}
                    </p>
                </div>
                )}
            </div>

            {/* CAMPOS EDITABLES */}
            <div className="rounded-2xl border border-gray-100 dark:border-gray-800/60 p-4 space-y-3.5 bg-gray-50/30 dark:bg-gray-900/10">
                {/* NOMBRE EDITABLE */}
                <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Nombre</label>
                {editandoCampo === 'nombre'? (
                    <div className="flex items-center gap-2 mt-0.5">
                    <input
                        type="text"
                        value={valorTemp}
                        onChange={(e) => setValorTemp(e.target.value)}
                        onKeyDown={(e) => {
                        if (e.key === 'Enter') guardarEdicion();
                        if (e.key === 'Escape') cancelarEdicion();
                        }}
                        className="flex-1 px-2 py-1 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-[#C5AB81] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5AB81]/20"
                        autoFocus
                    />
                    <button
                        onClick={guardarEdicion}
                        className="p-1.5 rounded-lg bg-[#C5AB81]/10 text-[#C5AB81] hover:bg-[#C5AB81]/20 transition-colors"
                    >
                        <Save size={16} />
                    </button>
                    <button
                        onClick={cancelarEdicion}
                        className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        <X size={16} />
                    </button>
                    </div>
                ) : (
                    <div className="flex items-center justify-between gap-2 mt-0.5 group">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 break-words flex-1">
                        {selectedDoc?.nombre}
                    </p>
                    <button
                        onClick={() => iniciarEdicion('nombre')}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-[#C5AB81]/10 text-gray-400 hover:text-[#C5AB81] transition-all duration-200"
                    >
                        <Pencil size={16} />
                    </button>
                    </div>
                )}
                </div>

                {/* AUTOR EDITABLE */}
                <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Creado por</label>
                {editandoCampo === 'autor'? (
                    <div className="flex items-center gap-2 mt-0.5">
                    <input
                        type="text"
                        value={valorTemp}
                        onChange={(e) => setValorTemp(e.target.value)}
                        onKeyDown={(e) => {
                        if (e.key === 'Enter') guardarEdicion();
                        if (e.key === 'Escape') cancelarEdicion();
                        }}
                        className="flex-1 px-2 py-1 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-[#C5AB81] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5AB81]/20"
                        autoFocus
                    />
                    <button
                        onClick={guardarEdicion}
                        className="p-1.5 rounded-lg bg-[#C5AB81]/10 text-[#C5AB81] hover:bg-[#C5AB81]/20 transition-colors"
                    >
                        <Save size={16} />
                    </button>
                    <button
                        onClick={cancelarEdicion}
                        className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        <X size={16} />
                    </button>
                    </div>
                ) : (
                    <div className="flex items-center justify-between gap-2 mt-0.5 group">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex-1">
                        {selectedDoc?.autor}
                    </p>
                    <button
                        onClick={() => iniciarEdicion('autor')}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-[#C5AB81]/10 text-gray-400 hover:text-[#C5AB81] transition-all duration-200"
                    >
                        <Pencil size={16} />
                    </button>
                    </div>
                )}
                </div>

                <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Última modificación</label>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-0.5">{selectedDoc?.fecha}</p>
                </div>
            </div>
            </div>

            {/* ACCIONES DEL PANEL */}
            <div className="p-6 border-t border-gray-100 dark:border-gray-800/60 bg-gray-50/50 dark:bg-gray-900/20 grid grid-cols-2 gap-3">
            <a href={selectedDoc?.url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer text-center text-sm">
                <ExternalLink size={16} />Abrir</a>
            <a href={selectedDoc?.url} download={selectedDoc?.nombre} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold bg-primary dark:bg-[#C5AB81] text-white dark:text-gray-950 hover:bg-primary/90 dark:hover:bg-[#C5AB81]/90 transition-colors cursor-pointer text-center text-sm">
                <Download size={16} />Descargar</a>
            </div>
        </div>
    </div>
  );
}