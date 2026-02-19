# Deployment Guide to Vercel

his guide explains how to deploy your solar-server backend to Vercel.

## Prerequisites

- [Vercel Account](https://vercel.com/)
- [Vercel CLI](https://vercel.com/docs/cli) (optional, but recommended)
- Your MongoDB connection string

## Environment Variables

You must set the following environment variables in your Vercel project settings:

- \`MONGODB_URI\`: Your MongoDB connection string.
- \`JWT_SECRET\`: Your JWT secret key.
- \`PORT\`: (Optional, Vercel handles this, but good to have)
- Any other variables from your local \`.env\` file.

## Deployment Steps

### Option 1: Git Integration (Recommended)

1. Push your changes to GitHub.
2. Go to Vercel Dashboard and "Add New Project".
3. Import your GitHub repository.
4. Vercel should automatically detect the settings.
5. **IMPORTANT:** Go to "Environment Variables" section and add all your secrets from \`.env\`.
6. Click "Deploy".

### Option 2: Vercel CLI

1. Install Vercel CLI: \`npm i -g vercel\`
2. Run \`vercel login\`.
3. Run \`vercel\` inside your project folder.
4. Follow the prompts.
5. Set environment variables using \`vercel env add\`.

## Verification

After deployment:
1. Check the Vercel dashboard for build logs.
2. Access your API at \`https://your-project-name.vercel.app/api/health\` (if you have a health check) or try a login endpoint.
3. Ensure the functionality mirrors your local setup.

## Troubleshooting

- **504 Gateway Timeout:** Your function might be taking too long. Check MongoDB connection latency.
- **Connection Error:** Ensure IP whitelist in MongoDB Atlas allows access from everywhere (0.0.0.0/0) since Vercel IPs are dynamic.
