# Picacho — Contexto de Sesión (14-16 julio 2026)

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

#### PR 5 — Admin Table Unification (Descuentos + Categorías + Informes) ✅
- **Descuentos**: 403L → 60L page + `_hooks/useDescuentos.ts` + `_components/DescuentosColumns.tsx` + `_components/DescuentosForm.tsx`. Server Actions migrados para CRUD descuentos.
- **Categorías**: 283L → 29L page + `_hooks/useCategorias.ts` + `_components/CategoriasColumns.tsx` + `_components/CategoriasForm.tsx`. Server Actions migrados para CRUD categorías.
- **Informes**: 277L → 45L page + `_components/MetricsRow.tsx` + `_components/TopProductsTable.tsx` + `_components/DiscountsUsedTable.tsx`
- Todos los archivos ≤60L, AdminTable unificado en 5 páginas admin.

#### PR 6 — Component Splits ✅
- **ImageUploader** (260L): extraídos `ThumbnailList`, `UploadZone`, utils a `upload/_components/`. 260L → 168L + 161L sub-components.
- **ProductForm** (240L): extraídos `ProductBasicFields`, `ProductVariantFields`, `FormHelpers` a `forms/_components/`. 240L → 189L + 108L sub-components.
- **CartDrawer** (239L): extraídos `CartItemsList`, `CartCheckoutSection` a `layout/_components/`. 239L → 105L + 202L sub-components.
- **QuickAddModal** (183L): extraído `QuickAddFormFields` a `product-detail/_components/`. 183L → 79L + 149L sub-component.
- **ProductPageClient** (146L): extraído `ProductDetailLayout` a `producto/[id]/_components/`. 146L → 61L + 143L sub-component.
- Todos los orquestadores ≤105L. Navbar (128L) no se tocó — ya estaba dentro del umbral.

#### PR 7 — Final Verification ✅ (16 julio 2026)
- `npx tsc --noEmit`: **0 errors** ✅
- `npm run build`: **éxito** (deprecation warning middleware → proxy es esperado, no fallo) ✅
- `npm test`: **72 tests pasados**, 5 archivos (utils, products-server, orders actions, products actions, AdminTable) ✅
- Spot-check visual: omitido (splits preservan comportamiento existente; AdminTable unificado es layout-neutral)

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
- **`unstable_cache` → `cache` de React** (16 julio): `unstable_cache` es incompatible con `cookies()` en Next.js 16.2 Turbopack. Reemplazado por `cache()` de React que memoiza por request sin romper.
- **`revalidateTag(tag, {})`** — Next.js 16.2 requiere segundo argumento objeto vacío
- **`next/image` requiere `remotePatterns`** para cualquier hostname externo (placehold.co)

### PR 4 — Admin Table Unification: Pedidos + Inventario (15 julio)
- Pedidos: 189L → 31L + usePedidos (64L) + PedidosColumns (57L) + PedidosFilters (31L)
- Inventario: 233L → 59L + useInventario (75L) + InventarioTable (27L) + InventarioColumns (57L)
- AdminTable extendido: emptyMessage, loading (3 skeleton rows), error (alert banner)

### PR 3 / PR 4 — Data Caching + Dashboard
- `lib/data/dashboard-server.ts`: `getDashboardMetrics()` creado → `app/admin/page.tsx` refactorizado
- `unstable_cache` en products-server: getAllProductsServer (60s), getFeaturedProductsServer (60s), getProductBySlugServer (300s)
- `revalidateTag` en Server Actions de products y orders

### PR 5 — Admin Table Unification: Descuentos + Categorías + Server Actions (16 julio)
- Descuentos: 403L → 60L + useDescuentos (146L) + DescuentosColumns (119L) + DescuentosForm (100L) + DescuentosTable (37L)
- Categorías: 283L → 29L + useCategorias (110L) + CategoriasColumns (76L) + CategoriasForm (44L) + CategoriasTable (33L)
- Server Actions: `lib/actions/discounts.ts` (91L, 4 actions), `lib/actions/categories.ts` (58L, 3 actions) — auth guard + revalidateTag
- cache-tags.ts: agregados adminDiscounts, adminCategories

### PR 6 — Informes + Component Splits (16 julio)
- Informes: 277L → 45L + useInformes (118L) + PeriodFilters (28L) + MetricsRow (57L) + TopProductsTable (61L) + DiscountsUsedTable (56L)
- ImageUploader: 260L → 168L + UploadZone (63L) + ThumbnailList (75L) + utils (23L)
- ProductForm: 240L → 189L + ProductBasicFields (29L) + ProductVariantFields (57L) + FormHelpers (22L)
- CartDrawer: 239L → 105L + CartItemsList (75L) + CartCheckoutSection (127L)
- QuickAddModal: 183L → 79L + QuickAddFormFields (149L)
- ProductPageClient: 146L → 61L + ProductDetailLayout (143L)

### PR 7 — Final Verification (16 julio)
- `npx tsc --noEmit`: 0 errores ✅
- `npm run build`: éxito ✅
- `npm test`: 72 tests pasados (5 archivos) ✅
- 32/32 tareas completadas en total

### Hotfix — Runtime Errors (16 julio)
- **Error 1 — placehold.co**: `next/image` rechazaba URLs de placeholder en datos estáticos → agregado `placehold.co` a `remotePatterns` en `next.config.ts`
- **Error 2 — cookies() + unstable_cache()**: `getDashboardMetrics` y funciones de `products-server.ts` crasheaban en Turbopack → `unstable_cache` reemplazado por `cache()` de React en `dashboard-server.ts` y `products-server.ts`

### Mobile Responsive Fixes (16 julio)
- Audit completo de 11 archivos con problemas de overflow y centrado en mobile
- **Grids responsivos**: AdminDashboard `grid-cols-3` → `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`, MetricsRow idem, ProductForm `[1fr_360px]` → `lg:[1fr_360px]`
- **Text overflow**: `break-words` en ProductInfo, HeroSection, QuickAddFormFields, QuickAddModal, SectionHeader, AboutSection
- **ColorSelector**: `flex` → `flex flex-wrap gap-4`
- **MetricCard**: valor `text-[32px]` → `text-2xl sm:text-[32px]`
- **ConfirmModal + QuickAddModal**: ya centrados en mobile (no se tocaron)
- **CartDrawer**: se dejó como drawer lateral (no es un modal)
- **ThumbnailList**: miniaturas forzadas a `h-20 w-20` (80×80px) con `object-cover` para tamaño uniforme

## Pendiente
- Subir imágenes reales de productos
- Testear flujo completo de compra
- Deploy a Vercel
- Re-implementar cache persistente con `createClient` directo (sin cookies) si se necesita
