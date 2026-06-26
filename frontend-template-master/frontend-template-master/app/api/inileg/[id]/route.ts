import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    console.log('🔍 Buscando iniciativa con ID:', id);
    
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { success: false, error: 'ID de iniciativa inválido' },
        { status: 400 }
      );
    }
    
    const CONSULTA_DETALLE = `
      SELECT DISTINCT ON (com.id)
          i.id AS iniciativa_id,
          i.expediente,
          i.objeto,
          i.descripcion AS iniciativa_descripcion,
          i.fecha_presentacion_pleno,
          
          m.id AS metodologia_id,
          m.fecha_metodologia,
          m.no_metodologia,
          
          om.id AS opinion_id,
          om.descripcion AS institucion,
          om.fecha_limite,
          
          c.id AS correspondencia_id,
          c.folio_id,
          c.extracto,
          c.fecha AS fecha_entrega,
          comi.nombre AS nombre_comision,
          
          com.id AS comunicado_id,
          com.titulo AS comunicado_titulo,
          com.resumen AS comunicado_resumen,
          com.imagen AS comunicado_imagen,
          com.created_at AS comunicado_fecha,
          
          CASE 
              WHEN c.fecha_limite <= om.fecha_limite THEN 'Rendida en tiempo'
              WHEN c.fecha_limite > om.fecha_limite THEN 'Rendida de forma extemporánea'
              WHEN c.id IS NULL AND om.fecha_limite >= CURRENT_DATE THEN 'En espera'
              WHEN c.id IS NULL AND om.fecha_limite < CURRENT_DATE THEN 'No rendida'
              ELSE 'Por determinar'
          END AS estatus
          
      FROM iniciativas i
      INNER JOIN metodologias m ON m.iniciativa_id = i.id
      INNER JOIN opinion_metodologias om ON om.metodologia_id = m.id
      INNER JOIN correspondencias c ON c.opinion_metodologia_id = om.id
      LEFT JOIN comisiones comi ON c.comision_id = comi.id
      INNER JOIN comunicados com ON com.iniciativa_id = i.id
      WHERE 
          i.id = $1
          AND c.extracto ILIKE '%Instituto de Investigaciones Legislativas%'
          AND com.titulo IS NOT NULL 
          AND com.titulo != ''
          AND com.imagen IS NOT NULL 
          AND com.imagen != ''
          AND c.folio_id IS NOT NULL
          AND c.folio_id != ''
      ORDER BY com.id, com.created_at DESC
      LIMIT 1;
    `;
    
    const result = await query(CONSULTA_DETALLE, [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `No se encontró la iniciativa con ID ${id}`,
        },
        { status: 404 }
      );
    }
    
    const init = result.rows[0];
    
    const data = {
      ...init,
      imagen_url: `https://congreso-gto.s3.amazonaws.com/uploads/comunicado/imagen/${init.comunicado_id}/${init.comunicado_imagen}`,
      fecha_presentacion_pleno: init.fecha_presentacion_pleno?.toISOString?.()?.split('T')[0] || null,
      fecha_metodologia: init.fecha_metodologia?.toISOString?.()?.split('T')[0] || null,
      fecha_limite: init.fecha_limite?.toISOString?.()?.split('T')[0] || null,
      fecha_entrega: init.fecha_entrega?.toISOString?.()?.split('T')[0] || null,
    };
    
    return NextResponse.json({ 
      success: true, 
      data
    });
    
  } catch (error) {
    console.error('❌ Error en API route de detalle:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al obtener la iniciativa',
      },
      { status: 500 }
    );
  }
}