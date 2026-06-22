import { Search, Filter, Download, Plus, MoreVertical, FileText } from 'lucide-react';
import Link from 'next/link';

export default function ExamplePage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header de la Página */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-secondary mb-2">Gestión de Documentos</h1>
                    <p className="text-gray-600">
                        Ejemplo de una vista de listado con filtros y acciones.
                    </p>
                </div>
                <button className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm">
                    <Plus className="w-5 h-5" />
                    Nuevo Documento
                </button>
            </div>

            {/* Panel de Filtros */}
            <div className="bg-primary/5 p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar por título, folio o autor..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <select className="px-4 py-2 border border-gray-200 rounded-lg bg-primary/5 focus:outline-none focus:border-primary text-gray-600 text-sm h-10 min-w-[150px]">
                        <option>Todos los años</option>
                        <option>2026</option>
                        <option>2025</option>
                    </select>
                    <button className="px-4 py-2 border border-gray-200 rounded-lg bg-primary/10 hover:bg-primary/20 dark:hover:bg-transparent text-gray-600 flex items-center gap-2 transition-colors">
                        <Filter className="w-4 h-4" />
                        <span className="hidden sm:inline">Filtros</span>
                    </button>
                </div>
            </div>

            {/* Tabla de Resultados */}
            <div className="bg-primary/5 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-transparent border-b border-gray-100">
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">
                                    <input type="checkbox" className="rounded accent-primary" />
                                </th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Documento</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Folio</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-transparent">
                            {[1, 2, 3, 4, 5].map((item) => (
                                <tr key={item} className="hover:bg-gray-50/80 dark:hover:bg-transparent transition-colors group">
                                    <td className="p-4">
                                        <input type="checkbox" className="rounded accent-primary" />
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-primary/10 text-primary rounded-lg">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900 group-hover:text-primary transition-colors cursor-pointer">
                                                    Acta de Sesión Ordinaria {item}/2026
                                                </h4>
                                                <p className="text-xs text-gray-500 mt-1">Legislatura LXVI • Comisión de Gobernación</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600 font-mono">
                                        ACT-2026-{String(item).padStart(3, '0')}
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        28 Ene, 2026
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item % 2 === 0
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {item % 2 === 0 ? 'Publicado' : 'En Revisión'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-gray-400 hover:text-secondary transition-colors p-1">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Mostrando <span className="font-medium">1</span> a <span className="font-medium">5</span> de <span className="font-medium">24</span> resultados
                    </p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 text-sm border border-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-transparent text-gray-600 disabled:opacity-50">Anterior</button>
                        <button className="px-3 py-1 text-sm bg-primary text-white rounded-md hover:bg-primary-dark shadow-sm">1</button>
                        <button className="px-3 py-1 text-sm border border-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-transparent text-gray-600">2</button>
                        <button className="px-3 py-1 text-sm border border-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-transparent text-gray-600">3</button>
                        <button className="px-3 py-1 text-sm border border-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-transparent text-gray-600">Siguiente</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
