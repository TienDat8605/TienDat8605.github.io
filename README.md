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
- You can deploy with GitHub Actions or manually publish from the default branch.
