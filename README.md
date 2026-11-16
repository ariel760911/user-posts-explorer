# user-posts-explorer

SPA en React y TypeScript para explorar los usuarios de [JSONPlaceholder](https://jsonplaceholder.typicode.com), buscarlos por nombre, ver sus publicaciones y crear publicaciones nuevas con un formulario validado.

## Inicio rápido

Requisitos: Node `^20.19` o `>=22.12` (lo exige Vite 8) y npm.

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # 37 tests con Vitest + Testing Library
```

| Script | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm test` | Ejecuta todos los tests una vez (`test:watch` para modo observación) |
| `npm run typecheck` | Chequeo de tipos (TypeScript estricto) |
| `npm run lint` | Lint con oxlint |
| `npm run build` | Typecheck + build de producción en `dist/` |
| `npm run preview` | Sirve el build de producción |

> Los tests no llaman a la red: MSW intercepta las peticiones y una petición sin mock hace fallar el test.

## Qué hace la app

1. **Usuarios y búsqueda**: lista de usuarios con búsqueda por nombre en vivo (sin distinguir mayúsculas, acentos ni espacios). El número de resultados se anuncia a lectores de pantalla.
2. **Publicaciones**: al elegir un usuario se navega a `/users/:userId` y se cargan sus publicaciones.
3. **Crear publicación**: el botón **New post** abre un modal con título y texto obligatorios (marcados con `*`). Al publicar, el post aparece arriba de la lista con la etiqueta *Not saved on server*.
4. **Estados de carga y error**: visibles en usuarios, publicaciones y al publicar; los errores de carga ofrecen **Try again**.

| Ruta | Contenido |
| --- | --- |
| `/` | Lista de usuarios |
| `/users/:userId` | Publicaciones del usuario y botón para crear |
| `*` | Página no encontrada (también para ids inexistentes) |

En mobile, la lista y el detalle son pantallas separadas (con enlace **← Users** para volver) y el modal aparece como hoja inferior. En desktop se ven lado a lado.

## Estructura

Organizada por funcionalidad (*screaming architecture*), sin capas de más para el tamaño del proyecto:

```text
src/
  app/          # router, layout, QueryClient
  api/          # cliente HTTP (fetch) y tipos del dominio
  features/
    users/      # lista, búsqueda (filterUsersByName) y su panel contenedor
    posts/      # publicaciones, formulario (validatePost), alta local
  shared/ui/    # Button, Modal, Loading, ErrorMessage, NotFound
  test/         # setup, servidor MSW, fixtures, renderWithProviders
```

Las dependencias van en una sola dirección: `app → features → shared/api`. Ningún módulo de `features` importa de `app`.

## Decisiones

| Tema | Decisión y por qué |
| --- | --- |
| Datos | **TanStack Query**: estados de carga y error, caché y reintento sin reinventarlos. |
| Navegación | **React Router**: la URL refleja el usuario elegido, así que se puede compartir y sobrevive a recargar la página. |
| Publicaciones creadas | La API responde bien pero **no guarda nada**. El post se agrega a la caché con `setQueryData`, que tiene `staleTime` y `gcTime` infinitos para que un refetch no lo borre. Solo vive en memoria y se pierde al recargar. |
| Ids locales | La API devuelve **siempre `id: 101`** (comprobado). Cada post local recibe un id negativo para no repetir keys de React. |
| Publicaciones de ids inexistentes | Se piden recién cuando la lista de usuarios confirma que el usuario existe. Si la lista falla, se piden igual para no dejar el detalle cargando para siempre. |
| Validación | Función pura `validatePost`: un campo con solo espacios cuenta como vacío. Sin librería de formularios para dos campos. |
| Modal | **`<dialog>` nativo** con `showModal()`: el navegador aporta la trampa de foco, Esc, el fondo y el contenido de atrás inerte. Se cierra con Cancel, ×, Esc o tocando el fondo; el foco vuelve a **New post** y el borrador se conserva mientras se siga en el mismo usuario. |
| Estilos | **Tailwind CSS v4**, con colores como tokens en `@theme` y estados visuales atados a atributos ARIA (`aria-[current=page]`, `aria-[invalid=true]`). |
| Accesibilidad | Errores asociados a cada campo (`aria-describedby`), foco al primer campo inválido, foco al título al cambiar de usuario, áreas táctiles de 44px en mobile y regiones `status`/`alert`/`aria-live`. |
| Tests | Vitest + Testing Library + **MSW**: los tests montan las rutas reales y prueban comportamiento (rol y nombre accesible), no detalles internos. |

### Notas de entorno

- **Vitest 4.1.12**: la versión 4.0 tiene avisos de seguridad. npm 11.3 falla al resolver la 4.1 (error `edgesOut`), así que se instaló con `npx npm@11.6.2`. Con el lockfile ya generado, `npm install` y `npm ci` funcionan también con npm 11.3.
- **jsdom** no implementa `<dialog>` ni `scrollTo`: `src/test/setup.ts` agrega un polyfill mínimo que además emula el fondo inerte del modal para que los tests de foco sean realistas.
- **Despliegue**: al ser una SPA, el hosting debe responder con `index.html` en cualquier ruta (si no, entrar directo a `/users/3` da 404).

## Con más tiempo

### Prioridad 1: cubrir lo que hoy no se valida en un navegador real

- **Tests end-to-end con Playwright** en viewports de escritorio y móvil. El modal como hoja inferior, el bloqueo del scroll, el retorno real del foco y los bordes del backdrop hoy solo se validan con la simulación de jsdom o no tienen cobertura.
- **Integración continua con GitHub Actions** que ejecute typecheck, lint, tests y build en cada pull request.
- **Chequeos de accesibilidad automatizados con axe**. Habrían detectado antes el doble etiquetado del modal (el diálogo y el formulario se nombraban con el mismo título; ya corregido, el formulario ya no se nombra) y ayudarían a cuidar las regiones `aria-live`.

### Prioridad 2: robustez

- Un **error boundary** o un `errorElement` en las rutas, para que un error de renderizado no deje la aplicación en blanco.
- Usar `HttpError.status` para **no reintentar los errores 4xx**: hoy `retry: 1` se aplica a cualquier error.
- Fijar **umbrales de cobertura** en Vitest ahora que la suite tiene 37 tests.

### Segunda etapa

- **Persistir los posts creados** en `localStorage` o con el persister de TanStack Query, para que sobrevivan a una recarga.
- **Modo oscuro** aprovechando los tokens ya definidos en `@theme`, después de reemplazar los `bg-white` fijos.
- Si entra en el alcance, **editar y borrar posts locales** con actualizaciones optimistas.

### Lo que no se justifica a esta escala

Paginación o virtualización, búsqueda en el servidor y una capa de puertos y adaptadores. Agregarían complejidad sin un beneficio concreto.

## Cómo se usó la IA

Se trabajó con Claude Code como asistente de programación. La persona definió el alcance, tomó las decisiones y revisó cada paso. La IA propuso, implementó y verificó.

**Qué se le pidió**

- Debatir el enfoque antes de escribir código (TanStack Query o hooks propios, router o estado) y armar un plan por fases.
- Implementar cada fase con un commit por paso funcional, deteniéndose después de cada fase para revisión.
- Cambios posteriores: asterisco en campos obligatorios, migrar a Tailwind, mejorar la experiencia mobile, convertir el formulario en modal y corregir una lista de observaciones de revisión.

**Qué se aceptó**

- La estructura por funcionalidad, TanStack Query, React Router y MSW para los tests.
- Los ids locales negativos y la caché infinita para las publicaciones creadas.
- El `<dialog>` nativo para el modal.

**Qué se corrigió**

- Una revisión manual del modal encontró problemas que los tests no detectaban: podía quedar trabado si el navegador lo cerraba por su cuenta, el foco volvía por un comportamiento del navegador y no por el código, en mobile no salía desde abajo, el fondo seguía scrolleando y no se cerraba tocando el fondo. Se corrigieron y se agregaron tests que fallan con la implementación anterior.
- La misma revisión marcó que se pedían publicaciones de usuarios inexistentes, que se perdía el foco al mostrar "no encontrado", la etiqueta *Not saved on server* dentro del título, la búsqueda sin anuncio para lectores de pantalla, el mensaje "Post published." que no desaparecía y una dependencia de `features` hacia `app`.
- La IA también se corrigió a sí misma al verificar: un test de carga dependía del orden en que respondía la API (se hizo determinista), un test no detectaba ids duplicados (se agregó un espía de `console.error`) y un cambio de tamaño de botones alteraba desktop cuando se había pedido no tocarlo.
- Cada test importante se validó rompiendo el código a propósito y comprobando que falla.
