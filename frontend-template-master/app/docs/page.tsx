export default function StyleGuide() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-5xl">
            <h1 className="text-4xl font-bold text-secondary mb-4">Guía de Estilo</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
                Referencia de diseño para aplicaciones del Congreso del Estado de Guanajuato.
            </p>

            {/* Colors Section */}
            <section className="mb-16">
                <h2 className="text-2xl font-bold text-secondary mb-8 border-b pb-2">Colores</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Primary Colors */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Colores Principales</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="h-24 rounded-lg bg-primary shadow-sm flex items-end p-3">
                                    <span className="text-white font-mono text-sm">#C5AB81</span>
                                </div>
                                <p className="text-sm font-medium">Primary</p>
                            </div>
                            <div className="space-y-2">
                                <div className="h-24 rounded-lg bg-secondary shadow-sm flex items-end p-3">
                                    <span className="text-white font-mono text-sm">#383838</span>
                                </div>
                                <p className="text-sm font-medium">Secondary</p>
                            </div>
                        </div>
                    </div>

                    {/* Variations */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Variaciones</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="h-24 rounded-lg bg-primary-light shadow-sm flex items-end p-3">
                                    <span className="text-secondary font-mono text-sm">#D4C4A5</span>
                                </div>
                                <p className="text-sm font-medium">Primary Light</p>
                            </div>
                            <div className="space-y-2">
                                <div className="h-24 rounded-lg bg-primary-dark shadow-sm flex items-end p-3">
                                    <span className="text-white font-mono text-sm">#A8915D</span>
                                </div>
                                <p className="text-sm font-medium">Primary Dark</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gray Scale */}
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Escala de Grises</h3>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((level) => (
                        <div key={level} className="space-y-1">
                            <div className={`h-12 w-full rounded-md bg-gray-${level} border border-black/5`}></div>
                            <p className="text-xs text-center text-gray-500 dark:text-gray-400">{level}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Typography Section */}
            <section className="mb-16">
                <h2 className="text-2xl font-bold text-secondary mb-8 border-b pb-2">Tipografía</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">H1 - Avant Garde / Bold</p>
                            <h1 className="text-4xl font-bold text-secondary">Título Principal</h1>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">H2 - Avant Garde / Semibold</p>
                            <h2 className="text-3xl font-semibold text-secondary">Subtítulo de Sección</h2>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">H3 - Avant Garde / Medium</p>
                            <h3 className="text-2xl font-medium text-secondary">Encabezado de Tarjeta</h3>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <p className="text-sm text-gray-500 mb-2">Body - Inter / Regular</p>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-2">Small - Inter / Medium</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                Texto auxiliar o metadatos.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Components Section */}
            <section id="components" className="mb-16">
                <h2 className="text-2xl font-bold text-secondary mb-8 border-b pb-2">Componentes UI</h2>

                <div className="space-y-12">
                    {/* Buttons */}
                    <div>
                        <h3 className="text-xl font-semibold text-secondary mb-6">Botones</h3>
                        <div className="flex flex-wrap gap-4 p-6 bg-gray-50 dark:bg-transparent rounded-xl border border-gray-100 dark:border-gray-700">
                            <button className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors shadow-sm">
                                Primario
                            </button>
                            <button className="px-6 py-2 bg-primary/10 text-secondary border border-gray-200 rounded-lg font-medium hover:border-gray-300 hover:bg-primary/20 transition-colors shadow-sm">
                                Secundario
                            </button>
                            <button className="px-6 py-2 bg-secondary text-white rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-sm">
                                Oscuro
                            </button>
                            <button className="px-6 py-2 text-gray-600 dark:text-gray-300 hover:text-primary font-medium transition-colors">
                                Ghost
                            </button>
                        </div>
                    </div>

                    {/* Inputs */}
                    <div>
                        <h3 className="text-xl font-semibold text-secondary mb-6">Formularios</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-primary/5 dark:bg-transparent rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Nombre Completo</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        placeholder="Ej. Juan Pérez"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Selección</label>
                                     <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none bg-primary/5">
                                        <option>Opción 1</option>
                                        <option>Opción 2</option>
                                        <option>Opción 3</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cards */}
                    <div>
                        <h3 className="text-xl font-semibold text-secondary mb-6">Tarjetas</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-primary/5 dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow group">
                                <div className="h-40 bg-gray-100 dark:bg-transparent flex items-center justify-center text-gray-400 dark:text-gray-400 group-hover:bg-primary/5 transition-colors">
                                    Imagen / Preview
                                </div>
                                <div className="p-6">
                                    <h4 className="text-lg font-bold text-secondary dark:text-white mb-2 group-hover:text-primary transition-colors">Título de la Tarjeta</h4>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                                        Descripción breve del contenido de la tarjeta. Puede incluir varias líneas de texto.
                                    </p>
                                    <a href="#" className="text-sm font-semibold text-primary hover:underline">
                                        Ver detalles &rarr;
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
