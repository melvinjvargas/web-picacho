# Picacho — Contexto de Sesión (14-15 julio 2026)

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

### Hotfixes (15 julio)
- **Bug pedidos**: filtro por defecto `"todas"` → `"all"` — entraba a "Sin resultados" porque el chip "Todos" usaba `"all"` y el estado inicial era `"todas"`.
- **Dashboard**: 2 nuevas MetricCards — "Ventas de la semana" (lunes 00:00 UTC, completado/en_proceso) y "Productos inactivos" (is_active=false, variant alert). Grid `grid-cols-3`. Orden: Pedidos hoy, Ventas de la semana, Ventas del mes, Productos activos, Productos inactivos.

### Fase 3 — Refactor (SDD, en progreso)
**SDD inicializado** (`sdd-init` + `openspec/`). Cambio: `fase-3-refactor`. 32 tareas en 6 fases, 7 PRs stacked-to-main. ~2450 líneas estimadas.

#### PR 1 — Test Foundation ✅
- vitest + @testing-library/react + jsdom instalados
- `vitest.config.ts`, `__tests__/setup.ts`, `__tests__/mocks/supabase.ts` (Proxy mock factory)
- `lib/cache-tags.ts` (CACHE_TAGS), `lib/status-colors.ts` (ORDER_STATUS dedup)
- `__tests__/lib/utils.test.ts`: 21 tests (cn, formatPrice, getWhatsAppLink, buildWhatsAppOrderText)
- Build + tsc limpios, 21 tests OK

#### PR 2 — Core Tests ✅
- `__tests__/lib/products-server.test.ts`: 18 tests (fetch, getAll, getFeatured, getById, getBySlug, parseDbRow)
- `__tests__/actions/orders.test.ts`: 8 tests (createOrder, updateOrderStatus auth)
- `__tests__/components/admin/AdminTable.test.tsx`: 14 tests (data, empty, loading, error, custom render)
- AdminTable extendido: props `emptyMessage`, `loading` (3 skeleton rows), `error` (alert banner) — backwards-compatible
- **61 tests total**

#### PR 3 — Data Caching ✅
- `lib/data/products-server.ts`: `unstable_cache` en getAllProductsServer (60s, tag "products"), getFeaturedProductsServer (60s), getProductBySlugServer (300s, tag "product-{slug}")
- `lib/data/dashboard-server.ts`: nuevo, `getDashboardMetrics()` con TTL 120s, tag "admin-dashboard"
- `app/admin/page.tsx`: usa `getDashboardMetrics()` en vez de queries inline
- `revalidateTag` en todos los Server Actions de products y orders (mantiene `revalidatePath` transicional)
- `__tests__/actions/products.test.ts`: 10 tests con revalidateTag checks
- **72 tests total**

#### PR 4 — Admin Table Unification ✅
- **Pedidos**: 189L → 31L page + `_hooks/usePedidos.ts` (64L) + `_components/PedidosFilters.tsx` (31L) + `_components/PedidosColumns.tsx` (57L)
- **Inventario**: 233L → 59L page + `_hooks/useInventario.ts` (75L) + `_components/InventarioTable.tsx` (27L) + `_components/InventarioColumns.tsx` (57L)
- Ambos usan AdminTable con column config + render functions
- Todos los archivos ≤80L (SRP)

#### PR 5-7 — Pendientes 🔲
- **PR 5**: descuentos (403L) + categorías (283L) + informes (277L) → AdminTable + _components/_hooks
- **PR 6**: Component splits restantes (ImageUploader 260L, ProductForm 240L, CartDrawer 239L, QuickAddModal 183L, Navbar 128L)
- **PR 7**: Verificación final (tsc, build, tests, visual)

## Decisiones
- Productos: máximo 5 imágenes (1 principal + 4 apoyo)
- Pedidos: solo "completado" y "en_proceso" cuentan como ventas
- "Hoy" = últimas 24h (por diferencia UTC-6)
- Sin login para clientes (ícono persona eliminado de navbar)
- **Server Actions para escritura, client-side Supabase solo para lectura** (pendiente migrar lecturas a server en Fase 3)
- **Nunca mezclar imports server-only (`next/headers`) en archivos que importan client components** — separación física obligatoria
- **`next/image` con `fill` requiere `relative` en el padre directo**
- **Fase 3 usa SDD**: `openspec/` + engram, hybrid mode, auto-chain + stacked-to-main
- **Patrón de refactor**: `page.tsx` orquestador → `_hooks/usePagename.ts` (estado/datos) + `_components/PagenameColumns.tsx` (config columnas AdminTable) + `_components/PagenameFilters.tsx` (si aplica)
- **`unstable_cache` en capa de datos, `revalidateTag` en Server Actions** (transición: mantener `revalidatePath` hasta PR final)
- **`revalidateTag(tag, {})`** — Next.js 16.2 requiere segundo argumento objeto vacío

## Pendiente
- 🔲 PR 5-7 de Fase 3 (ver arriba)
- Subir imágenes reales de productos
- Testear flujo completo de compra
- Deploy a Vercel
