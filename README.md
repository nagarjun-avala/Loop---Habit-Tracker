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
- `/reset-password`, `/verify-email` and `/confirm-email-change` (each with `?token=…`): where the links in emails land (work signed in or out).
- `/` Today: check off habits (saved instantly, rolled back if the server says no), add habits. The "This week" card compares with the same days last week.
- `/analytics` Analytics: week bars, 12-week heatmap, overview stats, per-habit rates (all from the server).
- `/habits` Habits: edit or delete habits.
- `/settings` Settings: name, theme, reminder time, plus Account (change email, change password, log out, delete account). Time zone is detected from the browser and sent to the server.

## Sign-in
The server keeps you signed in with an `httpOnly` session cookie, so no token is stored in the page.
Use the same host name for the front end and API in development (both `localhost`), or the browser treats them as
different sites and drops the cookie. With the server's demo seed you can sign in as `demo@loop.local` / `password123`.

## Email links
The server emails a verification link at sign-up and a reset link on request (via Resend). Links open these pages, which
call the API with the token. A banner at the top of the app asks unverified users to verify and lets them resend the email.

## Troubleshooting: sign-in works, then everything is 401 / "signed out"
The login request succeeded but the browser didn't keep or send the session cookie. Open DevTools → Network, click the login
request and look for `set-cookie: loop_session=…` (a ⚠ next to it means the browser blocked it), then check that the next request
(e.g. `/analytics/overview`) has a `cookie` header. This almost always means the app and the API are on **different sites**.

- **Best:** put both under one parent domain (`app.example.com` and `api.example.com`) and keep `COOKIE_SAMESITE=lax` on the server.
- **No custom domain?** Use Option B in `.env.local.example`: set `API_ORIGIN` (the API's URL) and `NEXT_PUBLIC_API_URL=/api/v1`,
  rebuild, and the app forwards `/api/v1/*` to the API so the cookie belongs to this site. On the server, keep this app's address in
  `CORS_ORIGIN` and set `TRUST_PROXY=2` (one proxy for this app, one for the API host) so rate limits count real visitors.
- In local development use the same host name for both (`localhost` for the app and the API, not `127.0.0.1` for one of them).
- The app now checks the session right after you sign in and shows this explanation instead of failing silently.

## Where things live
- `lib/auth-context.tsx`: who is signed in. `components/auth/`: login/register form and the gates that protect pages.
- Route groups: `app/(auth)` for login/register, `app/(app)` for everything that needs an account.
- `lib/api.ts`: tiny fetch client. `lib/use-api.ts`: GET hook that refetches after any change.
- `lib/habits-context.tsx`, `lib/settings-context.tsx`: server-backed state with optimistic updates.
- Theme colors are CSS variables in `app/globals.css` (`:root` and `.dark`).
- Add shadcn components with `npx shadcn@latest add <name>`.
