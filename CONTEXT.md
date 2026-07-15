# Picacho — Contexto de Sesión (14 julio 2026)

## Cambios realizados

### Fase 1 — Correcciones y mejoras inmediatas
- **Subida de imágenes**: arreglada (bucket `product-images` + RLS en Supabase). Sanitización de nombres, validación 5MB, mensajes de error visibles, drag-and-drop para reordenar miniaturas.
- **Modal de confirmación**: `ConfirmModal` reutilizable reemplazó `confirm()` del navegador en Productos, Inventario, Descuentos, Categorías. Cierra con clic afuera y Escape.
- **Editar producto**: página nueva en `/admin/productos/[id]/editar` con formulario pre-rellenado.
- **Imágenes optimizadas**: `<img>` → `next/image` con `fill` en ProductImage, ProductGallery, ImageUploader, ProductAdminCard, inventario.
- **ESLint**: 13 errores y 8 warnings corregidos (setState en effects, refs en render, load antes de declaración, prefer-const).
- **`useProductFilter`**: arreglado — ahora es síncrono y recibe `products` como parámetro.
- **`productService`**: ya no bloquea SSR. Se creó `lib/data/products-server.ts` con funciones server-only (`fetchFromSupabaseServer`, `getAllProductsServer`, etc).
- **`<img>` fix**: `next/image` con `fill` requiere `relative` en el padre — corregido en ProductGallery thumbnails.

### Fase 2 — Arquitectura
- **Server Actions**: todas las escrituras pasaron del browser al servidor con `"use server"` + auth check.
  - `lib/actions/products.ts`: create, update, delete, toggle productos.
  - `lib/actions/orders.ts`: createOrder (sin auth, para clientes), updateOrderStatus (con auth, para admin).
- **Server Components**: Home (`app/page.tsx`) y Producto (`app/producto/[id]/page.tsx`) ahora son Server Components que fetchean datos server-side. La interactividad está en `HomeClient` y `ProductPageClient`.
- **Tipos de Supabase**: cliente tipado con `SupabaseClient<Database>`, 16 archivos actualizados, **0 casts `as unknown as`**. Base de datos tipada con `Relationships`, `Views`, `Functions`.
- **ProductForm simplificado**: sin campos `description`/`caracteristicas`/`cuidados` (van en `data/producto.txt`). Layout reorganizado con `row-span-2` — Información general alineada verticalmente con Estado + Precio.

### Admin
- **`/admin/productos`**: ahora solo muestra el formulario de creación de producto. La gestión de productos existentes se hace desde Inventario.
- **Informes**: filtro por defecto cambiado a "Hoy".
- **Pedidos**: updateStatus ahora usa Server Action.

### Backend / DB
- **Migración**: eliminadas columnas `description`, `caracteristicas`, `cuidados` de la tabla `products` (el contenido ahora es estático desde `data/producto.txt`).
- **Contenido estático**: `lib/content.ts` lee y cachea `data/producto.txt` (solo en servidor). Acordeones de producto usan este contenido, no la DB.
- **Server-only data**: `lib/data/products-server.ts` con funciones que usan `createServerSupabase()`.

## Decisiones
- Productos: máximo 5 imágenes (1 principal + 4 apoyo)
- Pedidos: solo "completado" y "en_proceso" cuentan como ventas
- "Hoy" = últimas 24h (por diferencia UTC-6)
- Sin login para clientes (ícono persona eliminado de navbar)
- **Server Actions para escritura, client-side Supabase solo para lectura** (pendiente migrar lecturas a server en Fase 3)
- **Nunca mezclar imports server-only (`next/headers`) en archivos que importan client components** — separación física obligatoria
- **`next/image` con `fill` requiere `relative` en el padre directo**

## Pendiente
- Fase 3: refactorizar componentes grandes (<80 líneas), caché + revalidación, unificar tablas admin, tests
- Subir imágenes reales de productos
- Testear flujo completo de compra
- Deploy a Vercel
