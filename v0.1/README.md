# ShaadiMe Landing

Deploy-ready Next.js landing page for ShaadiMe.

## Stack

- Next.js 16
- React 19
- TypeScript
- Framer Motion

## Local Development

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Checks

```bash
npm run lint
npm run build
```

## Deploy to Vercel

This folder is ready to be imported directly into Vercel.

### Option 1: Push to GitHub and import

1. Create a new GitHub repository.
2. Push this folder as the repository root.
3. In Vercel, click `Add New Project`.
4. Import the GitHub repository.
5. Keep the default framework setting as `Next.js`.
6. Deploy.

### Option 2: Use Vercel CLI

```bash
npm i -g vercel
vercel
```

## Notes

- Remote images are configured as `unoptimized` to avoid local optimizer issues with external image hosts.
- Hero background videos live in `public/landing-videos/`.
- No environment variables are required for deployment.
