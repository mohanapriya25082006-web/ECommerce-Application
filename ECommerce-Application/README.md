# Northstar E-Commerce Application

Full-stack demo store: React + Vite frontend, Java 21 / Spring Boot REST API, MySQL, JWT authentication, Admin/User roles, product management, cart, checkout with Cash on Delivery, and order tracking.

## Requirements
- JDK 21
- Node.js 20+
- MySQL 8+
- Maven 3.9+ (or use IntelliJ's Maven integration)
- VS Code (Extension Pack for Java recommended)

## 1. Database
Start MySQL and run `database/ecommerce.sql` in MySQL Workbench. The default connection is `localhost:3306`, user `root`, blank password. Set environment variables `DB_USERNAME` and `DB_PASSWORD` if yours differ.

## 2. Backend
Open a terminal in `backend`:
```powershell
mvn spring-boot:run
```
Backend runs at http://localhost:8080. If Maven is not installed, install Apache Maven 3.9+ and add its `bin` folder to PATH, or open `backend/pom.xml` in IntelliJ and run `EcommerceApplication`.

Spring Boot creates the tables automatically. It seeds sample products and this demo administrator:
- Email: `admin@shop.com`
- Password: `Admin@123`

Change the demo admin password and JWT secret before any public deployment. The admin account is for local demonstration only.

## 3. Frontend
Open a second terminal in `frontend`:
```powershell
npm install
npm run dev
```
Open http://localhost:5173.

## 4. Try the application
- Register a normal customer at `/register`.
- Browse products, add to cart, and place an order using COD.
- View order history at `/orders`.
- Sign in as the demo administrator and open `/admin` to create products and update order statuses.

## API overview
- `POST /api/auth/register`, `POST /api/auth/login`
- `GET /api/products`, `GET /api/products/{id}`
- `POST /api/orders`, `GET /api/orders`
- Admin: `/api/admin/products` (GET/POST), `/api/admin/products/{id}` (PUT/DELETE), `/api/admin/orders`, `/api/admin/orders/{id}/status`

## Notes / production hardening
This is a runnable learning project, not a production payment or fulfillment platform. COD only; no card details are collected. Before deployment add HTTPS, secret management, rate limiting, robust DTO validation, pagination, image upload/storage, audit logging, transactional order creation, inventory locking, email notifications, and tests. Configure allowed CORS origins for your deployed frontend. Admin role is seeded locally; never expose the demo credentials publicly.
