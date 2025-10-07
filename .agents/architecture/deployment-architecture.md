# Deployment Architecture

## Deployment Strategy

**Frontend Deployment:**

- **Platform:** Vercel
- **Build Command:** npm run build
- **Output Directory:** dist
- **CDN/Edge:** Vercel Edge Network

**Backend Deployment:**

- **Platform:** N/A
- **Build Command:** N/A
- **Deployment Method:** N/A

## CI/CD Pipeline

```yaml
name: CI/CD Pipeline
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16.x'
      - run: npm ci
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16.x'
      - run: npm ci
      - run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Environments

| Environment | Frontend URL                              | Backend URL | Purpose                |
| ----------- | ----------------------------------------- | ----------- | ---------------------- |
| Development | http://localhost:3000                     | N/A         | Local development      |
| Staging     | https://staging.wine-explorer.example.com | N/A         | Pre-production testing |
| Production  | https://wine-explorer.example.com         | N/A         | Live environment       |
