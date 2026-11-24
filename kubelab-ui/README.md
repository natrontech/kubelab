# KubeLab UI

## Setup

Requires Node.js 24 or newer; CI and container builds use Node.js 26.

```bash
npm ci # install the locked dependencies
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

## Dependency compatibility

TypeScript remains on 6.0 because SvelteKit 3 requires TypeScript 6 and the ESLint TypeScript parser supports versions below 6.1.

The standalone UI container serves the static SPA on port 3000; route `/api` to the backend in your reverse proxy, or use the combined image from the repository root.
