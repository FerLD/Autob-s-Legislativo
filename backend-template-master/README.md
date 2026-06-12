# Plantilla Backend - Congreso del Estado de Guanajuato

Plantilla base para proyectos .NET con autenticación SILEG.

## Características

- **Autenticación JWT** con integración a base de datos SILEG (PostgreSQL)
- **Verificación de contraseñas** con BCrypt
- **Manejo de errores** centralizado con middleware
- **Estructura de carpetas** estándar para proyectos del Congreso
- **CORS** configurado para desarrollo

## Estructura del Proyecto

```
plantilla-backend/
├── PlantillaBackend/             # <-- Proyecto .NET
│   ├── Controllers/
│   │   ├── AuthController.cs     # Login y autenticación
│   │   └── HealthController.cs   # Health check
│   ├── DataContext/
│   │   └── SilegContext.cs       # Conexión a SILEG
│   ├── Http/
│   │   └── Respuesta.cs          # Wrapper genérico de respuestas
│   ├── MiddleWares/
│   │   └── ExceptionMiddleware.cs
│   ├── Model/
│   │   ├── Dtos/
│   │   │   ├── AuthenticateRequest.cs
│   │   │   ├── AuthenticateResponse.cs
│   │   │   └── UsuarioDto.cs
│   │   ├── Sileg/
│   │   │   ├── User.cs
│   │   │   ├── Role.cs
│   │   │   └── RolesUser.cs
│   │   └── JwtSettings.cs
│   ├── Repositories/
│   │   ├── ISilegRepository.cs
│   │   └── Impl/
│   │       └── SilegRepositoryImpl.cs
│   ├── Services/
│   │   ├── ISilegService.cs
│   │   ├── JwtService.cs
│   │   └── Impl/
│   │       └── SilegServiceImpl.cs
│   ├── Properties/
│   │   └── launchSettings.json
│   ├── appsettings.json
│   ├── appsettings.Development.json
│   ├── Program.cs
│   └── PlantillaBackend.csproj
├── PlantillaBackend.slnx         # Archivo de solución
├── .gitignore
└── README.md
```

## Uso

### 1. Clonar como base para nuevo proyecto

```bash
# Copiar la carpeta completa
cp -r plantilla-backend mi-nuevo-proyecto

# Renombrar carpetas y archivos
cd mi-nuevo-proyecto
mv PlantillaBackend MiNuevoProyecto
mv PlantillaBackend.slnx MiNuevoProyecto.slnx
mv MiNuevoProyecto/PlantillaBackend.csproj MiNuevoProyecto/MiNuevoProyecto.csproj
```

### 2. Actualizar el archivo .slnx

Editar `MiNuevoProyecto.slnx`:
```
MiNuevoProyecto/MiNuevoProyecto.csproj
```

### 3. Buscar y reemplazar el namespace

En todos los archivos `.cs`, reemplazar:
- `PlantillaBackend` → `MiNuevoProyecto`

También actualizar `<RootNamespace>` en el `.csproj`.

### 4. Restaurar y ejecutar

```bash
cd MiNuevoProyecto
dotnet restore
dotnet run
```

## Endpoints Disponibles

| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|---------------|
| POST | `/api/auth/login` | Iniciar sesión | No |
| GET | `/api/auth/me` | Obtener usuario actual | Sí |
| GET | `/api/health` | Health check | No |

## Configuración

### appsettings.json

```json
{
  "ConnectionStrings": {
    "SilegContext": "Host=...;Database=...;Username=...;Password=..."
  },
  "JwtSettings": {
    "Issuer": "https://www.congresogto.gob.mx/",
    "Audience": "https://www.congresogto.gob.mx/",
    "Key": "tu-clave-secreta-muy-larga",
    "Expires": 480
  }
}
```

## Agregar nuevas funcionalidades

### Nuevo Controller

```csharp
[ApiController]
[Route("api/[controller]")]
public class MiController : ControllerBase
{
    // Implementación...
}
```

### Nuevo Service

1. Crear interfaz en `Services/IMiService.cs`
2. Crear implementación en `Services/Impl/MiServiceImpl.cs`
3. Registrar en `Program.cs`:
   ```csharp
   builder.Services.AddScoped<IMiService, MiServiceImpl>();
   ```

### Nueva base de datos (opcional)

Si necesitas agregar otra base de datos además de SILEG:

1. Crear nuevo DbContext en `DataContext/`
2. Registrar en `Program.cs`:
   ```csharp
   builder.Services.AddDbContext<MiContext>();
   ```
3. Agregar connection string en `appsettings.json`

## Dependencias

- .NET 10.0
- Entity Framework Core 10.0
- Npgsql (PostgreSQL)
- BCrypt.Net-Next
- JWT Bearer Authentication
