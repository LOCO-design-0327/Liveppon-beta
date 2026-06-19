# AGENTS.md

## Project

- This project is Liveppon, an event-focused POS PWA.
- The app is built with React, Vite, TypeScript, Tailwind CSS, shadcn-style UI components, and vite-plugin-pwa.
- Main application code lives in `src/app`.
- Shared styles live in `src/styles`.
- Static PWA assets and icons live in `public`.
- Build output in `dist` is generated and should not be edited directly.

## Local Commands

- Install dependencies with `npm install`.
- Start the development server with `npm run dev`.
- Verify production build with `npm run build`.
- There is currently no test or lint script in `package.json`; use `npm run build` as the default verification step after code changes.

## Editing Rules

- Keep changes small and focused on the requested behavior.
- Do not rewrite the app structure unless the user explicitly asks for a refactor.
- Do not add new production dependencies unless the user approves first.
- Preserve the existing visual direction and Japanese product language unless the task asks for copy or design changes.
- Prefer existing components in `src/app/components` and `src/app/components/ui` before creating new UI primitives.
- Avoid editing generated folders such as `node_modules` and `dist`.
- For PWA changes, check both `vite.config.ts` and `public/manifest.json` for consistency.

## Data And Behavior

- The app stores many user-facing values in browser local storage through `useLocalStorage`.
- Be careful when changing local storage keys because existing user data may depend on them.
- Owner mode, PIN behavior, sales history, product stock, shipping items, QR settings, backups, archives, and operation logs are user-critical workflows.
- For POS flows, prioritize reliability and clear confirmation over clever UI changes.

## Done When

- The requested behavior is implemented.
- `npm run build` passes, unless the user asked for planning only.
- The final response explains what changed and mentions any verification that could not be run.
