# Meena B Delights (Next.js)

This project now supports:

- Admin product listings stored in MongoDB Atlas.
- Product images uploaded to Cloudinary.
- Customer product pages reading from MongoDB-backed API data.

## 1) Environment Setup

Create a `.env.local` file in the project root:

```bash
# Admin login
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password

# MongoDB Atlas
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority&appName=<app-name>
MONGODB_DB_NAME=meena_b

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Restart the dev server after any env change.

## 2) MongoDB Atlas Setup

1. Create a cluster in MongoDB Atlas.
2. Create a database user and set username/password.
3. In Network Access, allow your IP (or `0.0.0.0/0` temporarily for testing).
4. Copy the connection string and set `MONGODB_URI`.
5. Set `MONGODB_DB_NAME` (default used by app: `meena_b`).

The app creates a `products` collection automatically and seeds initial products if the collection is empty.

## 3) Cloudinary Setup

1. Create a Cloudinary account.
2. From Dashboard, copy Cloud Name, API Key, and API Secret.
3. Add them to `.env.local`.

When admin uploads product images, files are sent to Cloudinary and the returned secure URL is stored in MongoDB.

## 4) Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## 5) Admin Product Flow

1. Login from `/admin/login`.
2. In Product Management:
	- Add a product with text fields.
	- Choose an image file to upload.
3. Product text data is stored in MongoDB Atlas.
4. Product image is stored in Cloudinary, and its URL is saved in MongoDB.
5. Customer pages (`/` and `/products`) read catalog data from MongoDB via API.

## 6) Deploy on Vercel

1. Push this repository to GitHub.
2. In Vercel, click **Add New Project** and import the repo.
3. If the repository root is `Food_Del`, set **Root Directory** to `Meena-B`.
4. Framework preset: **Next.js** (auto-detected).
5. In **Project Settings > Environment Variables**, add:
	- `ADMIN_USERNAME`
	- `ADMIN_PASSWORD`
	- `MONGODB_URI`
	- `MONGODB_DB_NAME`
	- `CLOUDINARY_CLOUD_NAME`
	- `CLOUDINARY_API_KEY`
	- `CLOUDINARY_API_SECRET`
6. Deploy.

### Vercel Config Included

- `vercel.json` is configured in this folder for install/build/dev commands.
- `.vercelignore` excludes local artifacts, logs, and test scripts from deployment context.

### Production Allowlists

- In MongoDB Atlas **Network Access**, allow Vercel egress IPs (or temporarily `0.0.0.0/0` for testing).
- In Cloudinary, confirm the account/API key is active for your production environment.

### Security Rotation Checklist

- Rotate any MongoDB and Cloudinary credentials that were previously exposed.
- Replace old values in Vercel environment variables with new rotated credentials.
- Keep `.env.local` out of git (already ignored).

## 7) Production Build Test

Run before deploying:

```bash
npm run build
```
