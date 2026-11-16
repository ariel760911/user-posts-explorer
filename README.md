# user-posts-explorer

Una app en React y TypeScript para explorar usuarios y sus publicaciones, con búsqueda y creación de posts, sobre la API pública [JSONPlaceholder](https://jsonplaceholder.typicode.com).

> README en construcción: este documento se completa al final del desarrollo.

## Alcance

### Flujos principales

1. **Explorar usuarios**: al entrar se ve la lista de usuarios.
2. **Buscar por nombre**: un campo filtra la lista mientras se escribe (sin distinguir mayúsculas).
3. **Ver publicaciones**: al elegir un usuario se cargan y muestran sus publicaciones.
4. **Crear publicación**: un formulario con título y texto obligatorios; al enviarlo, la publicación aparece en la lista (la API no la guarda de verdad).

En todos los flujos con red se muestran estados de **carga** y de **error** visibles.

### Fuera de alcance

- Editar o borrar publicaciones.
- Persistir las publicaciones creadas entre recargas.
- Autenticación.

## Estructura

SPA con Vite, React, TypeScript, React Router y TanStack Query, organizada por funcionalidad:

```text
src/
  app/        # router, layout y providers
  api/        # cliente HTTP y tipos del dominio
  features/
    users/    # lista y búsqueda de usuarios
    posts/    # publicaciones y formulario
  shared/ui/  # componentes reutilizables (carga, error)
```

Rutas:

| Ruta             | Contenido                                        |
| ---------------- | ------------------------------------------------ |
| `/`              | Lista de usuarios                                |
| `/users/:userId` | Lista de usuarios + publicaciones y formulario   |
| `*`              | Página no encontrada                             |
