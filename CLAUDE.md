# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A budget tracking app built with SvelteKit 2, Svelte 5 (runes mode), TypeScript, and Tailwind CSS v4. Uses pnpm as the package manager. The project is in early stages — `budget-demo.html` contains a standalone HTML/CSS/JS prototype of the UI (dark theme, Ukrainian locale) that serves as the design reference.

## Commands

- **Dev server:** `pnpm dev`
- **Build:** `pnpm build`
- **Preview production build:** `pnpm preview`
- **Type check:** `pnpm check`
- **Lint:** `pnpm lint` (runs Prettier + ESLint)
- **Format:** `pnpm format`

## Tech Stack & Conventions

- **Svelte 5 runes mode** is enforced in `svelte.config.js` — use `$state`, `$derived`, `$effect`, `$props()` instead of legacy reactive syntax
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- **UI components:** bits-ui (headless) and vaul-svelte (drawer)
- **Icons:** `@lucide/svelte`
- **PWA support:** configured via `@vite-pwa/sveltekit`
- **Path aliases:** `$lib` maps to `src/lib/` (SvelteKit default)
- **ESLint + Prettier** with svelte plugins; `no-undef` rule is disabled for TS compatibility
