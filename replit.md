# Control de Tiempos - Sistema de Registro de Jornadas Laborales

## Descripción del Proyecto
Aplicación web profesional para el control y registro de tiempos de trabajo de empleados. Permite registrar entradas, pausas (desayuno y merienda), y finalización de jornadas, con cálculo automático de horas trabajadas, tiempo en pausas, y tiempo real de trabajo.

## Características Principales

### Funcionalidades MVP
1. **Registro de Tiempos**
   - Entrada (inicio de jornada)
   - Inicio y fin de pausa de desayuno
   - Inicio y fin de pausa de merienda
   - Finalización de jornada

2. **Cálculos Automáticos**
   - Horas totales trabajadas (desde entrada hasta salida)
   - Tiempo total en pausas
   - Tiempo real de trabajo (horas totales - pausas)

3. **Visualización de Datos**
   - Vista semanal de registros
   - Vista mensual de registros
   - Vista anual de registros
   - Retención de datos por 3 años (eliminación automática de datos antiguos)

4. **Interfaz de Usuario**
   - Tarjeta de estado actual (trabajando, en pausa, finalizado)
   - Reloj en tiempo real
   - Dashboard de estadísticas con 3 métricas principales
   - Tabla histórica con múltiples vistas temporales
   - Modo claro/oscuro

## Arquitectura Técnica

### Frontend
- **Framework**: React con TypeScript
- **Routing**: Wouter
- **Estilos**: Tailwind CSS + Shadcn UI
- **Estado**: TanStack Query para data fetching
- **Manejo de fechas**: date-fns
- **Componentes principales**:
  - `StatusCard`: Muestra estado actual y reloj en tiempo real
  - `TimeEntryButtons`: Botones para registrar eventos de tiempo
  - `StatisticsCards`: Dashboard con 3 métricas (horas totales, pausas, tiempo real)
  - `HistoryTable`: Tabla con vistas semanal/mensual/anual
  - `ThemeToggle`: Cambio entre modo claro y oscuro

### Backend
- **Framework**: Express.js
- **Base de datos**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **Modelo de datos**: 
  - Tabla `work_sessions` con timestamps para cada evento
  - Cálculos de tiempo almacenados en minutos

### Esquema de Base de Datos
```typescript
work_sessions:
  - id (UUID)
  - date (texto, formato YYYY-MM-DD)
  - startTime (timestamp)
  - breakfastStart (timestamp, nullable)
  - breakfastEnd (timestamp, nullable)
  - snackStart (timestamp, nullable)
  - snackEnd (timestamp, nullable)
  - endTime (timestamp, nullable)
  - totalWorkMinutes (integer)
  - totalBreakMinutes (integer)
  - actualWorkMinutes (integer)
  - status (texto: "working", "breakfast", "snack", "finished")
```

## Diseño Visual

### Paleta de Colores
- **Primary (Verde)**: Estado "trabajando" - 142 70% 45%
- **Warning (Ámbar)**: Estado "en pausa" - 38 92% 50%
- **Modo oscuro primario**: Fondo 220 15% 10%
- **Modo claro primario**: Fondo 0 0% 98%

### Tipografía
- **Sans-serif**: Inter, Roboto (textos generales)
- **Monospace**: Roboto Mono (displays de tiempo y números)

### Principios de Diseño
- Claridad sobre decoración
- Feedback inmediato en interacciones
- Datos escaneables
- Acciones accesibles con botones grandes
- Espaciado consistente (6, 8, 12 unidades)

## Estado del Desarrollo

### Completado
- [x] Esquema de datos completo
- [x] Todos los componentes de UI (frontend)
- [x] Diseño responsive
- [x] Modo claro/oscuro
- [x] Reloj en tiempo real
- [x] Cálculos de tiempo en frontend
- [x] Vistas históricas (semanal, mensual, anual)

### En Progreso
- [ ] Backend API endpoints
- [ ] Integración base de datos PostgreSQL
- [ ] Persistencia de datos
- [ ] Sistema de limpieza automática (>3 años)

### Próximos Pasos
- [ ] Conectar frontend con backend
- [ ] Testing end-to-end
- [ ] Optimizaciones de rendimiento

## Comandos de Desarrollo
- `npm run dev`: Inicia servidor de desarrollo (frontend + backend)
- `npm run db:push`: Sincroniza esquema de base de datos
- `npm run build`: Construye para producción

## Notas Técnicas
- La aplicación usa almacenamiento PostgreSQL para persistencia de datos hasta 3 años
- Los cálculos de tiempo se realizan en minutos para precisión
- Todas las fechas se manejan con date-fns y locale español
- Los estados de sesión se validan para evitar secuencias incorrectas (ej: no se puede finalizar una pausa sin iniciarla)
