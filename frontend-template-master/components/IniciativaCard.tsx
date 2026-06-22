'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { 
  getDocumentoSIAD,
  getTodosDocumentosSIAD,
  DocumentoSIAD 
} from '@/services/inilegClientService';

interface IniciativaCardProps {
  iniciativa: {
    iniciativa_id: number;
    expediente: string;
    comunicado_titulo: string;
    resumen_corto: string;
    imagen_url: string;
    folio_id: string;
    estatus: string;
    fecha_entrega: string;
  };
}

export function IniciativaCard({ iniciativa }: IniciativaCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerDocumento = async () => {
    setLoading(true);
    setError(null);
    
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
      setError(error instanceof Error ? error.message : 'Error desconocido');
      alert(`Error al cargar el documento: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerDetalle = () => {
    router.push(`/inileg/${iniciativa.iniciativa_id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {/* Imagen */}
      <div className="relative h-48 w-full bg-gray-100 flex-shrink-0">
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
        <div className="absolute top-3 right-3">
          <span className={`text-xs px-3 py-1 rounded-full shadow-md ${
            iniciativa.estatus === 'Rendida en tiempo' 
              ? 'bg-green-500 text-white'
              : iniciativa.estatus === 'Rendida de forma extemporánea'
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-500 text-white'
          }`}>
            {iniciativa.estatus}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2">
            {iniciativa.comunicado_titulo}
          </h3>

          <p className="text-gray-600 text-sm line-clamp-3 mb-3">
            {iniciativa.resumen_corto || 'Sin descripción disponible'}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <span className="font-medium">
              Expediente: {iniciativa.expediente}
            </span>
            <span className="text-xs">
              {iniciativa.fecha_entrega || 'Fecha no disponible'}
            </span>
          </div>
        </div>

        {/* ✅ Botones de acción con estilos explícitos */}
        <div className="flex flex-col gap-2 mt-2">
          {/* Botón principal: Ver investigación / observaciones */}
          <button
            onClick={handleVerDocumento}
            disabled={loading}
            className={`
              w-full py-2.5 px-4 rounded-lg font-medium text-sm 
              transition-all duration-200 
              flex items-center justify-center gap-2
              ${loading 
                ? 'bg-gray-400 text-white cursor-not-allowed opacity-70' 
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg active:scale-[0.98]'
              }
            `}
            style={{ backgroundColor: loading ? '#9ca3af' : '#C5AB81' }}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Cargando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Ver investigación / observaciones
              </>
            )}
          </button>
          
          {error && (
            <p className="text-xs text-red-600 text-center">{error}</p>
          )}

          {/* Botón secundario: Ver más información */}
          <button
            onClick={handleVerDetalle}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 border border-gray-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Ver más información
          </button>
        </div>
      </div>
    </div>
  );
}