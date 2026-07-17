## Exploration: Mobile Responsive Issues Audit

### Current State

The storefront (Next.js 16 + Tailwind v4) uses a mostly responsive layout: product grids switch to 2 columns on mobile, sections use `max-w-[1440px]`/`max-w-7xl` with `px-4` mobile padding, and modals generally use `fixed inset-0 flex items-center justify-center`. However, several components rely on fixed widths, non-wrapping flex rows, or multi-column grids without mobile breakpoints, causing text/layout overflow or poor centering on narrow screens.

Admin pages were recently refactored into small SRP components, but dashboard/informes metric rows still use `grid-cols-3` unconditionally, and the product creation form uses a fixed 360 px right column that breaks the viewport below ~400 px.

### Affected Areas

#### High severity (layout breakage / horizontal overflow)

- `components/admin/forms/ProductForm.tsx` — `grid grid-cols-[1fr_360px]` forces a 360 px-wide right column. On screens < 400 px the form overflows horizontally; the sticky footer `px-8` also contributes.
- `app/admin/page.tsx` — `grid grid-cols-3 gap-4` for 5 metric cards squishes cards into 3 narrow columns; `MetricCard` renders values at `text-[32px]`, likely clipped or wrapping awkwardly on mobile.
- `app/admin/informes/_components/MetricsRow.tsx` — same `grid grid-cols-3 gap-4` without mobile variants.
- `components/product-detail/ProductInfo.tsx` — product name `<h1>` and breadcrumb concatenate `product.name` with no `break-words`/`line-clamp`; long names overflow the right column on mobile.

#### Medium severity (text/element overflow, fixable with small class tweaks)

- `components/sections/HeroSection.tsx` — hero product name `<h1>` has no overflow control; the placeholder image shows `[{slide.name}]`, which can also overflow.
- `components/product-detail/_components/QuickAddFormFields.tsx` — product name `<h2>` has no `break-words`/`line-clamp`.
- `components/product-detail/QuickAddModal.tsx` — centered correctly, but the placeholder image renders `[{product.name}]` with no overflow handling; modal is `max-h-[90vh]` with image + form stacked, fine for most cases but can feel cramped on short viewports.
- `components/product-detail/ColorSelector.tsx` — color circles use `flex` (not `flex-wrap`); many colors overflow horizontally.
- `components/ui/SectionHeader.tsx` — title has no overflow control; link uses `whitespace-nowrap` and could overflow if label is long.
- `components/sections/AboutSection.tsx` — heading has no `break-words` (currently short text, but brittle).

#### Low severity / by-design behavior

- `components/layout/CartDrawer.tsx` — slides in from the right (`justify-end`) and is full-width on mobile. This is drawer behavior, not a modal, so it is intentionally not centered. If the requirement is "all overlays centered", this would need a design change.
- `components/sections/YouMayAlsoLike.tsx` — horizontal scrolling carousel with `overflow-x-auto` is intentional; not an overflow bug.
- `components/admin/cards/ProductAdminCard.tsx` — image is fixed `w-[196px]`; if the card container is narrower than 196 px it overflows.
- `components/admin/data-display/AdminTable.tsx` — wrapped in `overflow-x-auto`, so wide tables scroll rather than break. Acceptable for admin data tables.

### Approaches

1. **Tailwind-only responsive pass** — add breakpoints (`md:`, `lg:`), switch fixed grids to responsive grids (`grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_360px]`), and add `break-words`/`min-w-0` to text containers.
   - Pros: Low risk, fast, matches current stack.
   - Cons: Does not introduce a reusable mobile-modal pattern; CartDrawer remains right-aligned.
   - Effort: Low

2. **Add a shared mobile-modal primitive + responsive utility classes** — create a `MobileCenteredModal` wrapper (centered, full-width with margins, `max-h-[90vh]`, `overflow-y-auto`) and refactor `QuickAddModal`/`ConfirmModal` to use it; apply responsive grids to admin metrics and product form.
   - Pros: Consistent modal behavior, reusable for future overlays, addresses both reported issues holistically.
   - Cons: Slightly more files touched, requires verifying z-index/portal behavior.
   - Effort: Medium

3. **Scoped fixes per page** — patch each component individually without creating new shared primitives.
   - Pros: Minimal blast radius, easy to review in small PRs.
   - Cons: Risk of inconsistent fixes; repeated code for modal centering.
   - Effort: Low-Medium

### Recommendation

Use **Approach 1 for the overflow fixes** (responsive grids + `break-words`) and **adopt the centered modal wrapper from Approach 2 only for `QuickAddModal` and any future modal**; keep `CartDrawer` as a right drawer since it is intentionally a drawer. This balances speed and consistency without over-engineering.

Specific recommended class fixes (do not apply yet):

- `ProductForm.tsx`: change `grid grid-cols-[1fr_360px]` to `grid grid-cols-1 lg:grid-cols-[1fr_360px]`; change sticky footer `px-8` to `px-4 sm:px-8`.
- `app/admin/page.tsx` & `MetricsRow.tsx`: change `grid grid-cols-3 gap-4` to `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`; reduce metric value size on small screens (`text-2xl sm:text-[32px]`).
- `ProductInfo.tsx`: add `break-words` to the `<h1>` and breadcrumb; consider `line-clamp-2` for the name.
- `HeroSection.tsx`: add `break-words` to hero `<h1>` and placeholder image text.
- `QuickAddFormFields.tsx`: add `break-words`/`line-clamp-2` to product name `<h2>`.
- `QuickAddModal.tsx`: add `break-words` to placeholder image text; consider `overflow-y-auto` on the modal panel itself.
- `ColorSelector.tsx`: change color row to `flex flex-wrap gap-4`.
- `SectionHeader.tsx`: add `break-words` to title; remove or guard `whitespace-nowrap` on the link.
- `ProductAdminCard.tsx`: change image container to `w-full` instead of fixed `w-[196px]`.

### Risks

- Tailwind v4 arbitrary values like `grid-cols-[1fr_360px]` are valid but need careful breakpoint overrides.
- Modals currently rendered inline (not all via portal); changing wrapper markup may affect stacking context if `z-50` is not preserved.
- Admin tables rely on `overflow-x-auto`; reducing metric grids to one column on mobile is safe but changes the dashboard layout significantly.

### Ready for Proposal

Yes. The next step is a concrete change proposal/PR scope for the high and medium severity fixes, plus a decision on whether `CartDrawer` should remain a right drawer or be converted to a centered bottom sheet on mobile.
