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
Browsers only keep the sign-in cookie of a site you are actually on. If the app is at `my-app.vercel.app` and the API at `my-api.onrender.com` (or another
`*.vercel.app`), the API's cookie is a *third-party* cookie, which iPhones (every iOS browser) and many Android setups block. Desktop Chrome still allows it,
so the symptom is "login works on my laptop but not on phones": you sign in, then the app says your browser didn't keep the cookie.

**What this app does about it:** in production builds it forwards `/api/v1/*` to your API itself, so the browser only talks to the app's own address and the cookie
is first-party. You don't have to do anything special:

1. Set `NEXT_PUBLIC_API_URL=https://your-api.example.com/api/v1` (or `API_ORIGIN=https://your-api.example.com`) **before building** (on Vercel: Project → Settings →
   Environment Variables, then redeploy).
2. On the API server: `APP_URL` and `CORS_ORIGIN` = this app's exact address (e.g. `https://my-app.vercel.app`; comma-separate extra ones), `COOKIE_SAMESITE=lax`,
   `TRUST_PROXY=2`, and leave `API_URL` unset (browsers never call it directly).
3. Switching the API to another host (Render ↔ Vercel) means changing that one address and redeploying the app, since it is baked in at build time.

**Direct mode** (browser calls the API itself) is only for when both live under one parent domain, `app.example.com` + `api.example.com`: add `API_MODE=direct`.
Local development is always direct.

Run `npm run check:deploy` on the server to check the server's side. If login still fails, open DevTools → Network → the login request: you should see
`set-cookie: loop_session=…` on a request to **your app's own address** (`/api/v1/auth/login`). If the request goes to a different address, the app was built
without the setting above.
In local development use `localhost` for both (not `127.0.0.1` for one of them).

## Where things live
- `lib/auth-context.tsx`: who is signed in. `components/auth/`: login/register form and the gates that protect pages.
- Route groups: `app/(auth)` for login/register, `app/(app)` for everything that needs an account.
- `lib/api.ts`: tiny fetch client. `lib/use-api.ts`: GET hook that refetches after any change.
- `lib/habits-context.tsx`, `lib/settings-context.tsx`: server-backed state with optimistic updates.
- Theme colors are CSS variables in `app/globals.css` (`:root` and `.dark`).
- Add shadcn components with `npx shadcn@latest add <name>`.

## Time zone
The app sends the browser's time zone to the server at sign-up and after sign-in. Until it knows it, it shows **Asia/Kolkata (IST)**, which is also the server's default.
