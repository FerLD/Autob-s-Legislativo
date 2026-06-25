// Este archivo solo contiene funciones que se ejecutan en el cliente
// NO importa 'pg' ni 'db'

export interface DocumentoSIAD {
  id?: string;
  folio_legislatura?: string;
  asunto?: string;
  descripcion?: string;
  fecha?: string;
  serie?: string;
  clave?: string;
  file: string;
}

// Función para obtener documento de la API de SIAD y filtrar por 'OFCIIL'
export async function getDocumentoSIAD(folioId: string): Promise<DocumentoSIAD | null> {
  try {
    const response = await fetch(
      `https://siad.congresogto.gob.mx/ApiNetDev/api/values/GetByFolioLeg?folio=${folioId}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Error en API SIAD: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Si la respuesta es un array, filtrar por 'OFCIIL'
    if (Array.isArray(data)) {
      const documentoFiltrado = data.find((doc: any) => {
        return doc?.file && typeof doc.file === 'string' && doc.file.includes('OFCIIL');
      });
      return documentoFiltrado || null;
    }
    
    // Si es un objeto único, verificar si contiene 'OFCIIL'
    if (data && data.file && typeof data.file === 'string' && data.file.includes('OFCIIL')) {
      return data;
    }
    
    return null;
  } catch (error) {
    console.error('Error al obtener documento SIAD:', error);
    return null;
  }
}

// Función para obtener TODOS los documentos de la API (sin filtrar)
export async function getTodosDocumentosSIAD(folioId: string): Promise<DocumentoSIAD[]> {
  try {
    const response = await fetch(
      `https://siad.congresogto.gob.mx/ApiNetDev/api/values/GetByFolioLeg?folio=${folioId}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Error en API SIAD: ${response.status}`);
    }
    
    const data = await response.json();
    
    // ✅ Asegurar que siempre devuelve un array
    if (Array.isArray(data)) {
      return data;
    }
    
    // Si es un objeto único, convertirlo a array
    if (data && data.file) {
      return [data];
    }
    
    return [];
  } catch (error) {
    console.error('Error al obtener documentos SIAD:', error);
    return [];
  }
}
// Función para verificar si un documento contiene 'OFCIIL'
export function contieneOFCIIL(documento: DocumentoSIAD): boolean {
  if (!documento || !documento.file) {
    return false;
  }
  return typeof documento.file === 'string' && documento.file.includes('OFCIIL') || documento.file.includes('IIL');
}

// Función para obtener el nombre del archivo de una URL
export function getNombreArchivo(fileUrl: string): string {
  if (!fileUrl) return 'Sin nombre';
  try {
    return fileUrl.split('/').pop() || 'Sin nombre';
  } catch {
    return 'Sin nombre';
  }
}