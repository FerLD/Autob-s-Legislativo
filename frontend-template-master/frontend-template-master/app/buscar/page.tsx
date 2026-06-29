'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Folder, FileText, Calendar, ArrowRight } from 'lucide-react';

interface Iniciativa {
  iniciativa_id: number;
  expediente: string;
  comunicado_titulo: string;
  resumen_corto: string;
  imagen_url: string;
  folio_id: string;
  estatus: string;
  fecha_entrega: string;
  tipo_tramite?: string | null;
  iniciante?: string;
  legislatura?: string;
  fecha_presentacion_pleno?: string | null;
  nombre_comision?: string | null;
}

const OPCIONES_TIPO = [
  "Con dictamen en Comisión",
  "Con dictamen en pleno",
];

const OPCIONES_COMISION = [
  "Comisión de Derechos Humanos y Atención a Grupos Vulnerables",
  "Comisión de Gobernación y Puntos Constitucionales",
  "Comisión de Justicia",
  "Comisión de Asuntos Municipales",
  "Comisión de Asuntos Electorales",
  "Comisión de Desarrollo Urbano y Obra Pública",
  "Comisión de Educación, Ciencia y Tecnología y Cultura",
  "Comisión de Medio Ambiente",
  "Comisión de Desarrollo Económico y Social",
  "Comisión Para las Juventudes y Deporte",
  "Comisión Para la Igualdad de Género",
  "Comisión de Salud Pública",
  "Comisión de Desarrollo Rural y Fomento Agropecuario",
  "Comisión de Movilidad y Seguridad Vial",
  "Comisión de Turismo",
  "Comisión de Juventud y Deporte",
  "Comisiones Unidas de Desarrollo Económico y Social y de Educación, Ciencia y Tecnología y Cultura",
];

const OPCIONES_LEGISLATURA = [
  { label: 'LXVI Legislatura', valor: 'LXVI' },
  { label: 'LXV Legislatura', valor: 'LXV' },
];

const ROMAN_TO_ARABIC: Record<string, number> = {
  I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9, X: 10,
  XI: 11, XII: 12, XIII: 13, XIV: 14, XV: 15, XVI: 16, XVII: 17, XVIII: 18,
  XIX: 19, XX: 20, XXI: 21, XXX: 30, XL: 40, L: 50, LX: 60,
  LXI: 61, LXII: 62, LXIII: 63, LXIV: 64, LXV: 65, LXVI: 66,
  LXVII: 67, LXVIII: 68, LXIX: 69, LXX: 70,
};

function BuscarContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const comisionRef = useRef<HTMLDivElement>(null);
  const legislaturaRef = useRef<HTMLDivElement>(null);

  const queryParam = searchParams.get('q') || '';
  const filtersParam = searchParams.get('filters') || '';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [keywordQuery, setKeywordQuery] = useState('');
  const [selectedLegislatura, setSelectedLegislatura] = useState<string[]>([]);
  const [legislaturaOpen, setLegislaturaOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [typeOpen, setTypeOpen] = useState(false);
  const [selectedComision, setSelectedComision] = useState('');
  const [comisionOpen, setComisionOpen] = useState(false);

  const [allData, setAllData] = useState<Iniciativa[]>([]);
  const [results, setResults] = useState<Iniciativa[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingFilter, setLoadingFilter] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoadingData(true);
        setError(null);
        const response = await fetch('/api/inileg');
        const result = await response.json();
        if (result.success) {
          setAllData(result.data || []);
        } else {
          setError(result.error || 'Error al cargar los datos');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error de conexión');
      } finally {
        setLoadingData(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    setSearchQuery(queryParam);
  }, [queryParam]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setTypeOpen(false);
      if (comisionRef.current && !comisionRef.current.contains(event.target as Node)) setComisionOpen(false);
      if (legislaturaRef.current && !legislaturaRef.current.contains(event.target as Node)) setLegislaturaOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (loadingData) return;
    setLoadingFilter(true);
    const timer = setTimeout(() => {
      const filters = filtersParam ? filtersParam.split(',') : [];
      const qLower = searchQuery.toLowerCase();
      const kLower = keywordQuery.toLowerCase();

      const filtered = allData.filter((ini) => {
        const matchesQuery =
          !searchQuery ||
          ini.expediente.toLowerCase().includes(qLower) ||
          ini.comunicado_titulo.toLowerCase().includes(qLower) ||
          ini.resumen_corto?.toLowerCase().includes(qLower) ||
          ini.iniciante?.toLowerCase().includes(qLower);

        const matchesKeyword =
          !keywordQuery ||
          ini.comunicado_titulo.toLowerCase().includes(kLower) ||
          ini.resumen_corto?.toLowerCase().includes(kLower);

        const matchesType = (() => {
          if (!selectedType) return true;
          if (selectedType === "Con dictamen en pleno") {
            return ini.fecha_presentacion_pleno != null && ini.fecha_presentacion_pleno !== '';
          }
          if (selectedType === "Con dictamen en Comisión") {
            return ini.tipo_tramite?.toLowerCase().includes("dictamen") &&
                   ini.tipo_tramite?.toLowerCase().includes("comisión");
          }
          return ini.tipo_tramite?.toLowerCase() === selectedType.toLowerCase();
        })();

        const matchesLegislatura = (() => {
          if (selectedLegislatura.length === 0) return true;
          const extractRomanBase = (str: string) => {
            if (!str) return '';
            const match = str.match(/\/([IVXLCDM]+)/i);
            return match ? match[1].toUpperCase() : '';
          };
          const expedienteRoman = extractRomanBase(ini.expediente);
          const folioRoman = extractRomanBase(ini.folio_id || '');
          const legislaturaRoman = (ini.legislatura || '').toUpperCase();
          return selectedLegislatura.some(val => {
            const selectedUpper = val.toUpperCase();
            return (
              expedienteRoman === selectedUpper ||
              folioRoman === selectedUpper ||
              legislaturaRoman.includes(selectedUpper)
            );
          });
        })();

        const matchesComision =
          !selectedComision ||
          ini.nombre_comision === selectedComision;

        const matchesFilters =
          filters.length === 0 ||
          filters.every((f) => {
            if (f === 'metodologia') return (ini as any).tiene_metodologia;
            if (f === 'dictamen-comision') return (ini as any).tiene_dictamen_comision;
            if (f === 'dictamen') return (ini as any).tiene_dictamen;
            return true;
          });

        return matchesQuery && matchesKeyword && matchesType && matchesLegislatura && matchesComision && matchesFilters;
      });

      filtered.sort((a, b) => {
        const getLegislaturaNum = (exp: string) => {
          const match = exp.match(/\/([IVXLCDM]+)/i);
          if (!match) return 0;
          return ROMAN_TO_ARABIC[match[1].toUpperCase()] || 0;
        };
        const legA = getLegislaturaNum(a.expediente);
        const legB = getLegislaturaNum(b.expediente);
        if (legB !== legA) return legB - legA;
        const fechaA = a.fecha_presentacion_pleno ? new Date(a.fecha_presentacion_pleno).getTime() : 0;
        const fechaB = b.fecha_presentacion_pleno ? new Date(b.fecha_presentacion_pleno).getTime() : 0;
        if (fechaB !== fechaA) return fechaB - fechaA;
        return b.iniciativa_id - a.iniciativa_id;
      });

      setResults(filtered);
      setLoadingFilter(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, keywordQuery, selectedLegislatura, selectedType, selectedComision, filtersParam, allData, loadingData]);

  const handleSearchSubmit = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) params.set('q', searchQuery);
    else params.delete('q');
    router.push(`?${params.toString()}`);
  };

  const isLoading = loadingData || loadingFilter;

  const legislaturaLabel = selectedLegislatura.length === 0
    ? 'Todas'
    : selectedLegislatura.length === 2
    ? 'LXVI y LXV'
    : selectedLegislatura[0] === 'LXVI' ? 'LXVI Legislatura' : 'LXV Legislatura';

  const chevron = (
    <svg className="w-4 h-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" />
    </svg>
  );

  const dropdownClass = "absolute top-[4.5rem] left-0 w-full rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 shadow-xl p-2 z-50 overflow-y-auto max-h-72";
  const itemBase = "w-full px-4 py-2.5 rounded-lg text-left text-sm transition";
  const itemActive = "bg-primary text-white";
  const itemInactive = "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800";
  const btnBase = "w-full mt-1.5 h-11 px-4 rounded-xl bg-white dark:bg-slate-950 border text-sm hover:border-primary/50 transition-all flex items-center justify-between shadow-sm";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#111827] pt-24 pb-12 transition-colors duration-500">
      <div className="container mx-auto px-4 flex flex-col items-center">

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-12 w-full max-w-4xl"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-blue-100 mb-2 text-center">
            Búsqueda de Iniciativas
          </h1>
          <p className="text-gray-600 dark:text-blue-200/70 text-center">
            {searchQuery ? `Resultados para: "${searchQuery}"` : 'Explora todas las iniciativas legislativas'}
          </p>

          <div className="w-full mt-8 bg-white dark:bg-slate-900/50 rounded-2xl border border-gray-200 dark:border-[#1e3a5f] shadow-sm p-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

              <div className="md:col-span-4">
                <label className="text-sm font-medium text-gray-600 dark:text-slate-300">Descripción</label>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                  className="w-full mt-1.5 h-11 px-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-950 text-gray-800 dark:text-blue-100 outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  placeholder="Buscar por número, título o expediente..."
                />
              </div>

              <div ref={dropdownRef} className="relative">
                <label className="text-sm font-medium text-gray-600 dark:text-slate-300">Filtros</label>
                <button
                  type="button"
                  onClick={() => { setTypeOpen(!typeOpen); setComisionOpen(false); setLegislaturaOpen(false); }}
                  className={`${btnBase} ${selectedType ? 'border-primary/60 text-gray-900 dark:text-gray-100' : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200'}`}
                >
                  <span className="truncate mr-2">{selectedType || 'Todos'}</span>
                  {chevron}
                </button>
                {typeOpen && (
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.2 }} className={dropdownClass}>
                    <button onClick={() => { setSelectedType(''); setTypeOpen(false); }} className={`${itemBase} ${!selectedType ? itemActive : itemInactive}`}>Todos</button>
                    {OPCIONES_TIPO.map((type) => (
                      <button key={type} onClick={() => { setSelectedType(type); setTypeOpen(false); }} className={`${itemBase} ${selectedType === type ? itemActive : itemInactive}`}>{type}</button>
                    ))}
                  </motion.div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-slate-300">Palabras clave</label>
                <input
                  value={keywordQuery}
                  onChange={(e) => setKeywordQuery(e.target.value)}
                  placeholder="Palabra clave"
                  className="w-full mt-1.5 h-11 px-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-950 text-gray-800 dark:text-blue-100 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                />
              </div>

              <div ref={legislaturaRef} className="relative">
                <label className="text-sm font-medium text-gray-600 dark:text-slate-300">Legislatura</label>
                <button
                  type="button"
                  onClick={() => { setLegislaturaOpen(!legislaturaOpen); setTypeOpen(false); setComisionOpen(false); }}
                  className={`${btnBase} ${selectedLegislatura.length > 0 ? 'border-primary/60 text-gray-900 dark:text-gray-100' : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200'}`}
                >
                  <span className="truncate mr-2">{legislaturaLabel}</span>
                  {chevron}
                </button>
                {legislaturaOpen && (
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.2 }} className={`${dropdownClass} max-h-48`}>
                    <button
                      onClick={() => { setSelectedLegislatura([]); setLegislaturaOpen(false); }}
                      className={`${itemBase} ${selectedLegislatura.length === 0 ? itemActive : itemInactive}`}
                    >
                      Todas
                    </button>
                    {OPCIONES_LEGISLATURA.map((op) => {
                      const isSelected = selectedLegislatura.includes(op.valor);
                      return (
                        <button
                          key={op.valor}
                          onClick={() => setSelectedLegislatura(isSelected
                            ? selectedLegislatura.filter(v => v !== op.valor)
                            : [...selectedLegislatura, op.valor]
                          )}
                          className={`${itemBase} flex items-center justify-between ${isSelected ? itemActive : itemInactive}`}
                        >
                          <span>{op.label}</span>
                          {isSelected && (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleSearchSubmit}
                  className="w-full h-11 px-5 rounded-xl bg-gradient-to-r from-primary to-[#b8985f] hover:from-primary-dark hover:to-[#a88750] text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg shadow-primary/20"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Buscar
                </button>
              </div>

              <div ref={comisionRef} className="relative md:col-span-4">
                <label className="text-sm font-medium text-gray-600 dark:text-slate-300">Comisión</label>
                <button
                  type="button"
                  onClick={() => { setComisionOpen(!comisionOpen); setTypeOpen(false); setLegislaturaOpen(false); }}
                  className={`${btnBase} ${selectedComision ? 'border-primary/60 text-gray-900 dark:text-gray-100' : 'border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-500'}`}
                >
                  <span className="truncate mr-2">{selectedComision || 'Todas las comisiones'}</span>
                  {chevron}
                </button>
                {comisionOpen && (
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.2 }} className={dropdownClass}>
                    <button onClick={() => { setSelectedComision(''); setComisionOpen(false); }} className={`${itemBase} ${!selectedComision ? itemActive : itemInactive}`}>Todas</button>
                    {OPCIONES_COMISION.map((c) => (
                      <button key={c} onClick={() => { setSelectedComision(c); setComisionOpen(false); }} className={`${itemBase} leading-snug ${selectedComision === c ? itemActive : itemInactive}`}>{c}</button>
                    ))}
                  </motion.div>
                )}
              </div>

            </div>
          </div>
        </motion.div>

        <div className="max-w-4xl w-full">
          {error && (
            <div className="text-center py-12">
              <div className="text-red-600 text-4xl mb-4">⚠</div>
              <p className="text-red-600 font-semibold">{error}</p>
              <button onClick={() => window.location.reload()} className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">Reintentar</button>
            </div>
          )}

          {!error && isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}

          {!error && !isLoading && results.length > 0 && (
            <div className="space-y-4">
              {results.map((ini, idx) => (
                <motion.div key={`${ini.iniciativa_id}-${idx}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: idx * 0.04 }}>
                  <Link href={`/expediente/${ini.iniciativa_id}`} className="block">
                    <div className="group bg-white dark:bg-slate-900/40 rounded-xl border border-gray-200 dark:border-[#1e3a5f] p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-300 cursor-pointer">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Folder className="w-4 h-4 text-primary opacity-80" />
                            <span className="text-sm font-mono text-gray-500 dark:text-slate-400">{ini.expediente}</span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-blue-100 group-hover:text-primary transition-colors">{ini.comunicado_titulo}</h3>
                          <p className="text-sm text-gray-600 dark:text-blue-200/70 mt-2 line-clamp-2">{ini.resumen_corto || 'Sin descripción disponible'}</p>
                          <div className="flex flex-wrap gap-4 mt-4">
                            {ini.fecha_entrega && (
                              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400">
                                <Calendar className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                                {ini.fecha_entrega}
                              </div>
                            )}
                            {ini.folio_id && (
                              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400">
                                <FileText className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                                Folio: {ini.folio_id}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-4 flex-wrap">
                            {ini.tipo_tramite && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded border dark:border-gray-700">{ini.tipo_tramite}</span>
                            )}
                            {ini.legislatura && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded border border-blue-200 dark:border-blue-800">{ini.legislatura}</span>
                            )}
                            {ini.nombre_comision && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-[#C5AB81]/10 dark:bg-[#C5AB81]/5 text-amber-700 dark:text-[#C5AB81] rounded border border-amber-200 dark:border-[#C5AB81]/30">
                                {ini.nombre_comision}
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
          )}

          {!error && !isLoading && results.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 dark:text-slate-700 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-blue-100 mb-2">No se encontraron resultados</h2>
              <p className="text-gray-600 dark:text-blue-200/70 mb-6">{searchQuery ? `No hay iniciativas que coincidan con "${searchQuery}"` : 'Intenta con otros términos de búsqueda'}</p>
              <Link href="/" className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium">Volver al Inicio</Link>
            </motion.div>
          )}

          {!error && !isLoading && results.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }} className="mt-8 p-4 bg-gray-100 dark:bg-slate-900/30 rounded-lg border border-gray-200 dark:border-[#1e3a5f]">
              <p className="text-sm text-gray-700 dark:text-slate-300">
                Se encontraron <span className="font-semibold">{results.length}</span> resultado{results.length !== 1 ? 's' : ''}
                {!loadingData && allData.length > 0 && <span className="text-gray-400 dark:text-slate-500"> de {allData.length} iniciativas</span>}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BuscarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <BuscarContent />
    </Suspense>
  );
}