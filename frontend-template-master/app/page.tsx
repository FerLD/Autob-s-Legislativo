'use client';

import { useEffect, useState } from 'react';
import { IniciativaCard } from '@/components/IniciativaCard';

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
  const [iniciativas, setIniciativas] = useState<Iniciativa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Cargando listado de iniciativas...');
        
        const response = await fetch('/api/inileg');
        const result = await response.json();
        
        console.log('Respuesta del listado:', result);
        
        if (result.success) {
          setIniciativas(result.data || []);
        } else {
          setError(result.error || 'Error al cargar los datos');
        }
      } catch (err) {
        console.error('Error al cargar listado:', err);
        setError(err instanceof Error ? err.message : 'Error de conexión');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredIniciativas = iniciativas.filter(init =>
    init.comunicado_titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    init.expediente?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando iniciativas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <p className="text-red-600 text-xl font-semibold">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Instituto de Investigaciones Legislativas
          </h1>
          <p className="text-xl text-gray-600">
            Documentos y opiniones del INILEG
          </p>
          <div className="mt-2 text-sm text-gray-500">
            {filteredIniciativas.length} iniciativas encontradas
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder="Buscar por título o expediente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Grid de tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIniciativas.map((iniciativa, index) => (
            // ✅ Usar combinación de ID + índice + timestamp para key única
            <IniciativaCard 
              key={`${iniciativa.iniciativa_id}-${index}-${Date.now()}`} 
              iniciativa={iniciativa} 
            />
          ))}
        </div>

        {filteredIniciativas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No se encontraron iniciativas con documentos del INILEG
            </p>
          </div>
        )}
      </div>
    </main>
  );
}