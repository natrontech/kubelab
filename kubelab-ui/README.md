# KubeLab UI

## Dependency compatibility

The UI stays on Svelte 4.2.20, SvelteKit 2, Vite 5, Tailwind 3 and their compatible component libraries to retain the existing Svelte component syntax and styling.
The PocketBase SDK stays on 0.21 to match the backend's 0.22 API, and splitpanes stays on 8.0.9 because later releases require Svelte 5.
Dependabot excludes the incompatible version lines so these migrations can be handled separately.

The cookie dependency is overridden to its compatible 0.7 security patch line.
`npm audit` still reports findings in Svelte, SvelteKit and Vite and their dependent packages; resolving all of them requires the deferred framework upgrades.

Use Node 24 or later and `npm ci` to install the locked dependency versions.
Run `npm run check`, `npm run lint` and `npm test` to validate changes; the Playwright regression test mocks PocketBase and uses a local production preview.
Install its isolated browser engine with `npx playwright install chromium` before the first test run.

## Setup

```bash
npm install # install dependencies
npm run build # compile frontend
```

The above produces `build` output directory which is then used by PocketBase to serve the frontend of your app.

## Live Development

```bash
# start the backend, if not already running ...
source .env
npm run dev:backend
# and then start the frontend ...
npm run dev
```

Now visit http://localhost:5173 (ui) or http://localhost:8090 (pb)

## Generated Types

The file `generated-types.ts` contains TypeScript definitions of `Record` types mirroring the fields in your database collections. But it needs to be regenerated every time you modify the schema. This can be done by simply running the `typegen` script in the frontend's `package.json`. So remember to run `npm run typegen` after every schema change.

## Building

To create a production version of your app (static HTML/JS app):

```bash
# compile frontend
npm run build
# and then serve it with pocketbase
npm run backend
```

The above generates output in the `build` folder. Now you can serve production compiled version of the frontend using the backend (with `--publicDir ../frontend/build`), any static file web server, or `npm preview`.
