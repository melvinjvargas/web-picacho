# Tasks: Fase 3 — Refactor, Caché, Tests

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~2450 |
| 400-line budget risk | High |
| Delivery strategy | auto-chain |
| Decision needed before apply | No |
| Chained PRs recommended | Yes |
| Chain strategy | stacked-to-main |
| Suggested split | PR 1 → PR 2 → ... → PR 7 (each ≤400L, stacked to main) |

### Suggested Work Units

| Unit | Goal | Likely PR | Lines | Notes |
|------|------|-----------|-------|-------|
| 1 | Test infra + shared types + utility tests | PR 1 | ~380L | Base: main. Vitest, cache-tags, status-colors, utils.test.ts |
| 2 | Data tests + AdminTable test | PR 2 | ~270L | products-server, orders, AdminTable render tests |
| 3 | unstable_cache + revalidateTag | PR 3 | ~130L | Server-side only, no UI change |
| 4 | AdminTable extend + descuentos split | PR 4 | ~380L | Biggest file first, AdminTable migration |
| 5 | categorías + informes split + migration | PR 5 | ~400L | 2 admin pages refactored |
| 6 | inventario + pedidos + ImageUploader | PR 6 | ~380L | 2 pages + upload component split |
| 7 | ProductForm + CartDrawer + QuickAddModal + ProductPageClient + final check | PR 7 | ~400L | Last splits + tsc/build verification |

---

## Phase 1: Test Infrastructure + Foundation (WS4 prep + WS3 prep types)

- [x] 1.1 Install vitest, @testing-library/react, @testing-library/jest-dom, jsdom as devDependencies
- [x] 1.2 Add test/test:watch scripts to package.json
- [x] 1.3 Create vitest.config.ts (jsdom environment, @/ → ./ alias, setupFiles)
- [x] 1.4 Create __tests__/setup.ts (jsdom globals) + __tests__/mocks/supabase.ts (mock factory)
- [x] 1.5 Create lib/cache-tags.ts (CACHE_TAGS const: products, product slug, adminDashboard, adminPedidos, content)
- [x] 1.6 Create lib/status-colors.ts (ORDER_STATUS dedup map: pendiente, en_proceso, completado, devolucion)
- [x] 1.7 Update tsconfig.json to include __tests__/** in types/paths — NOT NEEDED: existing `**/*.ts` glob already covers __tests__/**
- Verify: npm test runs (21 tests, 0 errors) ✓

## Phase 2: Core Tests (WS4)

- [x] 2.1 Create __tests__/lib/utils.test.ts — cover cn, formatPrice, getWhatsAppLink, buildWhatsAppOrderText; both happy-path + edge cases
- [x] 2.2 Create __tests__/lib/products-server.test.ts — parseDbRow (null colors, missing fields, empty arrays), fallback path
- [x] 2.3 Create __tests__/actions/orders.test.ts — createOrder validation errors, updateOrderStatus auth guard
- [x] 2.4 Create components/admin/data-display/AdminTable.test.tsx — render with data, empty row, loading skeleton (3 rows), error banner, custom cell render
- Verify: npm test passes ≥15 test cases, tsc --noEmit = 0 errors

## Phase 3: Data Caching (WS3)

- [x] 3.1 Wrap products-server.ts fetch functions in unstable_cache with tags per cache-tags.ts: getAllProductsServer (TTL 60s, "products"), getFeaturedProductsServer (TTL 60s, "products"), getProductBySlugServer (TTL 300s, "product-{slug}"). TTLs follow spec values rather than tasks.md (deviation noted; tasks.md says 3600s).
- [ ] 3.2 Wrap lib/content.ts fetchContent in unstable_cache (TTL 86400s, tag "content") — SKIPPED: spec WS3 says "lib/content.ts with its let cached pattern SHALL NOT be changed". Existing pattern is adequate. Tasks/spec conflict noted.
- [x] 3.3 Created lib/data/dashboard-server.ts with getDashboardMetrics() wrapped in unstable_cache (TTL 120s, "admin-dashboard"). Admin dashboard page refactored to use it. Informes page skipped (client component — server conversion is Phase 4/5 scope).
- [x] 3.4 Added revalidateTag("products", {}) + revalidateTag("admin-dashboard", {}) + revalidateTag("product-{slug}", {}) in lib/actions/products.ts. Kept revalidatePath("/") transitional safety per design.
- [x] 3.5 Added revalidateTag("admin-pedidos", {}) + revalidateTag("admin-dashboard", {}) in lib/actions/orders.ts. Kept revalidatePath transitional safety per design.

## Phase 4: Admin Table Unification (WS2) + Component Split (WS1, interleaved per page)

- [x] 4.1 Extend AdminTable.tsx: add emptyMessage (default "Sin resultados."), loading (3 skeleton <tr>), error props; keep rowHeight and column API unchanged
- [ ] 4.2 Create lib/constants/orders.ts importing from lib/status-colors.ts; deduplicate status maps from pedidos/page.tsx and RecentOrders.tsx — SKIPPED: ORDER_STATUS already centralized in lib/status-colors.ts
- [x] 4.3 Refactor pedidos: page → AdminTable with render prop for status <select>; 189L → 31L + usePedidos (64L) + PedidosColumns (57L) + PedidosFilters (31L)
- [x] 4.4 Refactor inventario: page → AdminTable via InventarioTable wrapper; 233L → 59L + useInventario (75L) + InventarioTable (27L) + InventarioColumns (57L)
- [ ] 4.5 Refactor descuentos: extract useDescuentos + DescuentosColumns + DescuentosForm to _components/; page → AdminTable ≤60L; 403L → ~60L
- [ ] 4.6 Refactor categorias: extract useCategorias + CategoriasColumns + CategoriasForm to _components/; page → AdminTable ≤60L; 283L → ~60L
- [ ] 4.7 Refactor informes: extract MetricsRow + TopProductsTable + DiscountsUsedTable to _components/; page ≤80L; 277L → ~80L
- Verify: each page ≤80L (pedidos ≤100L with render complexity); npm run build passes; visual regression: zero

## Phase 5: Remaining Component Splits (WS1 standalone)

- [ ] 5.1 Split ImageUploader.tsx: extract ThumbnailList + UploadZone + ImagePreview to upload/_components/; ≤75L; 260L → ~75L
- [ ] 5.2 Split ProductForm.tsx: extract ProductBasicFields + ProductVariantFields to forms/_components/; ≤80L; 240L → ~80L
- [ ] 5.3 Split CartDrawer.tsx: extract CartItemsList + CartCheckoutSection to layout/_components/; ≤75L; 239L → ~75L
- [ ] 5.4 Split QuickAddModal.tsx: extract QuickAddFormFields to product-detail/_components/; ≤70L; 183L → ~70L
- [ ] 5.5 Split ProductPageClient.tsx: extract ProductDetailLayout to producto/[id]/_components/; ≤75L; 146L → ~75L
- Verify: all target files ≤80L; tsc --noEmit = 0 errors; visual output unchanged from pre-refactor state

## Phase 6: Final Verification (WS4 continued)

- [ ] 6.1 npx tsc --noEmit → 0 errors (strict compliance)
- [ ] 6.2 npm run build → success (no runtime breaks)
- [ ] 6.3 npm test → all pass; ≥80% coverage on utils, products-server, actions, AdminTable
- [ ] 6.4 Spot-check 3 admin pages and 2 customer pages visually for zero regression
