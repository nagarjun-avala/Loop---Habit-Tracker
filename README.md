# Loop – Habit Tracker (front end)

Next.js 14 (App Router) · TypeScript · Tailwind CSS · shadcn/ui · next-themes

This is the web app. It needs the **Loop server** (separate project, `loop-server`) running.

```bash
# 1. start the server first (see loop-server/README.md), default http://localhost:4000
# 2. then here:
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
npm install
npm run dev                        # http://localhost:3000
```

Add the front end's origin to the server's `CORS_ORIGIN` (default `http://localhost:3000`).

## Pages
- `/login`, `/register`, `/forgot-password`: for signed-out visitors. Everything else redirects to login until you are signed in.
- `/reset-password`, `/verify-email`, `/confirm-email-change` and `/unsubscribe` (each with `?token=…`): where the links in emails land (work signed in or out).
- `/` Today: check off habits (saved instantly, rolled back if the server says no), add habits. Tap any earlier day in the week strip (arrows move between weeks) to see and fix that day. The "This week" card compares with the same days last week.
- `/analytics` Analytics: week bars, 12-week heatmap, overview stats, per-habit rates (all from the server).
- `/habits` Habits: edit or delete habits, and open a habit's month calendar to fix any day since it was created.
- `/settings` Settings: name, theme, daily reminder (email, at your chosen time), plus Account (change email, change password, log out, delete account). Time zone is detected from the browser and sent to the server.

## Schedules
Each habit is **every day**, **certain days** (e.g. weekdays), or **N times a week**. A habit counts on a day if it was expected or you did it anyway,
so rest days never look like misses: "Not scheduled today" habits are dimmed and left out of the ring, "N a week" habits show "2 of 3 this week" and only
count as to-dos once you're running out of days, and streaks count scheduled days (or weeks that hit the target). The rules are computed on the server
(`loop-server/src/lib/schedule.ts`); this app just shows them. Pick a schedule in the Add/Edit habit dialog (`components/habits/schedule-picker.tsx`).

## Sign-in
The server keeps you signed in with an `httpOnly` session cookie, so no token is stored in the page.
Use the same host name for the front end and API in development (both `localhost`), or the browser treats them as
different sites and drops the cookie. With the server's demo seed you can sign in as `demo@loop.local` / `password123`.

## Email links
The server emails a verification link at sign-up and a reset link on request (via Resend). Links open these pages, which
call the API with the token. A banner at the top of the app asks unverified users to verify and lets them resend the email.

## Hosting the app and the API on different servers
The sign-in cookie only travels between hosts that are on the **same site**, so how you connect them matters. In order of preference:

1. **One parent domain (best).** `app.example.com` here, `api.example.com` on the server. Set `NEXT_PUBLIC_API_URL=https://api.example.com/api/v1` before building.
   On the server: `APP_URL=https://app.example.com`, `CORS_ORIGIN=https://app.example.com`, `API_URL=https://api.example.com`, `COOKIE_SAMESITE=lax`, `TRUST_PROXY=1`.
2. **Different domains (e.g. two `*.vercel.app` or `*.onrender.com` projects): proxy through this app.** Set only `API_ORIGIN=https://your-api…` here (before
   building) and this app forwards `/api/v1/*` to the API, so the browser only talks to this site. On the server: `APP_URL` and `CORS_ORIGIN` are this app's
   address, and `TRUST_PROXY=2` (this app plus the API host's own proxy). Needs a host that runs Next.js (Vercel, Netlify, Node), not a static export.
3. **Last resort: `COOKIE_SAMESITE=none` on the server.** Works only where third-party cookies are allowed; Safari and Firefox block them.

Run `npm run check:deploy` on the server to check this. It names the problem if the two hosts won't share cookies.

**Symptom of getting it wrong:** sign-in appears to work, then every request is 401 and you're signed out. Check DevTools → Network → the login request for
`set-cookie: loop_session=…` (a ⚠ means the browser blocked it). The app also now says so on the login form.
Also, in local development use `localhost` for both (not `127.0.0.1` for one of them).

## Where things live
- `lib/auth-context.tsx`: who is signed in. `components/auth/`: login/register form and the gates that protect pages.
- Route groups: `app/(auth)` for login/register, `app/(app)` for everything that needs an account.
- `lib/api.ts`: tiny fetch client. `lib/use-api.ts`: GET hook that refetches after any change.
- `lib/habits-context.tsx`, `lib/settings-context.tsx`: server-backed state with optimistic updates.
- Theme colors are CSS variables in `app/globals.css` (`:root` and `.dark`).
- Add shadcn components with `npx shadcn@latest add <name>`.
