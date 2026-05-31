# Commercial Web Application

A modern e-commerce web application built with Next.js 14, React, TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

- **Authentication**: Login and register functionality with JWT token management
- **Product Catalog**: Browse products with search and category filtering
- **Product Details**: View detailed product information
- **Shopping Cart**: Add, remove, and manage cart items
- **Order Management**: Create and view orders
- **Notifications**: View and manage notifications
- **User Account**: Profile management and quick actions

## Architecture

This web application connects to the existing microservices architecture:

- **API Gateway** (port 3000): Main entry point for all API calls
- **Auth Service** (port 3006): Authentication and user management
- **Products Service** (port 3003): Product catalog
- **Sales Service** (port 3001): Orders management
- **Notification Service** (port 3002): Notifications
- **Orders Service** (port 3005): Cart management

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (custom implementation)
- **Icons**: Lucide React
- **State Management**: React Context API
- **HTTP Client**: Native Fetch API with custom wrapper

## Project Structure

```
web/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── login/             # Login/Register page
│   │   ├── products/          # Product catalog and details
│   │   ├── cart/              # Shopping cart
│   │   ├── orders/            # Order history
│   │   ├── notifications/     # Notifications
│   │   ├── account/           # User account
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page (redirect)
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── label.tsx
│   │   │   └── toast.tsx
│   │   └── Navigation.tsx     # Main navigation component
│   ├── context/
│   │   └── AuthContext.tsx    # Authentication context
│   ├── services/
│   │   ├── auth.service.ts    # Authentication API
│   │   ├── product.service.ts # Product API
│   │   ├── cart.service.ts    # Cart API
│   │   ├── order.service.ts   # Order API
│   │   └── notification.service.ts # Notification API
│   ├── lib/
│   │   ├── api-client.ts      # HTTP client wrapper
│   │   ├── api-config.ts      # API configuration
│   │   └── utils.ts           # Utility functions
│   └── types/
│       └── index.ts           # TypeScript type definitions
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── next.config.js
└── .eslintrc.json
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Microservices running (gateway on port 3000, auth on 3006, etc.)

### Installation

1. Install dependencies:
```bash
cd web
npm install
```

2. Configure environment variables (optional):
Create a `.env.local` file in the web directory:
```env
NEXT_PUBLIC_GATEWAY_URL=http://localhost:3000
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:3006
NEXT_PUBLIC_PRODUCTS_SERVICE_URL=http://localhost:3003
NEXT_PUBLIC_SALES_SERVICE_URL=http://localhost:3001
NEXT_PUBLIC_NOTIFICATION_SERVICE_URL=http://localhost:3002
NEXT_PUBLIC_ORDERS_SERVICE_URL=http://localhost:3005
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## API Integration

The application uses the API Gateway as the primary endpoint. All API calls are routed through:

- **Base URL**: `http://localhost:3000` (configurable via environment variables)
- **Authentication**: JWT Bearer tokens stored in localStorage
- **Endpoints**:
  - `POST /auth/login` - User login
  - `POST /auth/register` - User registration
  - `GET /products` - Get products list
  - `GET /products/:id` - Get product details
  - `GET /cart/by-user-id/:userId` - Get user cart
  - `POST /cart` - Add item to cart
  - `DELETE /cart/lines/:id` - Remove cart item
  - `POST /orders` - Create order
  - `GET /orders/user/:userId` - Get user orders
  - `GET /notifications/user/:userId` - Get user notifications

## Features Overview

### Authentication
- Login with username and password
- Registration for new users
- JWT token management (access and refresh tokens)
- Automatic token refresh
- Logout functionality

### Product Catalog
- Grid view of all products
- Search functionality
- Category filtering
- Product cards with images, prices, and badges
- Add to cart directly from catalog

### Product Details
- Full product information display
- Large product image
- Price comparison (current vs old price)
- Product specifications (SKU, unit, MOQ)
- Add to cart functionality

### Shopping Cart
- View all cart items
- Update quantities
- Remove items
- Clear entire cart
- Calculate total
- Checkout to create order

### Orders
- View order history
- Order status badges
- Order details (items, total, date)
- Shipping address

### Notifications
- View all notifications
- Mark as read functionality
- Unread badge indicator

### User Account
- Profile information display
- Quick action buttons
- Logout functionality

## Design System

The application uses a modern design system with:

- **Color Palette**: Blue primary color scheme with dark mode support
- **Typography**: Inter font family
- **Components**: shadcn/ui inspired components
- **Spacing**: Consistent spacing using Tailwind utilities
- **Responsive**: Mobile-first responsive design

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting (recommended)
- Tailwind CSS for styling

### Component Guidelines

- Use functional components with hooks
- Implement proper TypeScript types
- Follow React best practices
- Keep components small and focused
- Use composition over inheritance

## Troubleshooting

### Common Issues

1. **API Connection Errors**: Ensure all microservices are running
2. **CORS Errors**: Check gateway CORS configuration
3. **Authentication Failures**: Verify JWT token handling
4. **Build Errors**: Clear `.next` folder and rebuild

## Future Enhancements

- Payment method integration
- Delivery address management
- Order tracking
- Product reviews and ratings
- Wishlist functionality
- Advanced search and filters
- Admin dashboard
- Analytics dashboard

## License

This project is part of the Commercial e-commerce system.
