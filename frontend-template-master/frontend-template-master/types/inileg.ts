export interface IniciativaINILEG {
  iniciativa_id: number;
  expediente: string;
  objeto: string;
  iniciativa_descripcion: string;
  fecha_presentacion_pleno: Date | null;
  
  metodologia_id: number;
  fecha_metodologia: Date;
  no_metodologia: number;
  
  opinion_id: number;
  institucion: string;
  fecha_limite: Date;
  
  correspondencia_id: number;
  folio_id: string;
  extracto: string;
  fecha_entrega: Date;
  
  comunicado_id: number;
  comunicado_titulo: string;
  comunicado_resumen: string;
  comunicado_imagen: string;
  comunicado_fecha: Date;
  
  estatus: string;
}

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

export function esDocumentoSIAD(valor: any): valor is DocumentoSIAD {
  return valor && typeof valor === 'object' && typeof valor.file === 'string';
}