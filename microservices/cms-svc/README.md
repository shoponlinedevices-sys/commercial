# CMS view-event service

`cms-svc` is an additive NestJS service that stores and reports views using the existing `tbl_view_events` table. It does not run migrations, synchronize entities, or modify database schema. It uses the verified catalog keys `tbl_category.id`, `tbl_brands.brand_id`, and `tbl_product.id` to validate events and resolve names.

## Run locally

From the repository root:

```powershell
Copy-Item microservices\cms-svc\.env.example microservices\cms-svc\.env
# Set the database values in microservices\cms-svc\.env.
pnpm --filter cms-svc build
pnpm --filter cms-svc test
pnpm --filter cms-svc start:dev
```

The service listens for gRPC on port `50057` and exposes `GET http://localhost:3007/health`. Configure the gateway with `CMS_GRPC_URL=localhost:50057`. Database configuration uses `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, and `DB_DATABASE` (`DB_NAME` is accepted as a fallback).

## Gateway API

- `POST /view-events` is public and accepts `entityType`, string `entityId`, optional `visitorId`, `sessionId`, `pageUrl`, and `referrerUrl`. An optional bearer token is validated when present. `userId` is never accepted from the body; it is derived from the signed token. Returns `{ "viewEventId": "..." }`.
- `GET /view-events` requires a valid gateway bearer token and an active `admin` account. Optional filters: `entityType`, `entityId`, `entitySearch`, `from`, `to`, `visitorId`, `sessionId`, `userId`, `page`, and `limit` (maximum 100). Returns `{ "items": [...], "total": "...", "page": 1, "limit": 25 }`.
- `GET /view-events/stats` requires a valid gateway bearer token and an active `admin` account. Optional filters: `entityType`, `from`, and `to`. Returns total views, distinct identified visitors, top entities per type, and daily counts.
- `GET /view-events/stats/entities` requires a valid gateway bearer token and an active `admin` account. Optional filters: `entityType`, `from`, `to`, `page`, and `limit` (maximum 100). Returns paginated totals by entity, including distinct identified visitors for each entity.

Date filters must be ISO 8601 values with a timezone. Query and write operations use parameterized SQL; invalid or missing catalog IDs are rejected. CRM reads require an active account with the existing `tbl_account.role = 'admin'` role. The repository has no rate-limiting module; no new rate-limiting stack is introduced here. Keep gRPC port `50057` on the private service network so the gateway remains the authentication boundary.

The Web App currently has product details and category-filtered product listings but no brand route, so the API and service accept brand events without inventing a new customer-facing brand page. The CRM currently has no dedicated customer-record route; user IDs link to the existing order-derived customer list when a matching record is available.
