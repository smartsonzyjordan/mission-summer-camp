# Mission Summer Camp: Galaxy Journey

A galaxy-themed Progressive Web App for a child's summer camp mission journey. It includes child profile setup, parent PIN approval, daily missions, planner, rewards, ranks, certificates, journal, AI-style coach, analytics, and mini games.

## Tech Stack

- Next.js
- React
- TypeScript
- TailwindCSS
- Framer Motion
- Tabler Icons
- localStorage persistence
- Static PWA export

## Local Setup

```bash
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:3000
```

## Build

```bash
npm run build
```

Because `next.config.ts` uses `output: "export"`, the static production app is generated in:

```text
out/
```

## GitHub Upload Notes

Upload the source project to GitHub, but do not upload:

- `node_modules/`
- `.next/`
- `out/`
- `.npm-cache/`
- generated `.zip` files

These are already listed in `.gitignore`.

## App Flow

1. Create a child profile with name, age, grade, and mission description.
2. Child marks completed missions.
3. Parent approves completed tasks using the parent PIN.
4. Stars unlock ranks, rewards, games, and certificates.
5. Certificates use the provided Mission Summer Camp artwork and dynamically display the saved child profile name.

## Deployment

This app can be deployed to static hosts that support exported Next.js sites, such as:

- Vercel
- Netlify
- GitHub Pages

For GitHub Pages, upload/build from the source repository and publish the generated `out/` folder through a Pages workflow or a static hosting workflow.
