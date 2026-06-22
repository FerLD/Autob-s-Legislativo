'use client';

import { motion } from 'framer-motion';
import { Folder, Scale, BookOpen, Inbox, ScrollText, Landmark, FileText, User } from 'lucide-react';

export default function ExpedientePage() {
    const secciones = [
        { id: "resumen", titulo: "Resumen", icono: Folder },
        { id: "propuesta", titulo: "Propuesta", icono: BookOpen },
        { id: "seguimiento", titulo: "Seguimiento", icono: Inbox },
        { id: "sesiones", titulo: "Sesiones", icono: Scale },
        { id: "documentos", titulo: "Documentos", icono: FileText },
        { id: "tecnico", titulo: "Información técnica", icono: Landmark }
    ];

  // Función para manejar el scroll suave al hacer clic en el menú
    const scrollToSection = (id: string) => {
    const elemento = document.getElementById(id);
    if (elemento) {
        const yOffset = -160; 
        const y = elemento.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }
    };
    

    // Componentes reutilizables para cada sección
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

    function Info({ t, d }: any) {
    return (
        <div>
            <p className="text-sm text-gray-500">{t}</p>
            <p className="font-semibold text-gray-800 dark:text-gray-200 mt-1">{d}</p>
        </div>
    );
    }

    function Step({ text }: any) {
    return (
        <div className="flex gap-4 items-center">
        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">✓</div>
        <p className="text-gray-700 dark:text-gray-300 font-medium">{text}</p>
        </div>
    );
    }

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
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-blue-100">Expediente Legislativo</h3>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-lg">Conoce de forma sencilla el avance de esta propuesta presentada ante el Congreso.</p>

            {/* ESTATUS */}
            <div className="flex flex-wrap gap-3 mt-6">
                <span className="px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-semibold">● En proceso</span>
                <span className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm">Expediente 607/LXVI-I</span>
            </div>

            {/* RESUMEN CIUDADANO */}
            <div className="mt-10 p-6 rounded-2xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800">
                <h4 className="text-xl font-bold text-gray-900 dark:text-blue-100 mb-3">¿Qué significa este expediente?</h4>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Este expediente representa una propuesta presentada por un Ayuntamiento. La propuesta será revisada por el Congreso antes de decidir si se aprueba, modifica o rechaza.</p>
            </div>

            {/* INFORMACION SIMPLE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="p-5 rounded-xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800">
                    <p className="text-sm text-gray-500">¿Qué tipo de trámite es?</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200 mt-1">Nueva propuesta de ley</p>
                </div>
                <div className="p-5 rounded-xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800">
                    <p className="text-sm text-gray-500">¿Quién presentó la propuesta?</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200 mt-1">Ayuntamiento</p>
                </div>
                <div className="p-5 rounded-xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800">
                    <p className="text-sm text-gray-500">Fecha en que fue recibida</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200 mt-1">04 de junio de 2026</p>
                </div>
                <div className="p-5 rounded-xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800">
                    <p className="text-sm text-gray-500">Próximo paso</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200 mt-1">Revisión y análisis legislativo</p>
                </div>
            </div>

            {/* IMAGEN DEL EXPEDIENTE */}
            <div className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-8 flex justify-center">
                <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 shadow-md group w-full max-w-xl">
                    <img src="https://congreso-gto.s3.amazonaws.com/uploads/comunicado/imagen/11635/inicio_WhatsApp_Image_2026-06-04_at_11.44.16_AM.jpeg" alt="Expediente legislativo" className="w-full aspect-[16/10] object-cover transition duration-500 group-hover:scale-105" />
                </div>
            </div>
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
                    <span className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm">LXVI Legislatura</span>
                </div>

                {/* DATOS DE LA PROPUESTA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                    <Info t="Tipo de trámite" d="Iniciativa" />
                    <Info t="Objetivo" d="Agregar una nueva regla a la Ley de Ingresos" />
                    <Info t="Presentó" d="Ayuntamiento de Salvatierra" />
                    <Info t="Estado" d="En revisión legislativa" />
                </div>

                {/* DESCRIPCION */}
                <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                    <p className="text-sm text-gray-500">Descripción ciudadana</p>
                    <p className="text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">El Ayuntamiento propone modificar la normativa para agregar una nueva disposición que beneficie a personas en condiciones vulnerables.</p>
                </div>

                {/* PARTICIPANTES */}
                <div className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-8">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-blue-100 mb-6">Participantes</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* GRUPO */}
                    <div>
                        <p className="text-sm text-gray-500 mb-3">Grupo parlamentario</p>
                        <div className="space-y-2">
                        <div className="flex items-center gap-4"><img src="/PRI.png" className="w-24 h-24 object-contain" alt="Partido" /><p className="font-semibold text-gray-800 dark:text-gray-200">PRI</p></div>
                        <div className="flex items-center gap-4"><img src="/PAN.png" className="w-24 h-24 object-contain" alt="Partido" /><p className="font-semibold text-gray-800 dark:text-gray-200">PAN</p></div>
                        <div className="flex items-center gap-4"><img src="/PRD.png" className="w-24 h-24 object-contain" alt="Partido" /><p className="font-semibold text-gray-800 dark:text-gray-200">PRD</p></div>
                        <div className="flex items-center gap-4"><img src="/MOR.png" className="w-24 h-24 object-contain" alt="Partido" /><p className="font-semibold text-gray-800 dark:text-gray-200">Morena</p></div>
                        <div className="flex items-center gap-4"><img src="/MOV.png" className="w-24 h-24 object-contain" alt="Partido" /><p className="font-semibold text-gray-800 dark:text-gray-200">Movimiento Ciudadano</p></div>
                        </div>
                    </div>

                    {/* DIPUTADOS */}
                    <div>
                        <p className="text-sm text-gray-500 mb-4">Diputados involucrados</p>
                        <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <img src="https://congreso-gto.s3.amazonaws.com/uploads/diputado/imagen/201/diputado_redondo_LXVI_ORTIZ_MANTILLA.jpg" alt="Diputado" className="w-16 h-16 rounded-full object-cover border border-gray-200 dark:border-gray-700 shadow-sm transition duration-300 hover:scale-105" />
                            <span className="text-gray-900 dark:text-[#C5AB81] font-medium">Ortiz Mantilla</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700"><User size={28} /></div>
                            <span className="text-gray-900 dark:text-[#C5AB81] font-medium">Rocío Cervantes Barba</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <img src="https://congreso-gto.s3.amazonaws.com/uploads/diputado/imagen/187/diputado_redondo_LXVI_MORENO_VALENCIA.jpg" alt="Diputado" className="w-16 h-16 rounded-full object-cover border border-gray-200 dark:border-gray-700 shadow-sm transition duration-300 hover:scale-105" />
                            <span className="text-gray-900 dark:text-[#C5AB81] font-medium">Moreno Valencia</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700"><User size={28} /></div>
                            <span className="text-gray-900 dark:text-[#C5AB81] font-medium">Fernando Lozano Duran</span>
                        </div>
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
                    <Step text="Propuesta recibida" />
                    <Step text="Revisión por comisiones" />
                    <Step text="Dictamen y decisión final" />
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
                    <Info t="Presentación" d="Sesión del 11/06/2026" />
                    <Info t="Comisión" d="Revisión de la iniciativa" />
                </div>
            </Card>
        </div>

        {/* ================= DOCUMENTOS ================= */}
        <div id="documentos">
            <Card>
                <IconBox><ScrollText size={35} /></IconBox>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-blue-100">Documentos públicos</h3>
                <p className="mt-3 text-gray-600 dark:text-gray-400">Archivos oficiales listos para su descarga.</p>
                <div className="mt-8 p-5 rounded-xl bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800">
                    <p className="text-gray-500 mb-3">Archivo oficial del expediente digital</p>
                    <button className="px-5 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-all shadow-sm">Descargar expediente</button>
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
                    <Info t="Número de expediente" d="607/LXVI-I" />
                    <Info t="Legislatura" d="LXVI" />
                    <Info t="Fecha límite para dictaminar" d="07/02/2027" />
                    <Info t="Iniciante" d="Ayuntamiento del Mpio. de Salvatierra" />
                </div>
            </Card>
        </div>

        </section>
    </div>
);
}
