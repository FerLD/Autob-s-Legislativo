'use client';

import { motion } from 'framer-motion';
import { Folder, Scale, BookOpen, Inbox, ScrollText, Landmark, FileText, User } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  getTodosDocumentosSIAD,
  contieneOFCIIL,
  getNombreArchivo,
  DocumentoSIAD 
} from '@/services/inilegClientService';

interface IniciativaCompleta {
  iniciativa_id: number;
  expediente: string;
  comunicado_titulo: string;
  resumen_corto: string;
  resumen_ciudadano: string | null;
  imagen_url: string;
  folio_id: string;
  estatus: string;
  fecha_entrega: string;
  tipo_tramite: string | null;
  objetivo: string | null;
  presento: string | null;
  descripcion_ciudadana: string | null;
  fecha_limite_dictamen: string | null;
  iniciante: string;
  legislatura: string;
  grupos_parlamentarios: { nombre: string; logo: string }[];
  diputados: { nombre: string; foto: string | null }[];
  pasos_seguimiento: string[];
  documentos: { nombre: string; url: string }[];
  // Extras del API
  objeto?: string;
  iniciativa_descripcion?: string;
  institucion?: string;
  fecha_limite?: string;
  fecha_metodologia?: string;
  comunicado_resumen?: string;
  fecha_presentacion_pleno?: string;
}

// FUNCIONES AYUDANTES
function simplificarDescripcion(texto: string | null, titulo?: string): string {
  if (!texto &&!titulo) return 'Esta es una propuesta que presentaron los diputados para mejorar una ley del estado.';

  const textoCompleto = `${titulo || ''} ${texto || ''}`.toLowerCase();
  
  let tema = '';
  let accion = 'modificar';
  let paraQue = '';

  if (textoCompleto.includes('hacienda') && textoCompleto.includes('fiscalización')) {
    tema = 'cómo se organiza el Congreso para revisar el dinero del estado';
    accion = 'dividir';
    paraQue = 'que cada tema tenga gente más especializada';
  } else if (textoCompleto.includes('educación')) {
    tema = 'la educación en el estado';
    paraQue = 'mejorar las escuelas o apoyar a los estudiantes';
  } else if (textoCompleto.includes('salud')) {
    tema = 'los servicios de salud';
    paraQue = 'que tengamos mejor atención médica';
  } else if (textoCompleto.includes('seguridad')) {
    tema = 'la seguridad pública';
    paraQue = 'que estemos más seguros';
  } else if (textoCompleto.includes('impuesto')) {
    tema = 'los impuestos que pagamos';
    paraQue = 'cambiar cuánto o cómo se cobra';
  }

  if (textoCompleto.includes('crear')) accion = 'crear';
  else if (textoCompleto.includes('reform')) accion = 'cambiar';
  else if (textoCompleto.includes('adicion')) accion = 'agregar reglas a';
  else if (textoCompleto.includes('derog')) accion = 'eliminar';

  if (tema) {
    return `Esta propuesta busca ${accion} ${tema} ${paraQue? 'para ' + paraQue : ''}.`;
  }

  const diccionario: Record<string, string> = {
    'iniciativa suscrita por': 'propuesta presentada por',
    'reforma y adición de diversas disposiciones': 'cambios y agregados a',
    'ley orgánica del poder legislativo': 'reglas de cómo funciona el Congreso',
    'ley de fiscalización superior': 'ley que revisa en qué se gasta el dinero público',
    'fracción iii del artículo': 'parte 3 del artículo',
    'competencia de la actual': 'trabajo que hace la actual',
    'su meta es': 'lo que busca es',
  };

  let textoSimple = texto || titulo || '';
  Object.keys(diccionario).forEach(palabra => {
    textoSimple = textoSimple.replace(new RegExp(palabra, 'gi'), diccionario[palabra]);
  });

  const frases = textoSimple.split('.').filter(f => f.trim().length > 10);
  return frases.slice(0, 2).join('. ') + '.';
}

function traducirEstatus(estatus: string): string {
  const mapa: Record<string, string> = {
    'Por determinar': 'En revisión',
    'Turnada a comisión': 'La están estudiando los diputados',
    'Aprobada': 'Ya fue aceptada',
    'Desechada': 'No fue aceptada',
    'Rendida en tiempo': 'Entregada a tiempo',
    'Rendida de forma extemporánea': 'Entregada fuera de tiempo',
  };
  return mapa[estatus] || estatus || 'En proceso';
}

function simplificarObjetivo(texto: string | null): string {
  if (!texto) return 'Hacer cambios para mejorar este tema';
  const t = texto.toLowerCase();
  if (t.includes('comisiones')) return 'Reorganizar cómo trabajan los diputados en comisiones';
  if (t.includes('recurso') || t.includes('presupuesto')) return 'Cambiar cómo se usa el dinero público';
  if (t.includes('derecho')) return 'Garantizar un derecho para los ciudadanos';
  return 'Mejorar las reglas actuales sobre este tema';
}

export default function ExpedientePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  
  const [data, setData] = useState<IniciativaCompleta | null>(null);
  const [documentos, setDocumentos] = useState<DocumentoSIAD[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [descripcionVisible, setDescripcionVisible] = useState<number | null>(null);

  useEffect(() => {
    if (!id) {
      setError('ID de iniciativa no proporcionado');
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/inileg/${id}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Error ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success || !result.data) {
          throw new Error(result.error || 'No se encontró la iniciativa');
        }
        
        const dataAPI = result.data;
        
        const dataProcesada: IniciativaCompleta = {
         ...dataAPI,
          resumen_ciudadano: dataAPI.resumen_ciudadano || 
            simplificarDescripcion(
              dataAPI.iniciativa_descripcion || dataAPI.resumen_corto || dataAPI.objetivo, 
              dataAPI.comunicado_titulo
            ),
          tipo_tramite: dataAPI.tipo_tramite || 'Iniciativa de ley',
          presento: dataAPI.presento || 
            dataAPI.grupos_parlamentarios?.[0]?.nombre || 
            dataAPI.iniciante || 
            'Varios diputados',
          estatus: traducirEstatus(dataAPI.estatus),
          objetivo: dataAPI.objetivo || 
            simplificarObjetivo(dataAPI.iniciativa_descripcion || dataAPI.resumen_corto),
          descripcion_ciudadana: dataAPI.descripcion_ciudadana || 
            dataAPI.resumen_corto || 
            'Propuesta para mejorar una ley del estado',
          grupos_parlamentarios: dataAPI.grupos_parlamentarios || [],
          diputados: dataAPI.diputados || [],
          pasos_seguimiento: dataAPI.pasos_seguimiento || [],
        };
        
        setData(dataProcesada);
        
        if (dataAPI?.folio_id) {
          const docs = await getTodosDocumentosSIAD(dataAPI.folio_id);
          setDocumentos(docs);
        }
        
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const secciones = [
    { id: "resumen", titulo: "Resumen", icono: Folder },
    { id: "propuesta", titulo: "Propuesta", icono: BookOpen },
    { id: "seguimiento", titulo: "Seguimiento", icono: Inbox },
    { id: "sesiones", titulo: "Sesiones", icono: Scale },
    { id: "documentos", titulo: "Documentos", icono: FileText },
    { id: "tecnico", titulo: "Información técnica", icono: Landmark }
  ];

  const scrollToSection = (id: string) => {
    const elemento = document.getElementById(id);
    if (elemento) {
      const yOffset = -160; 
      const y = elemento.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  function Card({ children }: any) {
    return (
      <div className="flex justify-center mb-6">
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="w-full max-w-9xl min-h-[12rem] bg-primary/5 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all p-8">
          {children}
        </motion.div>
      </div>
    );
  }

  function IconBox({ children }: any) {
    return (
      <div className="w-20 h-20 bg-primary rounded-xl flex items-center justify-center mb-6 text-white">
        {children}
      </div>
    );
  }

  function Info({ t, d }: { t: string; d: string }) {
    return (
      <div>
        <p className="text-sm text-gray-500">{t}</p>
        <p className="font-semibold text-gray-800 dark:text-gray-200 mt-1">{d}</p>
      </div>
    );
  }

  function Step({ text }: { text: string }) {
    return (
      <div className="flex gap-4 items-center">
        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">✓</div>
        <p className="text-gray-700 dark:text-gray-300 font-medium">{text}</p>
      </div>
    );
  }

  const toggleDescripcion = (index: number) => {
    setDescripcionVisible(descripcionVisible === index ? null : index);
  };

  const handleVolver = () => {
    router.push('/');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  if (error ||!data) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="text-red-600 text-5xl mb-4">⚠</div>
        <p className="text-red-600 text-xl font-semibold">{error || 'Expediente no encontrado'}</p>
        <button 
          onClick={handleVolver}
          className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors"
        >
          Volver al listado
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-transparent transition-colors duration-500">        
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        
        {/* TITULO */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-blue-100">Expediente Legislativo Digital</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Consulta información legislativa explicada de forma sencilla.</p>
        </motion.div>

        {/* MENÚ STICKY */}
        <div className="sticky top-20 z-20 rounded-2xl border border-gray-200 bg-white/80 p-4 mb-8 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
          <div className="flex flex-wrap gap-3">
            {secciones.map((sec) => {
              const Icono = sec.icono;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all bg-gray-100 dark:bg-gray-800 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20"
                >
                  <Icono size={18} />
                  {sec.titulo} 
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= RESUMEN ================= */}
        <div id="resumen">
          <Card>
            <IconBox><Folder size={35} /></IconBox>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-blue-100">{data.comunicado_titulo}</h3>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-lg">{data.resumen_corto}</p>

            <div className="flex flex-wrap gap-3 mt-6">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                data.estatus === 'Rendida en tiempo' || data.estatus === 'Entregada a tiempo'
               ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                : data.estatus === 'Rendida de forma extemporánea' || data.estatus === 'Entregada fuera de tiempo'
               ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                : 'bg-primary/10 dark:bg-primary/20 text-primary'
              }`}>● {data.estatus}</span>
              <span className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm">Expediente {data.expediente}</span>
            </div>

            <div className="mt-10 p-6 rounded-2xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800">
              <h4 className="text-xl font-bold text-gray-900 dark:text-blue-100 mb-3">¿Qué significa este expediente?</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{data.resumen_ciudadano}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="p-5 rounded-xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-500">¿Qué tipo de trámite es?</p>
                <p className="font-semibold text-gray-800 dark:text-gray-200 mt-1">{data.tipo_tramite}</p>
              </div>
              <div className="p-5 rounded-xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-500">¿Quién presentó la propuesta?</p>
                <p className="font-semibold text-gray-800 dark:text-gray-200 mt-1">{data.presento}</p>
              </div>
              <div className="p-5 rounded-xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-500">Fecha en que fue recibida</p>
                <p className="font-semibold text-gray-800 dark:text-gray-200 mt-1">{data.fecha_entrega}</p>
              </div>
              <div className="p-5 rounded-xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-500">Folio</p>
                <p className="font-semibold text-gray-800 dark:text-gray-200 mt-1">{data.folio_id}</p>
              </div>
            </div>

            {data.imagen_url && (
              <div className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-8 flex justify-center">
                <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 shadow-md group w-full max-w-xl">
                  <img src={data.imagen_url} alt={data.comunicado_titulo} className="w-full aspect-[16/10] object-cover transition duration-500 group-hover:scale-105" />
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* ================= PROPUESTA ================= */}
        <div id="propuesta">
          <Card>
            <IconBox><BookOpen size={35} /></IconBox>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-blue-100">Sobre la propuesta</h3>
            <p className="mt-3 text-gray-600 dark:text-gray-400">Detalles específicos de la propuesta y las personas involucradas.</p>

            <div className="flex gap-3 mt-6">
              <span className="px-4 py-2 rounded-full bg-primary/20 text-primary text-sm">Iniciativa</span>
              <span className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm">{data.legislatura} Legislatura</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              <Info t="Tipo de trámite" d={data.tipo_tramite || 'Iniciativa'} />
              <Info t="Objetivo" d={data.objetivo || 'No especificado'} />
              <Info t="Presentó" d={data.presento || data.iniciante} />
              <Info t="Estado" d={data.estatus} />
            </div>

            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
              <p className="text-sm text-gray-500">Descripción ciudadana</p>
              <p className="text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">{data.descripcion_ciudadana}</p>
            </div>

            <div className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-8">
              <h4 className="text-xl font-bold text-gray-900 dark:text-blue-100 mb-6">Participantes</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-sm text-gray-500 mb-3">Grupo parlamentario</p>
                  <div className="space-y-2">
                    {data.grupos_parlamentarios?.length > 0 ? (
                      data.grupos_parlamentarios.map((grupo) => (
                        <div key={grupo.nombre} className="flex items-center gap-4">
                          <img src={grupo.logo} className="w-24 h-24 object-contain" alt={grupo.nombre} />
                          <p className="font-semibold text-gray-800 dark:text-gray-200">{grupo.nombre}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm">No especificado</p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-4">Diputados involucrados</p>
                  <div className="space-y-4">
                    {data.diputados?.length > 0 ? (
                      data.diputados.map((dip) => (
                        <div key={dip.nombre} className="flex items-center gap-4">
                          {dip.foto? (
                            <img src={dip.foto} alt={dip.nombre} className="w-16 h-16 rounded-full object-cover border border-gray-200 dark:border-gray-700 shadow-sm transition duration-300 hover:scale-105" />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700">
                              <User size={28} />
                            </div>
                          )}
                          <span className="text-gray-900 dark:text-[#C5AB81] font-medium">{dip.nombre}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm">No hay diputados registrados</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* ================= SEGUIMIENTO ================= */}
        <div id="seguimiento">
          <Card>
            <IconBox><Inbox size={35} /></IconBox>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-blue-100">Seguimiento del trámite</h3>
            <p className="mt-3 text-gray-600 dark:text-gray-400">Línea de tiempo de los avances de la iniciativa.</p>
            <div className="space-y-5 mt-8">
              {data.pasos_seguimiento?.length > 0? (
                data.pasos_seguimiento.map((paso, idx) => (
                  <Step key={idx} text={paso} />
                ))
              ) : (
                <Step text="Propuesta recibida" />
              )}
            </div>
          </Card>
        </div>

        {/* ================= SESIONES ================= */}
        <div id="sesiones">
          <Card>
            <IconBox><Scale size={35} /></IconBox>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-blue-100">Sesiones y reuniones</h3>
            <p className="mt-3 text-gray-600 dark:text-gray-400">Fechas de discusión y análisis técnico en comisiones.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              <Info t="Presentación" d={data.fecha_presentacion_pleno || 'Por definir'} />
              <Info t="Comisión" d="Revisión de la iniciativa" />
            </div>
          </Card>
        </div>

        {/* ================= DOCUMENTOS ================= */}
        <div id="documentos">
          <Card>
            <IconBox><ScrollText size={35} /></IconBox>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-blue-100">Documentos públicos</h3>
            <p className="mt-3 text-gray-600 dark:text-gray-400">Archivos oficiales del sistema SIAD listos para su descarga.</p>
            
            <div className="mt-8 space-y-4">
              {documentos.length === 0? (
                <div className="p-5 rounded-xl bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800">
                  <p className="text-gray-500 text-center">No hay documentos disponibles para esta iniciativa</p>
                </div>
              ) : (
                documentos.map((doc, index) => {
                  const esOFCIIL = contieneOFCIIL(doc);
                  const nombreArchivo = getNombreArchivo(doc.file);
                  
                  return (
                    <div key={`doc-${index}-${doc.file?.substring(0, 20) || 'unknown'}`} className={`p-5 rounded-xl border ${
                      esOFCIIL 
                       ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700' 
                        : 'bg-white dark:bg-gray-950 border-gray-100 dark:border-gray-800'
                    }`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate">
                              {nombreArchivo}
                            </p>
                            {esOFCIIL && (
                              <span className="flex-shrink-0 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                                OFCIIL ✓
                              </span>
                            )}
                          </div>
                          
                          <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            {doc.folio_legislatura && <span>Folio: {doc.folio_legislatura}</span>}
                            {doc.fecha && <span>Fecha: {doc.fecha}</span>}
                            {doc.clave && <span>Clave: {doc.clave}</span>}
                          </div>

                          {doc.serie && (
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Serie: {doc.serie}</p>
                          )}

                          {doc.asunto && (
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{doc.asunto}</p>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <a
                            href={doc.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`px-5 py-3 rounded-xl font-semibold transition-all shadow-sm whitespace-nowrap ${
                              esOFCIIL 
                               ? 'bg-primary text-white hover:bg-primary-dark' 
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                          >
                            {esOFCIIL? '⭐ Ver OFCIIL' : 'Ver documento'}
                          </a>
                          
                          {doc.descripcion && (
                            <button
                              onClick={() => toggleDescripcion(index)}
                              className="text-xs text-primary hover:text-primary-dark"
                            >
                              {descripcionVisible === index? 'Ocultar descripción' : 'Ver descripción'}
                            </button>
                          )}
                        </div>
                      </div>

                      {doc.descripcion && descripcionVisible === index && (
                        <div className="mt-3 p-3 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                          <div 
                            className="text-sm text-gray-600 dark:text-gray-300 prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: doc.descripcion }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        {/* ================= TECNICO ================= */}
        <div id="tecnico">
          <Card>
            <IconBox><Landmark size={35} /></IconBox>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-blue-100">Información técnica</h3>
            <p className="mt-3 text-gray-600 dark:text-gray-400">Identificadores institucionales y plazos legales.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              <Info t="Número de expediente" d={data.expediente} />
              <Info t="Legislatura" d={data.legislatura} />
              <Info t="Fecha límite para dictaminar" d={data.fecha_limite_dictamen || data.fecha_limite || 'No definida'} />
              <Info t="Iniciante" d={data.iniciante || data.institucion || 'No especificado'} />
            </div>
          </Card>
        </div>

      </section>
    </div>
  );
}