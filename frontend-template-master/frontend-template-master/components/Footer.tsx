'use client';

import { motion } from 'framer-motion';

export function Footer() {
    return (
        <footer className="bg-[#1e1e1e] dark:bg-[#111111] text-white border-t border-white/5 relative overflow-hidden transition-colors duration-300">
            {/* Decorative Top Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-dark via-primary to-primary-light opacity-80"></div>

            <div className="container mx-auto px-4 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="md:col-span-2"
                    >
                        <img
                            src="/logoLegislaturaBlancoH.png"
                            alt="Congreso del Estado de Guanajuato"
                            className="h-20 w-auto mb-6 drop-shadow-lg"
                        />
                        <p className="text-white/70 max-w-sm text-sm leading-relaxed border-l-2 border-primary pl-4">
                            H. Congreso del Estado de Guanajuato.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <h3 className="font-extrabold text-white mb-6 tracking-widest text-sm uppercase flex items-center gap-2">
                            <span className="w-4 h-0.5 bg-primary"></span>
                            Enlaces
                        </h3>
                        <ul className="space-y-4 text-sm text-white/70">
                            <li>
                                <a
                                    href="https://congresogto.gob.mx"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary transition-colors flex items-center gap-2 group"
                                >
                                    Portal del Congreso
                                    <span className="text-xs transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
                                </a>
                            </li>
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h3 className="font-extrabold text-white mb-6 tracking-widest text-sm uppercase flex items-center gap-2">
                            <span className="w-4 h-0.5 bg-primary"></span>
                            Contacto
                        </h3>
                        <div className="space-y-4 text-sm text-white/70">
                            <p className="leading-relaxed flex items-start gap-2">
                                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                <span>Paseo del Congreso No. 60<br />Col. Marfil<br />Guanajuato, Gto. C.P. 36250</span>
                            </p>
                            <p className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                <a href="mailto:contacto@congresogto.gob.mx" className="hover:text-primary transition-colors hover:underline underline-offset-4">
                                    contacto@congresogto.gob.mx
                                </a>
                            </p>
                            <p className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                <a href="tel:4731020000" className="hover:text-primary transition-colors hover:underline underline-offset-4">
                                    Tel. (473) 102 0000
                                </a>
                            </p>
                        </div>
                    </motion.div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
                    <p>© 2026 Congreso del Estado de Guanajuato.</p>
                    <p>Todos los derechos reservados.</p>
                </div>
            </div>

            {/* Background huge logo shadow */}
            <div className="absolute right-[-10%] bottom-[-20%] opacity-[0.03] pointer-events-none">
                <img src="/logoLegislaturaBlancoH.png" alt="" className="w-[800px]" />
            </div>
        </footer>
    );
}
