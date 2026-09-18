# SisVentas — Panel

Frontend for the [SisVentas API](https://github.com/matosr96/sisventas-api): a small point of sale
with a product catalog, supplier purchases, sales with invoices, a stock ledger and user management.

Like the API, this is a **personal project** and a reference implementation of one specific way of
building a frontend: a one-way dependency chain, one file per operation, a closed dependency list,
component-scoped CSS driven by design tokens with light and dark themes, and every screen covering
its loading, error, empty and data states.

> Code is in English; the interface, comments and internal docs are in Spanish.

## What it does

- **Sign in** with the API's JWT; roles `USER` (seller) and `ADMIN` drive both the menu and the routes.
- **Home**: today's sales and takings compared with yesterday, low-stock count, this month's purchases,
  plus the low-stock list and the latest invoices.
- **Products**: catalog with SKU, prices and stock as a sortable table with status badges and filter
  chips (status, category); a detail page with the **stock ledger** and manual adjustments with a
  mandatory reason. Stock is never edited by hand.
- **Categories** and **suppliers**: plain CRUD; suppliers with purchases are deactivated, not deleted.
- **Sales**: a **point-of-sale screen** — product tiles with stock badges, search by SKU or name
  (Enter adds the product, barcode-scanner friendly), category chips and a sticky order panel with
  quantity steppers and the estimated total. The server freezes prices and computes the total; the
  detail shows the line items, the **invoice PDF** and voiding (admin).
- **Purchases**: the same layout, with the supplier and the unit cost paid per line (prefilled with the
  last known cost); voiding returns the units.
- **Users** (admin): create, assign role, activate or deactivate. **Profile**: change own password.
- Light and dark themes, following the system by default.

### Interface conventions

The panel follows the patterns that current admin and POS products share (Shopify admin and POS,
Square, Carbon and Atlassian design guidelines), without any UI library:

- Tables: sticky header, click-to-sort columns, right-aligned tabular figures, status **badges**,
  always-visible row actions, page size selector and a result range.
- Every list has four states — **skeleton** while loading, an error notice, an empty state with a
  call to action, and a distinct **"no results"** state that clears the search and filters.
- Short forms open in a centered modal; long ones (product, user) in a **side drawer** that keeps the
  list visible.
- Document pages put the status badge next to the number and the actions in the header, with the
  totals block aligned to the right.
- Design tokens in `src/styles.css`: a 14px base, small radius for controls and a larger one for
  surfaces, semantic accents (blue action, green ok, amber warning, red danger) defined for both themes.

## Quick start

Requires Node 24 and pnpm 10, and the API running at `http://localhost:8080/api/v1`
(see the API's README: `docker compose up -d db`, migrate, `./mvnw spring-boot:run`).

```bash
pnpm install
pnpm start          # http://localhost:4200
```

The API base URL lives in `src/app/api/api-config.ts` and is changed by commenting lines: there are
no environment variables. Sign in with any user created through the API's `/auth/signup`; grant
`ADMIN` in the `users_roles` table to see purchases, suppliers and users.

## Stack

Angular 22 (standalone components, signals, zoneless) · TypeScript · `HttpClient` · Router ·
component styles with CSS custom properties. No UI, forms, charts, icons or state libraries: the
dependency list is closed on purpose. Icons come from boxicons over a CDN.

Gate: `pnpm lint && pnpm build`. There are no tests by design.

## Architecture

```
src/app/
├── api/            base URL, auth interceptor (token + 401), QueryClient (resource registry)
├── services/       one @Injectable per API resource — the only place that touches HttpClient
├── entities/       interfaces, DTOs and empty states
├── store/          AuthStore and UiStore (persisted signals)
├── operations/     one function per operation: the unit of business logic on the client
├── pages/          one folder per screen, with create/ update/ detail/ new/ subfolders
├── components/     layout, sidebar, shared kit (generic) and container kit (domain)
├── guards/         authGuard, roleGuard(...roles)
├── constants/      routes, screen names, resource keys, error messages
└── utils/          formatting and error translation
```

The dependency chain runs one way: **page → operation → (service | store) → HttpClient**. Pages never
call the API; operations never know URLs; services never show toasts. Server state is an Angular
`resource` registered in a small `QueryClient`, so a mutation invalidates every screen showing that
resource by key — the key is the API resource name.

## Contract with the API

| Operation | Request | Response |
| --- | --- | --- |
| List | `GET /<resource>?limit=100` | `{ count, page, pages, items }` |
| Read | `GET /<resource>/{id}` | entity |
| Create | `POST /<resource>` | created entity |
| Update | `PUT /<resource>/{id}` | updated entity |
| Delete | `DELETE /<resource>/{id}` | 204 |
| Sign in | `POST /auth/signin` `{ username, password }` | `{ accessToken, tokenType, user }` |

Errors arrive as `{ "message": "<code>" }` and are translated to Spanish in one place
(`constants/error-messages.ts`). The stock ledger is the one list paginated server-side.

## Still out of scope

- **Deployment**: it runs locally against the local API.
- **Reports and charts** beyond the home summary.
- **Editing a sale or purchase date** after registration (the API allows it; the panel does not expose it yet).

## License

MIT — see [LICENSE](LICENSE).
