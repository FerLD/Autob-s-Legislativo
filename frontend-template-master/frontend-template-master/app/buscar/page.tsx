'use client';

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
}

const OPCIONES_TIPO = [
  "Con dictamen en Comisión",
  "Con dictamen en pleno",
  "Comisión",
];

// Mapa de romanos a arábigos para buscar por número (ej: "66" → "LXVI")
const ROMAN_TO_ARABIC: Record<string, number> = {
  I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9, X: 10,
  XI: 11, XII: 12, XIII: 13, XIV: 14, XV: 15, XVI: 16, XVII: 17, XVIII: 18,
  XIX: 19, XX: 20, XXI: 21, XXX: 30, XL: 40, L: 50, LX: 60,
  LXI: 61, LXII: 62, LXIII: 63, LXIV: 64, LXV: 65, LXVI: 66,
  LXVII: 67, LXVIII: 68, LXIX: 69, LXX: 70,
};

export default function BuscarPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const queryParam = searchParams.get('q') || '';
  const filtersParam = searchParams.get('filters') || '';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [keywordQuery, setKeywordQuery] = useState('');
  const [legislaturaQuery, setLegislaturaQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [typeOpen, setTypeOpen] = useState(false);

  const [allData, setAllData] = useState<Iniciativa[]>([]);
  const [results, setResults] = useState<Iniciativa[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingFilter, setLoadingFilter] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos de la API una sola vez
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

  // Sincronizar input con URL
  useEffect(() => {
    setSearchQuery(queryParam);
  }, [queryParam]);

  // Cerrar dropdown al click afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setTypeOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtrar datos cuando cambia cualquier filtro o los datos
useEffect(() => {
  if (loadingData) return;
  setLoadingFilter(true);
  const timer = setTimeout(() => {
    const filters = filtersParam ? filtersParam.split(',') : [];
    const qLower = searchQuery.toLowerCase();
    const kLower = keywordQuery.toLowerCase();
    const lQuery = legislaturaQuery.trim().toUpperCase();

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

      const matchesType =
        !selectedType ||
        ini.tipo_tramite?.toLowerCase() === selectedType.toLowerCase();

      // Filtro de legislatura: SOLO por letras romanas en expediente y folio_id
      const matchesLegislatura = (() => {
        if (!legislaturaQuery) return true;
        
        // Extrae solo las letras romanas del expediente: "5/LXVI-I" → "LXVI"
        const extractRoman = (str: string) => {
          const match = str.match(/([IVXLCDM]+)(?:-\w+)?$/i);
          return match? match[1].toUpperCase() : '';
        };

        const expedienteRoman = extractRoman(ini.expediente);
        const folioRoman = extractRoman(ini.folio_id || '');
        const legislaturaRoman = extractRoman(ini.legislatura || '');

        // Solo compara con la parte romana, ignora números
        return (
          expedienteRoman.includes(lQuery) ||
          folioRoman.includes(lQuery) ||
          legislaturaRoman.includes(lQuery)
        );
      })();

      // Filtros del header (metodología, dictamen, etc.)
      const matchesFilters =
        filters.length === 0 ||
        filters.every((f) => {
          if (f === 'metodologia') return (ini as any).tiene_metodologia;
          if (f === 'dictamen-comision') return (ini as any).tiene_dictamen_comision;
          if (f === 'dictamen') return (ini as any).tiene_dictamen;
          return true;
        });

      return matchesQuery && matchesKeyword && matchesType && matchesLegislatura && matchesFilters;
    });

    setResults(filtered);
    setLoadingFilter(false);
  }, 300);

  return () => clearTimeout(timer);
}, [searchQuery, keywordQuery, legislaturaQuery, selectedType, filtersParam, allData, loadingData]);
  const handleSearchSubmit = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) params.set('q', searchQuery);
    else params.delete('q');
    router.push(`?${params.toString()}`);
  };

  const isLoading = loadingData || loadingFilter;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#111827] pt-24 pb-12 transition-colors duration-500">
      <div className="container mx-auto px-4 flex flex-col items-center">

        {/* Header */}
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

          {/* Buscador */}
<div className="w-full mt-8 bg-white dark:bg-slate-900/50 rounded-2xl border border-gray-200 dark:border-[#1e3a5f] shadow-sm p-5">
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

    {/* Descripción */}
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

    {/* Tipo de expediente */}
    <div ref={dropdownRef} className="relative">
      <label className="text-sm font-medium text-gray-600 dark:text-slate-300">Filtros</label>
      <button
        type="button"
        onClick={() => setTypeOpen(!typeOpen)}
        className="w-full mt-1.5 h-11 px-4 rounded-xl bg-white dark:bg-slate-950 border border-gray-300 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-200 hover:border-primary/50 transition-all flex items-center justify-between shadow-sm"
      >
        <span className="truncate mr-2">{selectedType || 'Todos'}</span>
        <svg className="w-4 h-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" />
        </svg>
      </button>
      {typeOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute top-20 left-0 w-full rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 shadow-xl p-2 z-50 overflow-y-auto max-h-60"
        >
          <button
            onClick={() => { setSelectedType(''); setTypeOpen(false); }}
            className={`w-full px-4 py-2.5 rounded-lg text-left text-sm transition ${!selectedType ? 'bg-primary text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
          >
            Todos
          </button>
          {OPCIONES_TIPO.map((type) => (
            <button
              key={type}
              onClick={() => { setSelectedType(type); setTypeOpen(false); }}
              className={`w-full px-4 py-2.5 rounded-lg text-left text-sm transition ${selectedType === type ? 'bg-primary text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
            >
              {type}
            </button>
          ))}
        </motion.div>
      )}
    </div>

    {/* Palabras clave */}
    <div>
      <label className="text-sm font-medium text-gray-600 dark:text-slate-300">Palabras clave</label>
      <input
        value={keywordQuery}
        onChange={(e) => setKeywordQuery(e.target.value)}
        placeholder="Palabra clave"
        className="w-full mt-1.5 h-11 px-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-950 text-gray-800 dark:text-blue-100 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-primary/40 transition-all"
      />
    </div>

    {/* Legislatura */}
    <div>
      <label className="text-sm font-medium text-gray-600 dark:text-slate-300">Legislatura</label>
      <input
        value={legislaturaQuery}
        onChange={(e) => setLegislaturaQuery(e.target.value)}
        placeholder="Ej: LXVI, LXV"
        className="w-full mt-1.5 h-11 px-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-950 text-gray-800 dark:text-blue-100 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-primary/40 transition-all"
      />
    </div>

    {/* Botón buscar */}
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

  </div>
</div>
        </motion.div>

        {/* Results */}
        <div className="max-w-4xl w-full">

          {/* Error */}
          {error && (
            <div className="text-center py-12">
              <div className="text-red-600 text-4xl mb-4">⚠</div>
              <p className="text-red-600 font-semibold">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Loading */}
          {!error && isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Resultados */}
          {!error && !isLoading && results.length > 0 && (
            <div className="space-y-4">
              {results.map((ini, idx) => (
                <motion.div
                  key={`${ini.iniciativa_id}-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                >
                  <Link href={`/expediente/${ini.iniciativa_id}`} className="block">
                    <div className="group bg-white dark:bg-slate-900/40 rounded-xl border border-gray-200 dark:border-[#1e3a5f] p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-300 cursor-pointer">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">

                          {/* Número de expediente */}
                          <div className="flex items-center gap-2 mb-2">
                            <Folder className="w-4 h-4 text-primary opacity-80" />
                            <span className="text-sm font-mono text-gray-500 dark:text-slate-400">
                              {ini.expediente}
                            </span>
                          </div>

                          {/* Título */}
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-blue-100 group-hover:text-primary transition-colors">
                            {ini.comunicado_titulo}
                          </h3>

                          {/* Resumen */}
                          <p className="text-sm text-gray-600 dark:text-blue-200/70 mt-2 line-clamp-2">
                            {ini.resumen_corto || 'Sin descripción disponible'}
                          </p>

                          {/* Fecha y folio */}
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

                          {/* Badges: tipo y legislatura */}
                          <div className="flex items-center gap-2 mt-4 flex-wrap">
                            {ini.tipo_tramite && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded border dark:border-gray-700">
                                {ini.tipo_tramite}
                              </span>
                            )}
                            {ini.legislatura && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded border border-blue-200 dark:border-blue-800">
                                {ini.legislatura}
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

          {/* Sin resultados */}
          {!error && !isLoading && results.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center py-12"
            >
              <FileText className="w-16 h-16 text-gray-300 dark:text-slate-700 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-blue-100 mb-2">
                No se encontraron resultados
              </h2>
              <p className="text-gray-600 dark:text-blue-200/70 mb-6">
                {searchQuery
                  ? `No hay iniciativas que coincidan con "${searchQuery}"`
                  : 'Intenta con otros términos de búsqueda'}
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
              >
                Volver al Inicio
              </Link>
            </motion.div>
          )}

          {/* Contador de resultados */}
          {!error && !isLoading && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="mt-8 p-4 bg-gray-100 dark:bg-slate-900/30 rounded-lg border border-gray-200 dark:border-[#1e3a5f]"
            >
              <p className="text-sm text-gray-700 dark:text-slate-300">
                Se encontraron <span className="font-semibold">{results.length}</span> resultado{results.length !== 1 ? 's' : ''}
                {!loadingData && allData.length > 0 && (
                  <span className="text-gray-400 dark:text-slate-500"> de {allData.length} iniciativas</span>
                )}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}