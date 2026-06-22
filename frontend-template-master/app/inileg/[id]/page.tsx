'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  getTodosDocumentosSIAD,
  contieneOFCIIL,
  getNombreArchivo,
  DocumentoSIAD 
} from '@/services/inilegClientService';

interface IniciativaDetalle {
  iniciativa_id: number;
  expediente: string;
  objeto: string;
  iniciativa_descripcion: string;
  fecha_presentacion_pleno: string;
  comunicado_titulo: string;
  comunicado_resumen: string;
  comunicado_imagen: string;
  imagen_url: string;
  folio_id: string;
  estatus: string;
  fecha_entrega: string;
  institucion: string;
  fecha_limite: string;
  fecha_metodologia: string;
}

export default function IniciativaDetallePage() {
  const params = useParams();
  const router = useRouter();
  
  // ✅ Obtener el ID de manera segura
  const id = params?.id as string;
  
  const [iniciativa, setIniciativa] = useState<IniciativaDetalle | null>(null);
  const [documentos, setDocumentos] = useState<DocumentoSIAD[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [descripcionVisible, setDescripcionVisible] = useState<number | null>(null);

  useEffect(() => {
    // ✅ Verificar que el ID existe antes de hacer la petición
    if (!id) {
      setError('ID de iniciativa no proporcionado');
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Cargando iniciativa con ID:', id);
        
        // 1. Obtener los datos de la iniciativa desde la API
        const response = await fetch(`/api/inileg/${id}`);
        
        console.log('Respuesta de la API - Status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('Datos recibidos:', result);
        
        if (!result.success) {
          throw new Error(result.error || 'Error al cargar los datos');
        }
        
        if (!result.data) {
          throw new Error('No se encontró la iniciativa');
        }
        
        setIniciativa(result.data);
        
        // 2. Obtener los documentos de SIAD
        if (result.data?.folio_id) {
          console.log('Obteniendo documentos para folio:', result.data.folio_id);
          const docs = await getTodosDocumentosSIAD(result.data.folio_id);
          console.log('Documentos obtenidos:', docs.length);
          setDocumentos(docs);
        } else {
          console.warn('La iniciativa no tiene folio_id');
        }
        
      } catch (err) {
        console.error('Error detallado:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleVolver = () => {
    router.push('/');
  };

  const toggleDescripcion = (index: number) => {
    setDescripcionVisible(descripcionVisible === index ? null : index);
  };

  // ✅ Mostrar error si no hay ID o hay error
  if (error || !id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <p className="text-red-600 text-xl font-semibold">
            Error: {error || 'ID de iniciativa no proporcionado'}
          </p>
          <p className="text-gray-500 mt-2 text-sm">
            {id ? `ID: ${id}` : 'No se recibió ningún ID'}
          </p>
          <button 
            onClick={handleVolver}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Volver al listado
          </button>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 ml-2 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando iniciativa...</p>
        </div>
      </div>
    );
  }

  if (!iniciativa) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">No se encontró la iniciativa</p>
          <button 
            onClick={handleVolver}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Volver al listado
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Botón volver */}
        <button
          onClick={handleVolver}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al listado
        </button>

        {/* Header de la iniciativa */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          {/* Imagen destacada */}
          <div className="relative h-64 w-full bg-gray-100">
            {iniciativa.imagen_url ? (
              <img
                src={iniciativa.imagen_url}
                alt={iniciativa.comunicado_titulo}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-image.png';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                Sin imagen
              </div>
            )}
          </div>

          {/* Contenido */}
          <div className="p-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {iniciativa.comunicado_titulo}
                </h1>
                <p className="text-gray-600 text-sm">
                  Expediente: <span className="font-medium">{iniciativa.expediente}</span>
                </p>
              </div>
              <span className={`text-sm px-3 py-1 rounded-full ${
                iniciativa.estatus === 'Rendida en tiempo' 
                  ? 'bg-green-100 text-green-800'
                  : iniciativa.estatus === 'Rendida de forma extemporánea'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {iniciativa.estatus}
              </span>
            </div>

            {/* Información adicional */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Institución</p>
                <p className="font-medium">{iniciativa.institucion}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha de entrega</p>
                <p className="font-medium">{iniciativa.fecha_entrega}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha límite</p>
                <p className="font-medium">{iniciativa.fecha_limite}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha de metodología</p>
                <p className="font-medium">{iniciativa.fecha_metodologia}</p>
              </div>
            </div>

            {/* Descripción */}
            {iniciativa.iniciativa_descripcion && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
                <p className="text-gray-700 leading-relaxed">
                  {iniciativa.iniciativa_descripcion}
                </p>
              </div>
            )}

            {/* Resumen del comunicado */}
            {iniciativa.comunicado_resumen && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Resumen</h3>
                <div 
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: iniciativa.comunicado_resumen }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Sección de documentos */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Documentos de INILEG
              </h2>
              <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {documentos.length} documentos
              </span>
            </div>
          </div>

          <div className="p-6">
            {documentos.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No hay documentos disponibles para esta iniciativa
              </p>
            ) : (
              <div className="space-y-4">
                {documentos.map((doc, index) => {
                  const esOFCIIL = contieneOFCIIL(doc);
                  const nombreArchivo = getNombreArchivo(doc.file);
                  const key = `doc-${index}-${doc.file?.substring(0, 20) || 'unknown'}`;
                  
                  return (
                    <div 
                      key={key}
                      className={`p-4 rounded-lg border ${
                        esOFCIIL 
                          ? 'border-blue-300 bg-blue-50 hover:bg-blue-100' 
                          : 'border-gray-200 hover:bg-gray-50'
                      } transition-colors`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {nombreArchivo}
                            </p>
                            {esOFCIIL && (
                              <span className="flex-shrink-0 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                                OFCIIL ✓
                              </span>
                            )}
                          </div>
                          
                          <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                            {doc.folio_legislatura && (
                              <span>Folio: {doc.folio_legislatura}</span>
                            )}
                            {doc.fecha && (
                              <span>Fecha: {doc.fecha}</span>
                            )}
                            {doc.clave && (
                              <span>Clave: {doc.clave}</span>
                            )}
                          </div>

                          {doc.serie && (
                            <p className="mt-1 text-xs text-gray-500">
                              Serie: {doc.serie}
                            </p>
                          )}

                          {doc.asunto && (
                            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                              {doc.asunto}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <a
                            href={doc.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                              esOFCIIL 
                                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {esOFCIIL ? '⭐ Ver OFCIIL' : 'Ver documento'}
                          </a>
                          
                          {doc.descripcion && (
                            <button
                              onClick={() => toggleDescripcion(index)}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              {descripcionVisible === index ? 'Ocultar descripción' : 'Ver descripción completa'}
                            </button>
                          )}
                        </div>
                      </div>

                      {doc.descripcion && descripcionVisible === index && (
                        <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                          <div 
                            className="text-sm text-gray-600 prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: doc.descripcion }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-500">
            Documentos obtenidos del sistema SIAD · Instituto de Investigaciones Legislativas
          </div>
        </div>
      </div>
    </main>
  );
}