# TienDat Portfolio Website

Personal portfolio site built with React, TypeScript, Vite, Tailwind CSS, and shadcn/ui components.

## Tech Stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS
- shadcn/ui + Radix UI
- Vitest + Playwright

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Build production bundle:

```bash
npm run build
```

4. Preview production build:

```bash
npm run preview
```

## Tests

Run unit tests:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Deployment Notes

This repository is intended for GitHub Pages at `https://tiendat8605.github.io/`.

- For a user site repository (`<username>.github.io`), keep the Vite base path as `/`.
- Deploy the contents of the production build output from `dist/`.
- This repo includes an automatic deployment workflow at `.github/workflows/deploy-pages.yml`.

## GitHub Pages Setup

1. Open repository settings on GitHub.
2. Go to **Pages**.
3. In **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Select branch **gh-pages** and folder **/(root)**.
4. Push to `main` (or run the workflow manually from the Actions tab).
5. Wait for the `Deploy to GitHub Pages` workflow to finish.

If the site still does not load, verify:

- The workflow run succeeded in the **Actions** tab.
- Pages is set to branch **gh-pages** at **/(root)**.
- You are opening `https://tiendat8605.github.io/` exactly.
