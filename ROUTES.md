# Route Structure

## Public Routes
These routes are accessible without authentication and include the Navigation component.

- **`/`** - Home page (public)
- **`/sign-up`** - Registration page (public)
- **`/sign-in`** - Sign in page (public) - *Note: Page needs to be created*

## Private Routes
These routes require authentication (protected with `withAuth` HOC) and do NOT include the Navigation component. They have their own header/navigation.

- **`/dashboard`** - Dashboard page (private, protected)
  - Has its own header with user info and logout button
  - Protected by `withAuth` HOC in `app/dashboard/layout.tsx`

## Route Protection

### Public Routes
- Use `PublicLayout` component which conditionally renders `Navigation` component
- Navigation is excluded for dashboard routes (routes starting with `/dashboard`)

### Private Routes
- Protected using `withAuth` Higher Order Component (HOC)
- Located in `@/components/withAuth.tsx`
- Checks Redux auth state (initialized from localStorage)
- Redirects to `/sign-in` if user is not authenticated
- Dashboard has its own header and does not use the public Navigation component

## File Structure

```
app/
├── layout.tsx          # Root layout (includes App and PublicLayout)
├── PublicLayout.tsx    # Conditionally renders Navigation for public routes
├── App.tsx            # Redux Provider wrapper
├── page.tsx           # Home page (public)
├── sign-up/
│   └── page.tsx       # Registration page (public)
└── dashboard/
    ├── layout.tsx     # Dashboard layout (protected, has own header)
    └── page.tsx       # Dashboard page (protected)
```

## Navigation Component
- Located in `@/components/Navigation.tsx`
- Only rendered for public routes (excluded for `/dashboard/*`)
- Contains links to: Home, Sign In, Sign Up

