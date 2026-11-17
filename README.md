# Loop – Habit Tracker

Next.js 14 (App Router) · TypeScript · Tailwind CSS · shadcn/ui · next-themes

```bash
npm install
npm run dev
```

## Pages
- `/` Today: check off habits, add new ones via the dialog.
- `/analytics` Analytics: weekly bars, 12-week heatmap, per-habit rates.

State is mock and in memory (`lib/habits-context.tsx`), so a refresh resets it.
Add more shadcn components with `npx shadcn@latest add <name>`.
Theme colors are CSS variables in `app/globals.css` (`:root` and `.dark`).
