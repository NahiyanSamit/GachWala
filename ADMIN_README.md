# Gachwala Admin Panel

## Overview
The admin panel allows administrators to manage the Gachwala e-commerce platform, including products, categories, and orders.

## Access

**Admin Login URL:** `http://localhost:3000/admin/login` (or `gachwala.com/admin` in production)

### Default Admin Credentials
- **Email:** admin@gachwala.com
- **Password:** admin123

⚠️ **Important:** Change the password after first login!

## Features

### 1. Category Management
- Add new categories
- Edit existing categories
- Delete categories
- View all categories in a table format

### 2. Product Management
- Add new products with details:
  - Name
  - Description (info)
  - Image URL
  - Category
  - Price
  - Stock quantity
  - Rating
  - Sale status (on/off)
- Edit existing products
- Delete products
- View all products in a table with images

### 3. Order Management
- View all orders
- Filter orders by status:
  - All
  - Pending
  - Processing
  - Shipped
  - Delivered
  - Cancelled
- View detailed order information:
  - Customer details
  - Shipping address
  - Order items
  - Price breakdown (subtotal, shipping, delivery fees, total)
  - Payment method
- Approve/Process pending orders
- Cancel orders
- Mark orders as shipped
- Mark orders as delivered

### 4. Dashboard Statistics
- Total Products count
- Total Categories count
- Pending Orders count
- Total Orders count

## Setup

### Creating Admin User

Run the following command in the server directory:

```bash
cd server
node createAdmin.js
```

This will create a default admin user with:
- Email: admin@gachwala.com
- Password: admin123

### Backend Routes

All admin routes are protected and require authentication with an admin token.

**Base URL:** `/api/admin`

#### Authentication
- POST `/api/admin/login` - Admin login

#### Orders
- GET `/api/admin/orders` - Get all orders
- PATCH `/api/admin/orders/:id/status` - Update order status

#### Categories
- POST `/api/admin/categories` - Create category
- PUT `/api/admin/categories/:id` - Update category
- DELETE `/api/admin/categories/:id` - Delete category

#### Products
- POST `/api/admin/products` - Create product
- PUT `/api/admin/products/:id` - Update product
- DELETE `/api/admin/products/:id` - Delete product

## Security

- Admin panel uses JWT authentication
- Admin token is stored in localStorage as `adminToken`
- All admin routes are protected with `adminAuth` middleware
- Separate authentication system from regular users

## Usage

1. Navigate to `/admin/login`
2. Login with admin credentials
3. Access the dashboard
4. Use the tabs to manage:
   - Products
   - Categories
   - Orders

## Order Status Flow

1. **Pending** → Initial status when order is placed
2. **Processing** → Admin approves and starts processing
3. **Shipped** → Order is shipped to customer
4. **Delivered** → Order is delivered successfully
5. **Cancelled** → Order is cancelled (can be done from pending status)

## Notes

- The admin panel is fully responsive and works on all devices
- Real-time updates after any CRUD operation
- User-friendly interface with color-coded status indicators
- Confirmation dialogs for delete operations
