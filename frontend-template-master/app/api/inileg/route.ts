import { NextResponse } from 'next/server';
import { getIniciativasINILEG } from '@/services/inilegService';

// ✅ CORRECTO: Exportar GET como función nombrada
export async function GET() {
  try {
    const iniciativas = await getIniciativasINILEG();
    
    const data = iniciativas.map(init => ({
      ...init,
      imagen_url: `https://congreso-gto.s3.amazonaws.com/uploads/comunicado/imagen/${init.comunicado_id}/${init.comunicado_imagen}`,
      resumen_corto: init.iniciativa_descripcion?.substring(0, 150) + '...',
      folio_id: init.folio_id
    }));
    
    return NextResponse.json({ 
      success: true, 
      data,
      total: data.length 
    });
    
  } catch (error) {
    console.error('Error en API route:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener datos' },
      { status: 500 }
    );
  }
}