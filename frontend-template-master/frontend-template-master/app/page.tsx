'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';

import {
  getDocumentoSIAD,
  getTodosDocumentosSIAD,
  DocumentoSIAD
} from '@/services/inilegClientService';

interface Iniciativa {
  iniciativa_id: number;
  expediente: string;
  comunicado_titulo: string;
  resumen_corto: string;
  imagen_url: string;
  folio_id: string;
  estatus: string;
  fecha_entrega: string;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const router = useRouter();
  const [iniciativas, setIniciativas] = useState<Iniciativa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Estado de loading por card, no global
  const [loadingDocId, setLoadingDocId] = useState<number | null>(null);
  const [docError, setDocError] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/inileg');
        const result = await response.json();
        if (result.success) {
          const unique: Iniciativa[] = Array.from(
            new Map<number, Iniciativa>(
              (result.data || []).map((i: Iniciativa) => [i.iniciativa_id, i])
            ).values()
          );

          const sorted = unique.sort((a, b) => {
            const getLeg = (exp: string) => {
              const match = exp.match(/\/(.+)$/);
              return match? match[1] : exp;
            };

            const legA = getLeg(a.expediente);
            const legB = getLeg(b.expediente);

            if (legA!== legB) return legB.localeCompare(legA);

            const dateA = a.fecha_entrega? new Date(a.fecha_entrega).getTime() : 0;
            const dateB = b.fecha_entrega? new Date(b.fecha_entrega).getTime() : 0;
            return dateB - dateA;
          });

          setIniciativas(sorted);
        } else {
          setError(result.error || 'Error al cargar los datos');
        }
      } catch (err) {
        setError(err instanceof Error? err.message : 'Error de conexión');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalPages = Math.ceil(iniciativas.length / ITEMS_PER_PAGE);
  const visibleIniciativas = iniciativas.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const changePage = useCallback((newPage: number) => {
    if (newPage === currentPage) return;
    setCurrentPage(newPage);
  }, [currentPage]);

  // Función ahora recibe la iniciativa como parámetro
  const handleVerDocumento = async (iniciativa: Iniciativa) => {
    setLoadingDocId(iniciativa.iniciativa_id);
    setDocError(null);

    try {
      if (!iniciativa.folio_id) {
        throw new Error('No hay folio ID disponible para esta iniciativa');
      }

      const doc = await getDocumentoSIAD(iniciativa.folio_id);

      if (doc?.file) {
        window.open(doc.file, '_blank');
      } else {
        const todos = await getTodosDocumentosSIAD(iniciativa.folio_id);
        if (todos.length > 0 && todos[0]?.file) {
          window.open(todos[0].file, '_blank');
        } else {
          throw new Error('No se encontró ningún documento disponible');
        }
      }
    } catch (error) {
      const msg = error instanceof Error? error.message : 'Error desconocido';
      setDocError(msg);
      alert(`Error al cargar el documento: ${msg}`);
    } finally {
      setLoadingDocId(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">

      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden bg-[#1a1a1a] dark:bg-inherit transition-colors duration-500">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,_rgba(255,255,255,0.18)_1px,_transparent_1px)] bg-[length:20px_20px] dark:hidden"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative py-24 flex flex-col items-center">
                <div className="absolute w-96 h-96 blur-3xl rounded-full"></div>
                <img
                  src="/inileg.png"
                  alt="INILEG"
                  className="w-64 md:w-80 lg:w-96 opacity-40 absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
                />
                <div className="relative z-10 space-y-3">
                  <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#C5AB81] via-[#e1c99f] to-[#C5AB81]">
                    INILEG
                  </h1>
                  <div className="w-24 h-[2px] bg-primary mx-auto rounded-full"></div>
                  <p className="text-lg md:text-xl text-gray-300 tracking-[0.25em] uppercase">
                    Instituto de Investigación Legislativa
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Iniciativas Section */}
      <section className="py-16 bg-gray-50 dark:bg-transparent transition-colors duration-500">
        <div className="container mx-auto px-4">

          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-blue-100">
              Iniciativas Legislativas
            </h2>
            <div className="w-20 h-1.5 bg-primary mx-auto mt-4 rounded-full"></div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando iniciativas...</p>
              </div>
            </div>
          )}

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

          {!loading &&!error && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleIniciativas.map((iniciativa) => {
                  const isLoadingDoc = loadingDocId === iniciativa.iniciativa_id;

                  return (
                    <motion.div
                      key={iniciativa.iniciativa_id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4 }}
                      className="bg-primary/5 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden"
                    >
                      <div className="h-79 bg-gray-200 dark:bg-gray-800 overflow-hidden">
                        <img
                          src={iniciativa.imagen_url}
                          alt={iniciativa.comunicado_titulo}
                          className="w-full h-full object-cover object-top hover:scale-105 transition duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = mounted && theme === 'dark'
                              ? '/logoCDGazul.png'
                              : '/LogoCDGblanco.png';
                          }}
                        />
                      </div>

                      <div className="p-5 flex flex-col flex-grow">
                        <div className="flex-grow">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-blue-100 line-clamp-2 mb-2 leading-tight">
                            {iniciativa.comunicado_titulo}
                          </h3>

                          <p className="text-sm text-gray-600 dark:text-blue-200/70 line-clamp-3 mb-4 leading-relaxed">
                            {iniciativa.resumen_corto || 'Sin descripción disponible'}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                              </svg>
                              {iniciativa.expediente}
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {iniciativa.fecha_entrega || 'Sin fecha'}
                            </span>
                          </div>
                        </div>

                        {/* Solo los 2 botones que ya tenías */}
                        <div className="flex flex-col gap-2.5 mt-2">
                          <Link href={`/expediente/${iniciativa.iniciativa_id}`}>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="w-full py-2.5 px-4 rounded-lg font-semibold text-sm 
                                        bg-[#C5AB81]/10 hover:bg-[#C5AB81]/15
                                        text-[#C5AB81] hover:text-[#b8985f]
                                        border border-[#C5AB81] hover:border-[#b8985f]
                                        transition-all duration-200 
                                        flex items-center justify-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Ver expediente
                            </motion.button>
                          </Link>

                          <motion.button
                            onClick={() => handleVerDocumento(iniciativa)}
                            disabled={isLoadingDoc}
                            whileHover={!isLoadingDoc? { scale: 1.02 } : {}}
                            whileTap={!isLoadingDoc? { scale: 0.98 } : {}}
                            className={`
                              w-full py-2.5 px-4 rounded-xl font-medium text-sm
                              transition-all duration-300
                              flex items-center justify-center gap-2
                              border
                              ${isLoadingDoc
                              ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500 cursor-not-allowed border-gray-200 dark:border-slate-700'
                                : 'bg-white dark:bg-slate-900/50 text-gray-700 dark:text-blue-100 hover:bg-gray-50 dark:hover:bg-slate-800 border-gray-300 dark:border-slate-700 hover:border-primary/40 hover:shadow-md'
                              }
                            `}
                          >
                            {isLoadingDoc? (
                              <>
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Cargando documento...
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Ver investigación / observaciones
                              </>
                            )}
                          </motion.button>

                          {docError && loadingDocId === iniciativa.iniciativa_id && (
                            <motion.p
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-xs text-red-500 dark:text-red-400 text-center flex items-center justify-center gap-1"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {docError}
                            </motion.p>
                          )}
                        </div>
                      </div>

                    </motion.div>
                  );
                })}
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex flex-col items-center gap-4 mt-12">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Página <span className="font-semibold text-gray-700 dark:text-gray-200">{currentPage}</span> de{' '}
                    <span className="font-semibold text-gray-700 dark:text-gray-200">{totalPages}</span>
                    {' '}·{' '}
                    <span className="font-semibold text-gray-700 dark:text-gray-200">{iniciativas.length}</span> iniciativas en total
                  </p>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => changePage(1)}
                      disabled={currentPage === 1}
                      className="h-9 w-9 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-primary hover:text-white hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      title="Primera página"
                    >
                      «
                    </button>

                    <button
                      onClick={() => changePage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="h-9 px-3 rounded-lg flex items-center gap-1 border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all font-medium"
                    >
                      ← Anterior
                    </button>

                    <div className="flex items-center gap-1 mx-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => {
                          if (totalPages <= 7) return true;
                          if (page === 1 || page === totalPages) return true;
                          if (Math.abs(page - currentPage) <= 1) return true;
                          return false;
                        })
                        .reduce<(number | 'ellipsis')[]>((acc, page, idx, arr) => {
                          if (idx > 0 && (page as number) - (arr[idx - 1] as number) > 1) {
                            acc.push('ellipsis');
                          }
                          acc.push(page);
                          return acc;
                        }, [])
                        .map((item, idx) =>
                          item === 'ellipsis'? (
                            <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
                              ···
                            </span>
                          ) : (
                            <motion.button
                              key={item}
                              onClick={() => changePage(item as number)}
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.88 }}
                              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors duration-150 ${
                                currentPage === item
                                  ? 'bg-primary text-white shadow-md shadow-primary/30'
                                  : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-primary/10 hover:text-primary hover:border-primary/40'
                              }`}
                            >
                              {item}
                            </motion.button>
                          )
                        )}
                    </div>

                    <button
                      onClick={() => changePage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="h-9 px-3 rounded-lg flex items-center gap-1 border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all font-medium"
                    >
                      Siguiente →
                    </button>

                    <button
                      onClick={() => changePage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="h-9 w-9 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-primary hover:text-white hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      title="Última página"
                    >
                      »
                    </button>
                  </div>

                  <div className="w-48 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      animate={{ width: `${(currentPage / totalPages) * 100}%` }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Sección SharePoint */}
          <section className="py-16 bg-gray-50 dark:bg-transparent transition-colors duration-500">
            <div className="container mx-auto px-4 max-w-7xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl transition-all duration-500 p-8 md:p-10"
              >
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 flex items-center justify-center">
                      <img
                        src={mounted && theme === 'dark'? '/CEPoscuro.png' : '/CEPblanco.png'}
                        alt="CEP"
                        className="w-36 h-36 object-contain"
                      />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-blue-100">
                        Repositorio Documental CEP
                      </h2>
                      <p className="mt-2 max-w-xl text-gray-600 dark:text-gray-400">
                        Consulta documentos, capítulos legislativos y recursos institucionales desde la plataforma documental.
                      </p>
                      <div className="flex gap-3 mt-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 dark:bg-primary/20 text-primary">Documentos</span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">CEP</span>
                      </div>
                    </div>
                  </div>

                  <Link href="/sharepoint">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-blue-100 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-blue-100"
                    >
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