# Job Scout Pro

Job Scout Pro is a browser-based dashboard for reviewing and organizing freelance job opportunities. It provides a sample job-tracking workflow with proposal, status, filtering, and portfolio tools.

## Live Demo

> **Live Demo:** https://job-scout-pro-silk.vercel.app/

## Overview

Job Scout Pro brings a job review workflow into one interface: users can inspect sample freelance listings, organize their status and notes, review proposal text, and configure job-search criteria. The project currently runs entirely on the client and uses bundled sample data to demonstrate the workflow.

The current scope is a front-end prototype. It does not fetch live listings, connect to a backend, or call an external AI service. The proposal preview is a generated sample, and PDF/DOCX portfolio extraction is simulated; plain-text portfolio files can be read in the browser.

## Features

- Dashboard with sample freelance job listings, proposal ratios, budgets, statuses, notes, and summary cards.
- Table and card views, configurable visible columns, status/budget/proposal-ratio filters, and CSV export.
- Job status updates and editable notes and proposal text.
- Job-search filter controls for platform, keywords, budget, geography, invite status, proposal count, hiring rate, client verification, and rating. Filter settings are saved in browser storage.
- Portfolio text entry and file upload interface for PDF, DOCX, and TXT files, with a portfolio preview.
- Configurable proposal prompt with save and copy actions, a model selector, and a sample proposal preview.
- Weekly activity view, light/dark theme toggle, and browser-storage persistence for selected preferences and portfolio settings.

## Technology

- React 18 and TypeScript
- Vite
- React Router
- TanStack Query
- Tailwind CSS
- Radix UI primitives and reusable shadcn-style components
- Lucide React icons
- date-fns

## Project Structure

```text
job-scout-pro/
├── public/
│   ├── favicon.svg
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   ├── filters/
│   │   ├── layout/
│   │   ├── portfolio/
│   │   └── ui/
│   ├── data/
│   │   └── mockJobs.ts
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   │   ├── AIPortfolio.tsx
│   │   ├── ActivityLogs.tsx
│   │   ├── Jobs.tsx
│   │   └── NotFound.tsx
│   ├── types/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── package-lock.json
├── bun.lock
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig*.json
```

## Getting Started

Requirements: Node.js and npm.

```sh
git clone https://github.com/ghania-03/job-scout-pro.git
cd job-scout-pro
npm install
npm run dev
```

The development server prints its local URL when it starts. To create a production build or check code style, run:

```sh
npm run build
npm run lint
```
