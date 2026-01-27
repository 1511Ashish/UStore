# UStore Backend Postman + JSON Formats

Base URL
- Local: http://localhost:4000
- All endpoints are prefixed with `/api`

Auth
- Use `Authorization: Bearer <token>` for protected routes.

Common headers
- `Content-Type: application/json`

---

## 1) Health Check
GET `/`

Response 200
```json
{
  "message": "UStore backend running"
}
```

---

## 2) Register (all roles)
POST `/api/auth/register`

Request body
```json
{
  "name": "Ali Khan",
  "email": "ali@example.com",
  "password": "Password@123",
  "role": "seller"
}
```

Notes
- `role` is optional. Allowed: `super_admin`, `seller`, `user`. Default is `user`.

Response 201
```json
{
  "message": "Registered successfully",
  "token": "<jwt>"
}
```

Errors
- 400: Missing fields / invalid role
- 409: Email already registered

---

## 3) Login
POST `/api/auth/login`

Request body
```json
{
  "email": "ali@example.com",
  "password": "Password@123"
}
```

Response 200
```json
{
  "token": "<jwt>"
}
```

Errors
- 401: Invalid credentials

---

## 4) Get Current User
GET `/api/users/me`

Headers
- `Authorization: Bearer <token>`

Response 200
```json
{
  "id": "64f0c2f1c8e3f2a123456789",
  "email": "ali@example.com",
  "role": "seller"
}
```

Errors
- 401: Missing/invalid token

---

## 5) Super Admin Only
GET `/api/users/admin-only`

Headers
- `Authorization: Bearer <token>`

Response 200
```json
{
  "message": "Welcome super admin"
}
```

Errors
- 401: Missing/invalid token
- 403: Not super_admin

---

## 6) Seller Only
GET `/api/users/seller-only`

Headers
- `Authorization: Bearer <token>`

Response 200
```json
{
  "message": "Welcome seller"
}
```

Errors
- 401: Missing/invalid token
- 403: Not seller

---

## 7) Create Product (seller/super_admin)
POST `/api/products`

Headers
- `Authorization: Bearer <token>`

Request body
```json
{
  "name": "Classic Cotton T-Shirt",
  "description": "Soft cotton tee for everyday wear.",
  "price": 599,
  "category": "T-Shirts",
  "brand": "UStore",
  "sku": "TSHIRT-CLASSIC-001",
  "sizes": ["S", "M", "L", "XL"],
  "colors": ["Black", "White"],
  "material": "100% Cotton",
  "gender": "unisex",
  "images": ["https://example.com/images/tshirt-1.jpg"],
  // "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...",
  "stock": 120,
  "discountPercent": 10,
  "tags": ["basic", "cotton"],
  "isActive": true
}
```

Response 201
```json
{
  "_id": "64f0c2f1c8e3f2a123456789",
  "name": "Classic Cotton T-Shirt",
  "price": 599,
  "category": "T-Shirts",
  "sizes": ["S", "M", "L", "XL"],
  "colors": ["Black", "White"],
  "gender": "unisex",
  "stock": 120,
  "discountPercent": 10,
  "isActive": true
}
```

Errors
- 400: Missing fields
- 401/403: Unauthorized/forbidden
- 500: Cloudinary not configured (only if `image` is sent)

---

## 8) List Products
GET `/api/products`

Query params (optional)
- `page`, `limit`
- `search`, `category`, `brand`, `gender`, `size`, `color`, `minPrice`, `maxPrice`, `isActive`

Response 200
```json
{
  "items": [],
  "page": 1,
  "limit": 20,
  "total": 0,
  "pages": 0
}
```

---

## 9) Get Product by ID
GET `/api/products/:id`

Response 200
```json
{
  "_id": "64f0c2f1c8e3f2a123456789",
  "name": "Classic Cotton T-Shirt"
}
```

Errors
- 404: Product not found

---

## 10) Update Product (seller/super_admin)
PUT `/api/products/:id`

Headers
- `Authorization: Bearer <token>`

Request body (any fields)
```json
{
  "price": 549,
  "stock": 100,
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
}
```

Response 200
```json
{
  "_id": "64f0c2f1c8e3f2a123456789",
  "price": 549,
  "stock": 100
}
```

Errors
- 400: Invalid id/data
- 401/403: Unauthorized/forbidden
- 404: Product not found
- 500: Cloudinary not configured (only if `image` is sent)

---

## 11) Delete Product (seller/super_admin)
DELETE `/api/products/:id`

Headers
- `Authorization: Bearer <token>`

Response 200
```json
{
  "message": "Product deleted"
}
```

Errors
- 400: Invalid id
- 401/403: Unauthorized/forbidden
- 404: Product not found

---

## Cloudinary Setup (optional, for image upload)
Set these env vars to enable `image` upload:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- Optional: `CLOUDINARY_FOLDER` (default: `ustore/products`)

## Postman Collection Quick Setup
You can create a Postman collection manually using the above routes. Recommended variables:
- `baseUrl`: `http://localhost:4000`
- `token`: set from login/verify response

Example Postman request config (Login):
- Method: POST
- URL: `{{baseUrl}}/api/auth/login`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "email": "ali@example.com",
  "password": "Password@123"
}
```

Example protected request (Me):
- Method: GET
- URL: `{{baseUrl}}/api/users/me`
- Headers:
  - `Authorization: Bearer {{token}}`
