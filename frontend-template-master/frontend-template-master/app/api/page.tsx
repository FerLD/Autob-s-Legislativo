'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, FileText, Building2, Hash, Clock } from 'lucide-react';
import { getDocumentoSIAD, getTodosDocumentosSIAD } from '@/services/inilegClientService';

interface IniciativaDetalle {
  iniciativa_id: number;
  expediente: string;
  objeto: string;
  iniciativa_descripcion: string;
  fecha_presentacion_pleno: string | null;
  metodologia_id: number;
  fecha_metodologia: string;
  no_metodologia: number;
  opinion_id: number;
  institucion: string;
  fecha_limite: string;
  correspondencia_id: number;
  folio_id: string;
  extracto: string;
  fecha_entrega: string;
  comunicado_id: number;
  comunicado_titulo: string;
  comunicado_resumen: string;
  comunicado_imagen: string;
  comunicado_fecha: string;
  imagen_url: string;
  estatus: string;
}

export default function IniciativaDetallePage() {
  const params = useParams();
  const router = useRouter();
  const [iniciativa, setIniciativa] = useState<IniciativaDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingDoc, setLoadingDoc] = useState(false);

  useEffect(() => {
    async function fetchDetalle() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/inileg/${params.id}`);
        const result = await response.json();
        if (result.success) {
          setIniciativa(result.data);
        } else {
          setError(result.error || 'No se encontró la iniciativa');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error de conexión');
      } finally {
        setLoading(false);
      }
    }
    if (params.id) fetchDetalle();
  }, [params.id]);

  const handleVerDocumento = async () => {
    if (!iniciativa?.folio_id) return;
    setLoadingDoc(true);
    try {
      const doc = await getDocumentoSIAD(iniciativa.folio_id);
      if (doc?.file) {
        window.open(doc.file, '_blank');
      } else {
        const todos = await getTodosDocumentosSIAD(iniciativa.folio_id);
        if (todos.length > 0 && todos[0]?.file) {
          window.open(todos[0].file, '_blank');
        } else {
          alert('No se encontró ningún documento disponible');
        }
      }
    } catch (err) {
      alert('Error al cargar el documento');
    } finally {
      setLoadingDoc(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando iniciativa...</p>
        </div>
      </div>
    );
  }

  if (error || !iniciativa) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <p className="text-red-600 text-xl font-semibold">{error || 'No se encontró la iniciativa'}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

      {/* Hero con imagen */}
      <div className="relative h-72 md:h-96 w-full overflow-hidden">
        <img
          src={iniciativa.imagen_url}
          alt={iniciativa.comunicado_titulo}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/LogoCDGblanco.png';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Botón volver */}
        <button
          onClick={() => router.back()}
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition border border-white/20"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>

        {/* Badge estatus */}
        <div className="absolute top-6 right-6">
          <span className={`px-4 py-1.5 rounded-full text-sm font-medium shadow-lg ${
            iniciativa.estatus === 'Rendida en tiempo'
              ? 'bg-green-500 text-white'
              : iniciativa.estatus === 'Rendida de forma extemporánea'
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-500 text-white'
          }`}>
            {iniciativa.estatus}
          </span>
        </div>

        {/* Título sobre imagen */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-4xl font-bold text-white leading-tight max-w-4xl"
          >
            {iniciativa.comunicado_titulo}
          </motion.h1>
          <p className="text-white/70 mt-2 text-sm">
            Expediente: {iniciativa.expediente}
          </p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">

            {/* Resumen */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Resumen
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {iniciativa.comunicado_resumen || iniciativa.iniciativa_descripcion || 'Sin descripción disponible'}
              </p>
            </motion.div>

            {/* Objeto de la iniciativa */}
            {iniciativa.objeto && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Hash className="w-5 h-5 text-primary" />
                  Objeto de la iniciativa
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {iniciativa.objeto}
                </p>
              </motion.div>
            )}

            {/* Extracto */}
            {iniciativa.extracto && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Extracto de correspondencia
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                  {iniciativa.extracto}
                </p>
              </motion.div>
            )}
          </div>

          {/* Columna lateral */}
          <div className="space-y-4">

            {/* Botón ver documento */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              onClick={handleVerDocumento}
              disabled={loadingDoc}
              className="w-full py-3 px-4 rounded-xl font-medium text-white transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98]"
              style={{ backgroundColor: '#C5AB81' }}
            >
              {loadingDoc ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Cargando...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Ver investigación / observaciones
                </>
              )}
            </motion.button>

            {/* Datos clave */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4"
            >
              <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider">
                Datos del expediente
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Hash className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Expediente</p>
                    <p className="text-gray-900 dark:text-white font-medium">{iniciativa.expediente}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Fecha de presentación</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {iniciativa.fecha_presentacion_pleno || 'No disponible'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Fecha límite</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {iniciativa.fecha_limite || 'No disponible'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Fecha de entrega</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {iniciativa.fecha_entrega || 'No disponible'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Institución</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {iniciativa.institucion || 'No disponible'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Hash className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">No. de metodología</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {iniciativa.no_metodologia || 'No disponible'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}