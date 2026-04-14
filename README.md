# TekIt Admin Panel — REST API Backend

> Production-ready Node.js + Express + MySQL + JWT backend for the TekIt Admin Panel.

---

## Tech Stack

| Layer        | Technology                                   |
|-------------|----------------------------------------------|
| Runtime     | Node.js (LTS 18+)                            |
| Framework   | Express.js v4                                |
| ORM         | Sequelize v6 + mysql2                        |
| Auth        | JSON Web Tokens (jsonwebtoken + bcryptjs)    |
| Validation  | Joi                                          |
| Logging     | Winston + Morgan                             |
| Security    | Helmet, CORS, express-rate-limit             |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# → Edit .env: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET

# 3. Create MySQL database
mysql -u root -p -e "CREATE DATABASE tekit_admin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 4. Run database migrations
npm run db:migrate

# 5. Seed default super admin + categories
npm run db:seed

# 6. Start development server
npm run dev
# → Server: http://localhost:5000
# → Health: http://localhost:5000/health
```

**Default credentials (after seed):**

```
Email:    admin@tekit.com
Password: Admin@12345
Role:     super_admin
```

---

## Project Structure

```
tekit-backend/
├── .env.example
├── .sequelizerc                  ← Sequelize CLI path config
├── package.json
└── src/
    ├── app.js                    ← Express app (middleware + routes)
    ├── server.js                 ← Entry point (DB + HTTP server)
    ├── config/
    │   ├── config.js             ← Centralized env config
    │   ├── database.js           ← Sequelize connection
    │   └── db.config.js          ← Sequelize CLI config
    ├── models/
    │   ├── index.js              ← Model registry + associations
    │   ├── User.js
    │   ├── Category.js
    │   ├── Blog.js
    │   └── Job.js
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── dashboard.controller.js
    │   ├── blog.controller.js
    │   ├── job.controller.js
    │   └── user.controller.js
    ├── services/
    │   ├── auth.service.js
    │   ├── dashboard.service.js
    │   ├── blog.service.js
    │   ├── category.service.js
    │   ├── job.service.js
    │   └── user.service.js
    ├── routes/
    │   ├── index.js              ← Central router
    │   ├── auth.routes.js
    │   ├── dashboard.routes.js
    │   ├── blog.routes.js
    │   ├── category.routes.js
    │   ├── job.routes.js
    │   └── user.routes.js
    ├── middlewares/
    │   ├── authenticate.js       ← JWT Bearer validation
    │   ├── authorize.js          ← requireRole / requirePermission
    │   ├── validate.js           ← Joi schema factory
    │   ├── errorHandler.js       ← Global error handler
    │   └── requestLogger.js      ← Morgan → Winston
    ├── validators/
    │   ├── auth.validator.js
    │   ├── blog.validator.js
    │   ├── category.validator.js
    │   ├── job.validator.js
    │   └── user.validator.js
    ├── utils/
    │   ├── response.js           ← successResponse / errorResponse
    │   ├── logger.js             ← Winston logger
    │   ├── slug.js               ← Unique slug generator
    │   └── pagination.js         ← Page/limit parser
    ├── migrations/
    │   ├── 20240101000001-create-users.js
    │   ├── 20240101000002-create-categories.js
    │   ├── 20240101000003-create-blogs.js
    │   └── 20240101000004-create-jobs.js
    └── seeders/
        └── 20240101000001-default-admin.js
```

---

## Standard API Response

Every response follows this structure:

```json
{
  "success": true,
  "message": "Human readable message",
  "data": {},
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

`meta` is only present on paginated list endpoints.

---

## API Reference

### Authentication Header

All protected routes require:
```
Authorization: Bearer <your_jwt_token>
```

---

### 1. Auth Module

#### `POST /api/admin/login`
Public endpoint.

**Request body:**
```json
{
  "email": "admin@tekit.com",
  "password": "Admin@12345"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": {
      "id": 1,
      "name": "Super Admin",
      "email": "admin@tekit.com",
      "role": "super_admin",
      "permissions": {
        "blogs": { "view": true, "create": true, "edit": true, "delete": true },
        "jobs":  { "view": true, "create": true, "edit": true, "delete": true }
      },
      "status": "active"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

#### `POST /api/admin/logout` 🔒
Stateless JWT logout — client must discard the token.

**Response 200:**
```json
{
  "success": true,
  "message": "Logout successful. Please discard your token on the client side.",
  "data": null
}
```

---

#### `GET /api/admin/me` 🔒
Returns the currently authenticated user's profile.

```json
{
  "success": true,
  "message": "User profile fetched.",
  "data": {
    "id": 1,
    "name": "Super Admin",
    "email": "admin@tekit.com",
    "role": "super_admin",
    "status": "active",
    "lastLoginAt": "2024-01-15T08:30:00.000Z"
  }
}
```

---

### 2. Dashboard Module

All endpoints are 🔒 protected.

#### `GET /api/dashboard/stats`
```json
{
  "success": true,
  "message": "Dashboard stats fetched.",
  "data": {
    "totalBlogs": 42,
    "totalJobs": 18,
    "totalCategories": 4,
    "totalLocations": 7
  }
}
```

#### `GET /api/dashboard/recent-blogs?limit=5`
Returns last N blog posts with category name.

#### `GET /api/dashboard/recent-jobs?limit=5`
Returns last N job postings.

---

### 3. Blog Module

All endpoints are 🔒 protected + require `blogs.*` permission.

#### `GET /api/blogs` — Permission: `blogs.view`

| Query Param  | Type   | Default | Description                       |
|-------------|--------|---------|-----------------------------------|
| `page`      | int    | 1       | Page number                       |
| `limit`     | int    | 10      | Items per page (max 100)          |
| `search`    | string | –       | Search in title or author         |
| `category_id` | int  | –       | Filter by category ID             |
| `status`    | string | –       | `draft` / `published` / `archived` |

**Response:**
```json
{
  "success": true,
  "message": "Blogs fetched.",
  "data": [
    {
      "id": 1,
      "title": "Getting Started with Node.js",
      "slug": "getting-started-with-node-js",
      "author": "John Doe",
      "date": "2024-01-15",
      "status": "published",
      "featured_image_url": "https://cdn.example.com/image.jpg",
      "summary": "A quick intro...",
      "category": { "id": 1, "name": "Technology", "slug": "technology" },
      "createdAt": "2024-01-15T08:00:00.000Z"
    }
  ],
  "meta": { "total": 42, "page": 1, "limit": 10, "totalPages": 5 }
}
```

#### `GET /api/blogs/:id` — Permission: `blogs.view`

#### `POST /api/blogs` — Permission: `blogs.create`
```json
{
  "title": "My First Blog Post",
  "category_id": 1,
  "author": "Jane Doe",
  "date": "2024-01-20",
  "featured_image_url": "https://cdn.example.com/image.jpg",
  "summary": "A brief summary of the post.",
  "content": "<h2>Introduction</h2><p>Full HTML content...</p>",
  "status": "published"
}
```
> **Note:** `slug` is **auto-generated** from the title and guaranteed unique.

#### `PUT /api/blogs/:id` — Permission: `blogs.edit`
Same fields as POST — all optional, minimum 1 field required. If `title` changes, slug is auto-regenerated.

#### `DELETE /api/blogs/:id` — Permission: `blogs.delete`
Performs a **soft delete** (sets `deletedAt`, record remains in DB).

---

### 4. Category Module

| Method   | Endpoint              | Permission     |
|----------|-----------------------|----------------|
| `GET`    | `/api/categories`     | Any auth       |
| `GET`    | `/api/categories/:id` | Any auth       |
| `POST`   | `/api/categories`     | `blogs.create` |
| `PUT`    | `/api/categories/:id` | `blogs.edit`   |
| `DELETE` | `/api/categories/:id` | `blogs.delete` |

**POST body:**
```json
{
  "name": "Machine Learning",
  "description": "Articles on AI and ML topics"
}
```

---

### 5. Job Posting Module

All endpoints are 🔒 protected + require `jobs.*` permission.

#### `GET /api/jobs` — Permission: `jobs.view`

| Query Param | Type   | Description                                            |
|------------|--------|--------------------------------------------------------|
| `search`   | string | Search in title or location                            |
| `location` | string | Filter by location (partial match)                    |
| `job_type` | string | `full-time` / `part-time` / `remote` / `contract` / `internship` |
| `status`   | string | `active` / `closed` / `draft`                         |
| `page`, `limit` | int | Pagination                                       |

#### `POST /api/jobs` — Permission: `jobs.create`
```json
{
  "title": "Senior Node.js Developer",
  "experience": "3-5 years",
  "location": "Bangalore, India",
  "notice_period": "30 days",
  "job_type": "full-time",
  "description": "<p>We are looking for a passionate Node.js developer...</p>",
  "mandatory_skills": ["Node.js", "Express.js", "MySQL", "REST APIs"],
  "good_to_have_skills": ["Docker", "AWS", "Redis"],
  "responsibilities": [
    "Design and build scalable REST APIs",
    "Participate in code reviews",
    "Write unit and integration tests"
  ],
  "benefits": [
    "Health insurance",
    "Flexible work hours",
    "Remote work option"
  ],
  "status": "active"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Job posting created successfully.",
  "data": {
    "id": 5,
    "title": "Senior Node.js Developer",
    "job_type": "full-time",
    "location": "Bangalore, India",
    "mandatory_skills": ["Node.js", "Express.js", "MySQL", "REST APIs"],
    ...
  }
}
```

#### `PUT /api/jobs/:id` — Permission: `jobs.edit`
#### `DELETE /api/jobs/:id` — Permission: `jobs.delete` (soft delete)

---

### 6. User Management Module

> **All endpoints restricted to `super_admin` role only.**

#### `GET /api/users`
#### `GET /api/users/:id`

#### `POST /api/users`
```json
{
  "name": "John Admin",
  "email": "john@tekit.com",
  "password": "SecurePass@123",
  "role": "admin",
  "permissions": {
    "blogs": { "view": true, "create": true, "edit": true, "delete": false },
    "jobs":  { "view": true, "create": false, "edit": false, "delete": false }
  },
  "status": "active"
}
```

#### `PUT /api/users/:id`
Same as POST, all fields optional (min 1). Only `super_admin` can change `role`.

#### `DELETE /api/users/:id`
Soft delete. Cannot delete your own account.

---

## RBAC Permission Matrix

| Role         | blogs.view | blogs.create | blogs.edit | blogs.delete | jobs.* | Manage Users |
|-------------|:----------:|:------------:|:----------:|:------------:|:------:|:------------:|
| `super_admin` | ✅        | ✅           | ✅         | ✅           | ✅     | ✅           |
| `admin`       | Per JSON permissions assigned by super_admin              | ❌           |

---

## Database Schema

```sql
-- users
CREATE TABLE users (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(100) NOT NULL,
  email        VARCHAR(150) NOT NULL UNIQUE,
  password     VARCHAR(255) NOT NULL,
  role         ENUM('super_admin','admin') DEFAULT 'admin',
  permissions  JSON,
  status       ENUM('active','inactive') DEFAULT 'active',
  last_login_at DATETIME,
  created_at   DATETIME,
  updated_at   DATETIME,
  deleted_at   DATETIME   -- soft delete
);

-- categories
CREATE TABLE categories (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL UNIQUE,
  slug        VARCHAR(120) NOT NULL UNIQUE,
  description TEXT,
  created_at  DATETIME,
  updated_at  DATETIME,
  deleted_at  DATETIME
);

-- blogs
CREATE TABLE blogs (
  id                 INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title              VARCHAR(255) NOT NULL,
  slug               VARCHAR(280) NOT NULL UNIQUE,
  category_id        INT UNSIGNED REFERENCES categories(id),
  author             VARCHAR(100) NOT NULL,
  date               DATE NOT NULL,
  featured_image_url VARCHAR(500),
  summary            TEXT,
  content            LONGTEXT NOT NULL,
  status             ENUM('draft','published','archived') DEFAULT 'draft',
  created_at         DATETIME,
  updated_at         DATETIME,
  deleted_at         DATETIME
);

-- jobs
CREATE TABLE jobs (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title               VARCHAR(255) NOT NULL,
  experience          VARCHAR(100),
  location            VARCHAR(150),
  notice_period       VARCHAR(100),
  job_type            ENUM('full-time','part-time','remote','contract','internship'),
  description         LONGTEXT NOT NULL,
  mandatory_skills    JSON,
  good_to_have_skills JSON,
  responsibilities    JSON,
  benefits            JSON,
  status              ENUM('active','closed','draft') DEFAULT 'active',
  created_at          DATETIME,
  updated_at          DATETIME,
  deleted_at          DATETIME
);
```

---

## NPM Scripts

| Command                 | Description                                 |
|------------------------|---------------------------------------------|
| `npm run dev`          | Start with nodemon (hot reload)             |
| `npm start`            | Production start                            |
| `npm run db:migrate`   | Run all pending migrations                  |
| `npm run db:migrate:undo` | Rollback all migrations                  |
| `npm run db:seed`      | Seed default super admin + categories       |
| `npm run db:seed:undo` | Rollback seed data                          |
| `npm run db:reset`     | Full reset: undo → migrate → seed           |

---

## Error Responses

| HTTP Status | Scenario                              |
|-------------|---------------------------------------|
| 400         | Bad request / self-delete attempt     |
| 401         | Missing/invalid/expired JWT           |
| 403         | Insufficient role or permission       |
| 404         | Resource not found                    |
| 409         | Duplicate email or slug conflict      |
| 422         | Joi validation failure                |
| 429         | Rate limit exceeded                   |
| 500         | Internal server error                 |

**Validation error example (422):**
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    { "field": "email", "message": "Please provide a valid email address." },
    { "field": "password", "message": "Password must be at least 6 characters." }
  ]
}
```
