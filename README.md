# AB@Affiliate - Full-Stack Affiliate Product Management System

AB@Affiliate is a full-stack project with:
- **Backend**: Node.js + Express + MongoDB + Mongoose
- **Frontend**: Vanilla HTML, CSS, JavaScript (Admin + Store)

## Folder Structure

```text
/backend
  ├─ models/Product.js
  ├─ routes/productRoutes.js
  ├─ uploads/
  ├─ .env.example
  ├─ package.json
  └─ server.js
/frontend
  ├─ admin.html
  ├─ index.html
  ├─ product.html
  ├─ css/styles.css
  └─ js/
      ├─ admin.js
      ├─ config.js
      ├─ product.js
      └─ store.js
```

## Backend Features

### Product schema
Each product has:
- `name` (string)
- `price` (number)
- `image` (string URL)
- `description` (string)
- `category` (string)
- `affiliateLink` (string)
- `createdAt` (date)

### REST API Endpoints
- `POST /api/products` → Add product (supports image file upload or image URL)
- `GET /api/products` → Get all products
- `GET /api/products/:id` → Get single product
- `PUT /api/products/:id` → Update product
- `DELETE /api/products/:id` → Delete product

### Image Upload
- Uses `multer`
- Saves image files to `/backend/uploads`
- Stores generated file URL in MongoDB

## Frontend Features

### Admin Dashboard (`frontend/admin.html`)
- Add product form
- Product listing
- Edit product (loads selected product into form)
- Delete product
- Uses `fetch()` for API calls
- Basic validation and error/success alerts

### Store Pages
- `frontend/index.html`: product grid with View Details + Buy Now
- `frontend/product.html`: single product detail + Buy Now redirect to affiliate link

## Run Locally

### 1) Start MongoDB
Make sure MongoDB is running locally (example URI is already set to localhost).

### 2) Start Backend API
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Backend default URL: `http://localhost:5000`

### 3) Start Frontend
Open another terminal and run any static server in `/frontend`.

Example using Python:
```bash
cd frontend
python3 -m http.server 5500
```

Then open:
- Store: `http://localhost:5500/index.html`
- Admin: `http://localhost:5500/admin.html`

> If backend is hosted elsewhere, update `frontend/js/config.js`.
