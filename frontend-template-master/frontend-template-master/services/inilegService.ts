'use server';

import { query } from '@/lib/db';
import { IniciativaINILEG } from '@/types/inileg';

const CONSULTA_INILEG = `
  SELECT DISTINCT ON (iniciativa_id) *
FROM (
    SELECT
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
        comi.nombre as nombre_comision, 

        com.id AS comunicado_id,
        com.titulo AS comunicado_titulo,
        com.resumen AS comunicado_resumen,
        com.imagen AS comunicado_imagen,
        com.created_at AS comunicado_fecha,

        CASE
            WHEN c.fecha <= om.fecha_limite THEN 'Rendida en tiempo'
            WHEN c.fecha > om.fecha_limite THEN 'Rendida de forma extemporánea'
            WHEN c.id IS NULL AND om.fecha_limite >= CURRENT_DATE THEN 'En espera'
            WHEN c.id IS NULL AND om.fecha_limite < CURRENT_DATE THEN 'No rendida'
            ELSE 'Por determinar'
        END AS estatus

    FROM iniciativas i
    INNER JOIN metodologias m
        ON m.iniciativa_id = i.id
    INNER JOIN opinion_metodologias om
        ON om.metodologia_id = m.id
    INNER JOIN correspondencias c
        ON c.opinion_metodologia_id = om.id
    INNER JOIN comunicados com
        ON com.iniciativa_id = i.id
    inner join comisiones comi
    	on c.comision_id  = comi.id

    WHERE
        c.extracto ILIKE '%Instituto de Investigaciones Legislativas%'
        AND com.titulo IS NOT NULL
        AND com.titulo <> ''
        AND com.imagen IS NOT NULL
        AND com.imagen <> ''
        AND c.folio_id IS NOT NULL
        AND c.folio_id <> ''
) t
ORDER BY iniciativa_id, comunicado_fecha DESC;
`;

export async function getIniciativasINILEG(): Promise<IniciativaINILEG[]> {
  try {
    console.log('📊 Ejecutando consulta con DISTINCT ON...');
    const result = await query(CONSULTA_INILEG);
    console.log('✅ Registros únicos obtenidos:', result.rows.length);
    return result.rows;
  } catch (error) {
    console.error('❌ Error al obtener iniciativas INILEG:', error);
    return [];
  }
}