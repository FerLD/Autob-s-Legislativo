# Plantilla Acervos - Frontend Next.js

Plantilla base para proyectos frontend del Congreso del Estado de Guanajuato.

## Características

- **Next.js 16** con App Router
- **React 19** con Server Components
- **Tailwind CSS 4** para estilos
- **Framer Motion** para animaciones
- **Lucide React** para iconos
- **TypeScript** configurado
- **Docker** listo para despliegue

## Estructura del Proyecto

```
plantilla-acervos/
├── app/                    # App Router de Next.js
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Página inicial
│   └── globals.css         # Estilos globales
├── components/             # Componentes reutilizables
├── public/                 # Archivos estáticos
├── Dockerfile              # Configuración Docker
├── docker-compose.yml      # Docker Compose
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## 🔄 Cómo Renombrar el Proyecto

Sigue estos pasos para crear un nuevo proyecto basado en esta plantilla:

### 1. Copiar la carpeta

```bash
cp -r plantilla-acervos mi-nuevo-proyecto
cd mi-nuevo-proyecto
```

### 2. Actualizar `package.json`

Edita el archivo `package.json` y cambia el nombre del proyecto:

```json
{
  "name": "mi-nuevo-proyecto",   // <-- Cambiar aquí
  "version": "0.1.0",
  ...
}
```

### 3. Actualizar `docker-compose.yml`

Si vas a usar Docker, actualiza el nombre del servicio y container:

```yaml
services:
  mi-nuevo-proyecto:           # <-- Cambiar nombre del servicio
    container_name: mi-nuevo-proyecto  # <-- Cambiar nombre del container
    build: .
    ports:
      - "3000:3000"
```

### 4. Actualizar `Dockerfile` (opcional)

Si necesitas cambiar configuraciones específicas del proyecto.

### 5. Actualizar metadatos en `app/layout.tsx`

Cambia el título y descripción de la aplicación:

```tsx
export const metadata: Metadata = {
  title: "Mi Nuevo Proyecto",
  description: "Descripción de mi nuevo proyecto",
};
```

### 6. Limpiar e instalar dependencias

```bash
# Eliminar node_modules y lock file anterior
rm -rf node_modules package-lock.json .next

# Instalar dependencias frescas
npm install
```

### 7. Verificar que funciona

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) para verificar.

---

## Desarrollo

### Iniciar servidor de desarrollo

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

### Build de producción

```bash
npm run build
npm run start
```

### Con Docker

```bash
docker-compose up --build
```

---

## Agregar nuevas páginas

Crea archivos en la carpeta `app/`:

```
app/
├── page.tsx              # Ruta: /
├── about/
│   └── page.tsx          # Ruta: /about
├── dashboard/
│   ├── page.tsx          # Ruta: /dashboard
│   └── settings/
│       └── page.tsx      # Ruta: /dashboard/settings
```

## Agregar nuevos componentes

Crea componentes en la carpeta `components/`:

```tsx
// components/MiComponente.tsx
export function MiComponente() {
  return <div>Mi Componente</div>;
}
```

---

## Configuración de API

Para conectar con un backend, crea un archivo de configuración:

```typescript
// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function fetchData(endpoint: string) {
  const res = await fetch(`${API_URL}${endpoint}`);
  return res.json();
}
```

Y agrega la variable de entorno en `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Dependencias incluidas

| Paquete | Uso |
|---------|-----|
| `next` | Framework React |
| `react` | Librería UI |
| `tailwindcss` | Estilos utilitarios |
| `framer-motion` | Animaciones |
| `lucide-react` | Iconos |
| `clsx` | Clases condicionales |
| `tailwind-merge` | Merge de clases Tailwind |

---

## Recursos

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Documentación de Framer Motion](https://www.framer.com/motion/)
- [Iconos Lucide](https://lucide.dev/icons/)
