'use client';

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
    
    if (Array.isArray(data)) {
      const documentoFiltrado = data.find((doc: any) => {
        return doc?.file && typeof doc.file === 'string' && doc.file.includes('OFCIIL');
      });
      return documentoFiltrado || null;
    }
    
    if (data && data.file && typeof data.file === 'string' && data.file.includes('OFCIIL')) {
      return data;
    }
    
    return null;
  } catch (error) {
    console.error('Error al obtener documento SIAD:', error);
    return null;
  }
}

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
    
    if (Array.isArray(data)) {
      return data;
    }
    
    if (data && data.file) {
      return [data];
    }
    
    return [];
  } catch (error) {
    console.error('Error al obtener documentos SIAD:', error);
    return [];
  }
}

export function contieneOFCIIL(documento: DocumentoSIAD): boolean {
  if (!documento || !documento.file) return false;
  return typeof documento.file === 'string' && 
    (documento.file.includes('OFCIIL') || documento.file.includes('IIL'));
}

export function getNombreArchivo(fileUrl: string): string {
  if (!fileUrl) return 'Sin nombre';
  try {
    return fileUrl.split('/').pop() || 'Sin nombre';
  } catch {
    return 'Sin nombre';
  }
}