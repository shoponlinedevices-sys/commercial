# crm-mobile

Native iOS/Android CRM app built with Expo and React Native. This is a separate app from the customer shopping app in `mobile/frontend`; it calls the existing Gateway endpoints used by the CRM website and does not add or change backend routes.

## Run locally

```powershell
cd mobile\frontend\crm-mobile
pnpm install --ignore-workspace
pnpm start
```

Use the Expo terminal shortcuts or `pnpm android` / `pnpm ios` to open a device or simulator. The project requires the Expo SDK 54 toolchain and a working Android or iOS development environment.

The API base defaults to `https://api.thegioithietbi.online`. To point it at another Gateway, set `EXPO_PUBLIC_GATEWAY_URL` before starting Expo, for example:

```powershell
$env:EXPO_PUBLIC_GATEWAY_URL = "http://192.168.1.10:4000"
pnpm start
```

CRM access and refresh tokens are stored with AsyncStorage. The app uses the same `/auth`, `/orders`, `/products`, `/inventory`, `/suppliers`, `/product-costs`, `/view-events`, `/history-logs`, `/user-profile`, and `/feature-settings` APIs as the web CRM. Supplier and purchase-cost sections remain restricted to users whose API profile role is `admin`.

## Included CRM areas

- Dashboard metrics, recent orders, live/hourly online presence, and shared Excel reports
- Order search, status updates, creation, and customer summaries
- Product listing and creation
- Inventory metrics and import, adjustment, reserve, release, sale, and return actions
- Admin supplier management and purchase-cost records
- View-event filters/statistics/history, activity log, profile, feature settings, and help

The layout uses native mobile controls; it is not an embedded copy of the CRM website.
