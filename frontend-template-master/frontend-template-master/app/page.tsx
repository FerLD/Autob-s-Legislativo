'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';

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
  const [iniciativas, setIniciativas] = useState<Iniciativa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
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
          setIniciativas(unique);
        } else {
          setError(result.error || 'Error al cargar los datos');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error de conexión');
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

          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleIniciativas.map((iniciativa) => (
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

                    <div className="p-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        iniciativa.estatus === 'Rendida en tiempo'
                          ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                          : iniciativa.estatus === 'Rendida de forma extemporánea'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'
                          : 'bg-primary/10 dark:bg-primary/20 text-primary'
                      }`}>
                        {iniciativa.estatus}
                      </span>

                      <h3 className="mt-3 text-xl font-bold text-gray-900 dark:text-blue-100 line-clamp-2">
                        {iniciativa.comunicado_titulo}
                      </h3>

                      <p className="mt-2 text-gray-600 dark:text-gray-400 line-clamp-3">
                        {iniciativa.resumen_corto || 'Sin descripción disponible'}
                      </p>

                      <div className="flex gap-2 mt-3">
                        <span className="px-3 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                          {iniciativa.expediente}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                          {iniciativa.fecha_entrega || 'Sin fecha'}
                        </span>
                      </div>

                      <Link href={`/expediente/${iniciativa.iniciativa_id}`}>
                        <button className="mt-4 w-full py-2 rounded-lg bg-primary text-white hover:bg-primary-dark dark:bg-gray-800 dark:border dark:border-gray-700 dark:hover:bg-gray-700 transition font-semibold">
                          Ver expediente
                        </button>
                      </Link>
                    </div>
                  </motion.div>
                ))}
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

                    {/* « Primera */}
                    <button
                      onClick={() => changePage(1)}
                      disabled={currentPage === 1}
                      className="h-9 w-9 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-primary hover:text-white hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      title="Primera página"
                    >
                      «
                    </button>

                    {/* ← Anterior */}
                    <button
                      onClick={() => changePage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="h-9 px-3 rounded-lg flex items-center gap-1 border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all font-medium"
                    >
                      ← Anterior
                    </button>

                    {/* Números */}
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
                          item === 'ellipsis' ? (
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

                    {/* Siguiente → */}
                    <button
                      onClick={() => changePage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="h-9 px-3 rounded-lg flex items-center gap-1 border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all font-medium"
                    >
                      Siguiente →
                    </button>

                    {/* » Última */}
                    <button
                      onClick={() => changePage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="h-9 w-9 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-primary hover:text-white hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      title="Última página"
                    >
                      »
                    </button>
                  </div>

                  {/* Barra de progreso */}
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
                        src={mounted && theme === 'dark' ? '/CEPoscuro.png' : '/CEPblanco.png'}
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